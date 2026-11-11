// 作業管理アプリ app.js Version: V1K (TMA手動再実行ボタン追加)
// version: V1L (RK_portal統合に伴いGITHUB_IMG_API/TMA_GAS_URL/SHEETS_URLを共通設定化)
// version: V1M (TMA自動入力: 30秒の独立タイマーを廃止しfetch結果ベースの判定に変更、
//               リトライを1回目・2回目とも最大60秒待機に変更、requestId使い回しを廃止)
// version: V1N (TMA自動入力: GitHub Actions起動遅延を3分で検知しGitLabへ自動切替)
(() => {
  // スプラッシュ画像は担当者ごとにimgフォルダ配下のサブフォルダを分ける（img/katayama, img/tojima）
  const GITHUB_IMG_API = (() => {
    const user = (typeof getCurrentUser === "function") ? getCurrentUser() : null;
    const sub = user ? user.id : "katayama";
    return `https://api.github.com/repos/rkworks2025-coder/RK_portal/contents/work/img/${sub}`;
  })();
  const splash = document.getElementById('splash');
  const splashImg = document.getElementById('splashImg');
  const toast = document.getElementById('toast');
  const completeBtn = document.getElementById('completeBtn');
  
  let startTime = null;
  let timerId = null;
  let currentVehicle = { station: '', model: '', plate_full: '' };

  let alarmInterval = null;
  let audioCtx = null;

  function playBeep(type = 'success') {
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain); gain.connect(audioCtx.destination);
    
    if (type === 'success') {
      osc.frequency.setValueAtTime(880, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
      osc.start(); osc.stop(audioCtx.currentTime + 0.2);
    } else if (type === 'alarm') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(1000, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
      osc.start(); osc.stop(audioCtx.currentTime + 0.2);
    } else {
      [0, 0.3, 0.6].forEach(t => {
        osc.frequency.setValueAtTime(440, audioCtx.currentTime + t);
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime + t);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + t + 0.2);
      });
      osc.start(); osc.stop(audioCtx.currentTime + 0.8);
    }
  }

  function startAlarmLoop() {
    if (alarmInterval) return;
    playBeep('alarm');
    alarmInterval = setInterval(() => playBeep('alarm'), 500);
  }

  function stopAlarmLoop() {
    if (alarmInterval) {
      clearInterval(alarmInterval);
      alarmInterval = null;
    }
  }

  function showToast(msg, isError = false) {
    toast.textContent = msg;
    toast.hidden = false;
    toast.className = isError ? 'toast error' : 'toast';
    if (!isError) setTimeout(() => toast.hidden = true, 3000);
  }

  function showConfirmModal(titleText, bodyText, okText = "OK", cancelText = "キャンセル") {
    return new Promise((resolve) => {
      const modal = document.getElementById('confirmModal');
      const msgEl = modal.querySelector('.modal-msg');
      const okBtn = document.getElementById('modalOkBtn');
      const cancelBtn = document.getElementById('modalCancelBtn');

      if (msgEl) {
        msgEl.innerHTML = `<strong>${titleText}</strong><br><span style="font-size:0.9em;">${bodyText}</span>`;
      }
      if (okBtn) okBtn.textContent = okText;
      if (cancelBtn) cancelBtn.textContent = cancelText;

      modal.classList.add('show');

      const handleResponse = (res) => {
        modal.classList.remove('show');
        okBtn.onclick = null;
        cancelBtn.onclick = null;
        resolve(res);
      };

      okBtn.onclick = () => handleResponse(true);
      cancelBtn.onclick = () => handleResponse(false);
    });
  }

  // ▼ 追加(V1M): requestId生成を1箇所に集約。
  // リトライのたびに新しいIDを発行するために使う（同じIDを使い回すと、
  // GAS側のdedupeキャッシュが「処理済み」と誤判定しok:trueを返す可能性があるため）。
  function generateRequestId() {
    return "req-" + Date.now() + "-" + Math.random().toString(36).slice(-4);
  }

  // ▼ 追加(V1M): TMAトリガーAPIを1回叩くための共通処理。
  // AbortControllerでtimeoutMsだけ待ち、それを超えたら通信失敗として扱う
  // （GAS側が混雑して応答が遅いだけのケースを異常終了させないよう、
  // ここは60秒という長めの値を渡して使う想定）。
  async function postTmaAction(action, plate, requestId, timeoutMs) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(`${window.TMA_GAS_URL}?action=${action}`, {
        method: "POST",
        body: JSON.stringify({ plate, requestId }),
        keepalive: true,
        signal: controller.signal
      });
      return await res.json();
    } catch (e) {
      return { ok: false, error: String(e) };
    } finally {
      clearTimeout(timer);
    }
  }

  // ▼ 修正(V1M): 従来あった30秒の独立タイマー（tmaMonitorTimer/isTmaSuccess）を廃止。
  // このタイマーは実際のfetchの完了とは無関係に30秒で強制的に「失敗」と判定して
  // いたため、GAS側の処理が混雑等で30秒を超えた場合、実際には正常に処理が進んで
  // いても誤って失敗アラートを出してしまっていた。
  // 判定はfetchの結果だけを見る方式に変更し、1回目・2回目とも最大60秒待機する。
  // 2回目はrequestIdを発行し直す（使い回しによる誤判定防止）。
  async function triggerTmaWithRetry(plate, requestId) {
    let json = await postTmaAction("triggerTMA", plate, requestId, 60000);
    if (json.ok) {
      showToast("✅ TMA自動入力スタート");
      addTmaWatch(plate); // ▼ 追加(V1N): 起動遅延の監視を開始
      return;
    }
    console.warn("TMA 1回目失敗: " + (json.error || ""));

    const retryRequestId = generateRequestId();
    json = await postTmaAction("triggerTMA", plate, retryRequestId, 60000);
    if (json.ok) {
      showToast("✅ TMA自動入力スタート");
      addTmaWatch(plate); // ▼ 追加(V1N): 起動遅延の監視を開始
      return;
    }
    console.warn("TMA 2回目失敗: " + (json.error || ""));

    // 2回とも失敗した時だけ、ここで初めて失敗をユーザーに知らせる
    startAlarmLoop();
    const retry = await showConfirmModal(
      "⚠️ 自動入力失敗！",
      "TMA自動入力の通信に失敗しました、再送しますか？",
      "再送する",
      "キャンセル"
    );
    stopAlarmLoop();
    if (retry) {
      triggerTmaWithRetry(plate, generateRequestId());
    }
  }

  // ▼ 修正(V1M): GitHub Actions障害時のGitLabフォールバック。
  // 従来は3回のリトライで同じrequestIdを使い回しており、main.gs側のdedupe
  // キャッシュにより1回目が実際は失敗していても2回目以降がok:trueを返して
  // しまう可能性があった。リトライごとに新しいrequestIdを発行するよう修正。
  async function triggerTmaGitlab(plate, requestId) {
    const intervals = [0, 3000, 5000];
    let lastError = "";
    for (let i = 0; i < 3; i++) {
      try {
        await new Promise(r => setTimeout(r, intervals[i]));
        const currentRequestId = i === 0 ? requestId : generateRequestId();
        const res = await fetch(`${window.TMA_GAS_URL}?action=triggerTMA_GITLAB`, {
          method: "POST",
          body: JSON.stringify({ plate, requestId: currentRequestId }),
          keepalive: true
        });
        const json = await res.json();
        if (json.ok) {
          showToast("✅ GitLabでTMA自動入力スタート");
          return;
        }
        lastError = json.error || "";
      } catch (e) { console.warn(`TMA GitLab Retry ${i+1} failed`); lastError = String(e); }
    }
    showToast("❌ GitLab送信失敗: " + lastError, true);
  }

  // ▼ 追加(V1N): GitHub Actions起動遅延の監視（GitLabへの自動切替）。
  // GitHub側の障害でランナーが割り当てられず、実行が長時間queuedのまま止まったり
  // startup_failureになったりすることがあるため、送信から3分後にGitHubの公開APIで
  // 実行状況を確認し、起動が3分を超えて遅れていればGitLab経由で自動実行する。
  // main.py側も同じ基準（実行作成→ランナー割当が3分超）で入力を中止するため二重入力にならない。
  // 送信記録はlocalStorageに保存し、画面を閉じていた場合は次にこの画面を開いた時に確認する。
  const TMA_WATCH_KEY = "work:tma_watch";
  const TMA_WATCH_LIMIT_MS = 180000; // main.py の GITHUB_START_DELAY_LIMIT と必ず同じ値にすること
  const TMA_WATCH_CHECK_DELAY_MS = TMA_WATCH_LIMIT_MS + 5000;
  const TMA_WATCH_NOTFOUND_RETRY_MS = 60000;
  const TMA_RUNS_API = "https://api.github.com/repos/rkworks2025-coder/TMA-Auto-Input/actions/runs";
  const tmaWatchBusy = new Set();

  function loadTmaWatch() {
    try { return JSON.parse(localStorage.getItem(TMA_WATCH_KEY) || "[]"); } catch (e) { return []; }
  }
  function saveTmaWatch(list) {
    try { localStorage.setItem(TMA_WATCH_KEY, JSON.stringify(list)); } catch (e) {}
  }
  function updateTmaWatch(id, patch) {
    saveTmaWatch(loadTmaWatch().map(w => w.id === id ? Object.assign({}, w, patch) : w));
  }
  function removeTmaWatch(id) {
    saveTmaWatch(loadTmaWatch().filter(w => w.id !== id));
  }
  // 車番の表記ゆれ（全角/半角・スペース）を吸収して比較する
  function normPlateForWatch(s) {
    return String(s || "").normalize("NFKC").replace(/\s+/g, "");
  }

  function addTmaWatch(plate) {
    const w = { id: generateRequestId(), plate, sentAt: Date.now(), notFound: 0, nextCheckAt: Date.now() + TMA_WATCH_CHECK_DELAY_MS };
    const list = loadTmaWatch();
    list.push(w);
    saveTmaWatch(list);
    setTimeout(processTmaWatch, TMA_WATCH_CHECK_DELAY_MS);
  }

  async function processTmaWatch() {
    const now = Date.now();
    for (const w of loadTmaWatch()) {
      if (w.nextCheckAt > now) {
        setTimeout(processTmaWatch, w.nextCheckAt - now + 500);
        continue;
      }
      if (tmaWatchBusy.has(w.id)) continue;
      // 並行して動いた別の確認処理で既に判定済みなら何もしない（GitLab二重実行防止）
      const cur = loadTmaWatch().find(x => x.id === w.id);
      if (!cur || cur.nextCheckAt > Date.now()) continue;
      tmaWatchBusy.add(w.id);
      try { await checkTmaWatch(cur); } finally { tmaWatchBusy.delete(w.id); }
    }
  }

  async function checkTmaWatch(w) {
    let runs;
    try {
      const res = await fetch(`${TMA_RUNS_API}?per_page=30`, { headers: { "Accept": "application/vnd.github+json" } });
      if (!res.ok) throw new Error("HTTP " + res.status);
      runs = (await res.json()).workflow_runs || [];
    } catch (e) {
      // 確認自体ができない時は1分後に再確認（判定できないまま切り替えない）
      console.warn("TMA監視: GitHub API取得失敗 " + e);
      updateTmaWatch(w.id, { nextCheckAt: Date.now() + TMA_WATCH_NOTFOUND_RETRY_MS });
      setTimeout(processTmaWatch, TMA_WATCH_NOTFOUND_RETRY_MS + 500);
      return;
    }

    const windowStart = w.sentAt - 30000; // 端末時計のずれ吸収
    const inWindow = runs.filter(r => Date.parse(r.created_at) >= windowStart);
    const target = normPlateForWatch(w.plate);
    const matched = inWindow
      .filter(r => normPlateForWatch(r.display_title).includes(target))
      .sort((a, b) => Date.parse(a.created_at) - Date.parse(b.created_at))[0];

    if (!matched) {
      if (w.notFound < 1) {
        updateTmaWatch(w.id, { notFound: w.notFound + 1, nextCheckAt: Date.now() + TMA_WATCH_NOTFOUND_RETRY_MS });
        setTimeout(processTmaWatch, TMA_WATCH_NOTFOUND_RETRY_MS + 500);
        return;
      }
      removeTmaWatch(w.id);
      // 期間内に車番の付いていない実行がある＝車番表記の不一致の可能性があるため、二重入力防止で自動切替しない
      if (inWindow.some(r => !/^TMA\s/.test(r.display_title || ""))) {
        showToast(`⚠️ ${w.plate}: GitHubの実行を特定できません。TMAを確認してください`, true);
        return;
      }
      showToast(`⚠️ ${w.plate}: GitHubで実行が見つからないためGitLabで実行します`, true);
      triggerTmaGitlab(w.plate, generateRequestId());
      return;
    }

    const createdAt = Date.parse(matched.created_at);
    let delayMs;
    if (matched.conclusion === "startup_failure") {
      delayMs = Infinity;
    } else {
      let startedAt = null;
      try {
        const jr = await fetch(`${TMA_RUNS_API}/${matched.id}/jobs`, { headers: { "Accept": "application/vnd.github+json" } });
        if (!jr.ok) throw new Error("HTTP " + jr.status);
        const jobs = (await jr.json()).jobs || [];
        // queued中のジョブにもstarted_atが入ることがあるため、queued以外のジョブだけを見る
        const st = jobs.filter(j => j.status !== "queued" && j.started_at).map(j => Date.parse(j.started_at));
        if (st.length) startedAt = Math.min(...st);
      } catch (e) {
        console.warn("TMA監視: ジョブ取得失敗 " + e);
        updateTmaWatch(w.id, { nextCheckAt: Date.now() + TMA_WATCH_NOTFOUND_RETRY_MS });
        setTimeout(processTmaWatch, TMA_WATCH_NOTFOUND_RETRY_MS + 500);
        return;
      }
      delayMs = (startedAt !== null ? startedAt : Date.now()) - createdAt;
      if (startedAt === null && delayMs <= TMA_WATCH_LIMIT_MS) {
        // まだ基準時間に達していない（端末時計のずれ等）→ 基準到達後に再確認
        const wait = TMA_WATCH_LIMIT_MS - delayMs + 5000;
        updateTmaWatch(w.id, { nextCheckAt: Date.now() + wait });
        setTimeout(processTmaWatch, wait + 500);
        return;
      }
    }

    removeTmaWatch(w.id);
    if (delayMs > TMA_WATCH_LIMIT_MS) {
      showToast(`⚠️ ${w.plate}: GitHubの起動が遅延したためGitLabで実行します`, true);
      triggerTmaGitlab(w.plate, generateRequestId());
    }
  }

  function initTmaWatch() {
    processTmaWatch();
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") processTmaWatch();
    });
  }

  // ▼ 追加: TMA手動再実行ボタンの初期化
  function initWorkTmaBtn() {
    const tmaBtn = document.getElementById('workTmaBtn');
    const tmaModal = document.getElementById('workTmaModal');
    const tmaModalTitle = document.getElementById('workTmaModalTitle');
    const tmaModalModel = document.getElementById('workTmaModalModel');
    const tmaModalOk = document.getElementById('workTmaModalOk');
    const tmaModalGitlab = document.getElementById('workTmaModalGitlab');
    const tmaModalCancel = document.getElementById('workTmaModalCancel');
    if (!tmaBtn || !tmaModal || !tmaModalOk || !tmaModalGitlab || !tmaModalCancel) return;

    tmaBtn.addEventListener('click', () => {
      // モーダルに車番・車種を表示
      if (tmaModalTitle) tmaModalTitle.textContent = `【${currentVehicle.plate_full || '--'}】`;
      if (tmaModalModel) tmaModalModel.textContent = currentVehicle.model || '';

      tmaModal.classList.add('show');

      tmaModalOk.onclick = () => {
        tmaModal.classList.remove('show');
        // 新しいrequestIdを発行してGASへ直接POST（遷移なし）
        const requestId = generateRequestId();
        triggerTmaWithRetry(currentVehicle.plate_full, requestId);
      };

      tmaModalGitlab.onclick = async () => {
        tmaModal.classList.remove('show');
        const confirmed = await showConfirmModal(
          "この操作はサーバー障害時の非常用です",
          "本当に実行しますか？",
          "OK",
          "キャンセル"
        );
        if (!confirmed) return;
        const requestId = generateRequestId();
        triggerTmaGitlab(currentVehicle.plate_full, requestId);
      };

      tmaModalCancel.onclick = () => {
        tmaModal.classList.remove('show');
      };
    });
  }

  function startStopwatch() {
    startTime = Date.now();
    timerId = setInterval(() => {
      const diff = Math.floor((Date.now() - startTime) / 1000);
      const mm = String(Math.floor(diff / 60)).padStart(2, '0');
      const ss = String(diff % 60).padStart(2, '0');
      document.getElementById('stopwatch').textContent = `${mm}:${ss}`;
    }, 1000);
    
    const now = new Date();
    document.getElementById('unlockTime').textContent = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  }

  async function handleWorkComplete() {
    const ok = await showConfirmModal("作業完了", "送信して終了しますか？", "OK", "キャンセル");
    if (!ok) return;

    clearInterval(timerId);
    completeBtn.disabled = true;
    completeBtn.textContent = "送信中...";
    
    const now = new Date();
    const lockTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    document.getElementById('lockTime').textContent = lockTime;

    const payload = {
      mode: 'lock_only',
      station: currentVehicle.station,
      plate_full: currentVehicle.plate_full,
      model: currentVehicle.model,
      unlock: document.getElementById('unlockTime').textContent,
      lock: lockTime
    };

    const body = new URLSearchParams();
    body.set('key', window.SHEETS_KEY);
    body.set('json', JSON.stringify(payload));

    fetch(window.SHEETS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
      keepalive: true
    }).catch(e => console.error(e));

    try { localStorage.setItem("junkai:completed_plate", currentVehicle.plate_full); } catch(e){}
    setTimeout(() => { history.back(); }, 100);
  }

  function initUI() {
    document.querySelectorAll('.toggle-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const group = btn.parentElement;
        group.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });
    const mmSelects = document.querySelectorAll('select[id$="_mm"]');
    const yySelects = document.querySelectorAll('select[id$="_yy"]');
    for(let i=1; i<=12; i++) {
      mmSelects.forEach(s => s.insertAdjacentHTML('beforeend', `<option value="${String(i).padStart(2, '0')}">${String(i).padStart(2, '0')}</option>`));
    }
    const curYear = new Date().getFullYear();
    for(let i=0; i<10; i++) {
      yySelects.forEach(s => s.insertAdjacentHTML('beforeend', `<option value="${curYear+i}">${curYear+i}</option>`));
    }
  }

  function init() {
    // 担当者が未選択ならポータルの選択画面へ戻す（RK_portal統合対応）
    if (typeof requireUser === "function" && !requireUser("../select-user.html")) return;
    const p = new URLSearchParams(location.search);
    currentVehicle.station = p.get('station') || '';
    currentVehicle.model = p.get('model') || '';
    currentVehicle.plate_full = p.get('plate_full') || p.get('plate') || '';

    initUI();
    initWorkTmaBtn(); // ▼ 追加
    initTmaWatch(); // ▼ 追加(V1N): 未確認のTMA送信があれば起動遅延を確認
    completeBtn.addEventListener('click', handleWorkComplete);
    startStopwatch();

    splash.addEventListener('click', () => {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === 'suspended') audioCtx.resume();

      splash.style.display = 'none';
      playBeep('success');
      
      const tmaPlate = p.get('tma_plate');
      const tmaReqId = p.get('tma_req_id');
      if (tmaPlate && tmaReqId) triggerTmaWithRetry(tmaPlate, tmaReqId);

      document.getElementById('disp_station').textContent = currentVehicle.station || '--';
      document.getElementById('disp_model').textContent = currentVehicle.model || '--';
      document.getElementById('disp_plate').textContent = currentVehicle.plate_full || '--';
    }, { once: true });

    const splashImgParam = p.get('splash_img');
    if (splashImgParam) {
      splashImg.src = splashImgParam;
    } else {
      const cacheKey = "junkai:splash_images";
      const usedKey  = "junkai:splash_used";

      // ビンゴ方式（非復元抽選）: 表示済みは全消化まで抽選から除外し、
      // 全消化後に使用済みをリセットして再び全画像から抽選する。
      // 使用済みはlocalStorageで永続化（アプリ再起動をまたいで継続）。
      function readJSON(key) {
        try {
          const stored = localStorage.getItem(key);
          return stored ? JSON.parse(stored) : [];
        } catch(e) { return []; }
      }
      function writeJSON(key, val) {
        try { localStorage.setItem(key, JSON.stringify(val)); } catch(e) {}
      }

      // 画像リストから1枚をビンゴ方式で選んでsrcにセットする
      function pickSplash(images) {
        if (!images || images.length === 0) return false;

        let used = readJSON(usedKey);
        // 画像リストが更新された場合に備え、現リストに無い使用済みURLは除外
        used = used.filter(u => images.includes(u));

        // 未使用（リスト − 使用済み）を算出
        let remaining = images.filter(img => !used.includes(img));

        // 全消化していたらリセットして全画像から抽選
        if (remaining.length === 0) {
          used = [];
          remaining = images.slice();
        }

        const chosen = remaining[Math.floor(Math.random() * remaining.length)];
        splashImg.src = chosen;

        used.push(chosen);
        writeJSON(usedKey, used);
        return true;
      }

      // まずキャッシュ済みリストで即時抽選（2回目以降もランダム表示）
      const cachedImages = readJSON(cacheKey);
      pickSplash(cachedImages);

      // 裏でリストを更新。初回でキャッシュが無かった場合はここで抽選
      fetch(GITHUB_IMG_API)
        .then(res => res.json())
        .then(files => {
          const images = files.filter(f => f.name.match(/\.(jpg|jpeg|png|gif)$/i)).map(f => f.download_url);
          if (images.length > 0) {
            writeJSON(cacheKey, images);
            if (cachedImages.length === 0) pickSplash(images);
          }
        })
        .catch(() => {
          if (cachedImages.length === 0) splashImg.style.display = 'none';
        });
    }
  }
  init();
})();

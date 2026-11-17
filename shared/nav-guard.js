/* shared/nav-guard.js
   誤フリップ（正規ルート以外の画面遷移）検知の共通ロジック。
   正規ルート: 巡回 → タイヤ点検 → 巡回 → 作業管理 → 巡回

   ① 戻る方向のフリップ
      ページ読み込み後の最初のタップ時に「ガード用の履歴」を1つ積んでおく。
      フリップで戻ると、まずこのガード用履歴が消費されるだけで画面は移動しないため、
      そこでモーダルを出して本当に移動するか確認する。
        キャンセル → ガードを積み直してその画面に残る
        OK         → 本当に前の画面へ戻る
   ② 進む方向のフリップ
      iOSの仕様上、移動前に止められないため、完了済みの画面に戻ってきた直後に
      モーダルを出す。
        キャンセル → すぐ前の画面（巡回）へ戻す
        OK         → そのまま残る

   各画面は history.state に固有のページIDを持ち、完了済みのページIDを
   localStorage に記録することで「完了済み画面への再訪」を判定する。

   ※ 当面は片山のみ有効（戸島は様子見後に適用予定）。
*/
(function () {
  const user = (typeof getCurrentUser === "function") ? getCurrentUser() : null;
  const enabled = !!(user && user.id === "katayama");

  const DONE_KEY = "rk:nav_done_ids";
  const DONE_MAX = 50;

  // ===== ページIDの付与（履歴をまたいで同じ画面を識別する） =====
  const initialState = history.state || {};
  const revisit = !!initialState.rkPageId; // 履歴移動・再読み込みで戻ってきた画面か
  const pageId = initialState.rkPageId || ("p" + Date.now() + "-" + Math.random().toString(36).slice(2, 8));
  if (enabled && !revisit) {
    try { history.replaceState(Object.assign({}, initialState, { rkPageId: pageId }), ""); } catch (e) {}
  }

  let armed = false;    // ガード用履歴を積んでいる状態か
  let silentPop = false; // ガードを静かに外す時のpopstateを無視するためのフラグ
  let leaving = false;   // 意図した画面離脱中か
  let modalOpen = false;
  let leaveHandler = null; // 画面ごとの離脱方法（無ければ history.back）

  // ===== 完了済みページIDの記録 =====
  function loadDone() {
    try { return JSON.parse(localStorage.getItem(DONE_KEY) || "[]"); } catch (e) { return []; }
  }
  function saveDone(list) {
    try { localStorage.setItem(DONE_KEY, JSON.stringify(list.slice(-DONE_MAX))); } catch (e) {}
  }
  function isDone() { return loadDone().includes(pageId); }
  function markDone() {
    const list = loadDone().filter(x => x !== pageId);
    list.push(pageId);
    saveDone(list);
  }
  function unmarkDone() { saveDone(loadDone().filter(x => x !== pageId)); }

  // ===== モーダル（各アプリのCSSに依存しないよう自前で持つ） =====
  function showModal(title, body, okText, cancelText) {
    return new Promise(resolve => {
      const overlay = document.createElement("div");
      overlay.style.cssText = "position:fixed;inset:0;z-index:2147483000;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;padding:20px;";
      const box = document.createElement("div");
      box.style.cssText = "background:#1f2226;color:#fff;border-radius:14px;padding:20px 18px 16px;width:100%;max-width:320px;text-align:center;box-shadow:0 8px 30px rgba(0,0,0,.5);font-family:-apple-system,BlinkMacSystemFont,sans-serif;";
      const t = document.createElement("div");
      t.style.cssText = "font-size:17px;font-weight:bold;margin-bottom:8px;color:#ffcc4d;";
      t.textContent = title;
      const b = document.createElement("div");
      b.style.cssText = "font-size:15px;margin-bottom:18px;line-height:1.5;";
      b.textContent = body;
      const row = document.createElement("div");
      row.style.cssText = "display:flex;gap:10px;";
      const mk = (label, primary) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.textContent = label;
        btn.style.cssText = "flex:1;font-size:16px;padding:12px 0;border-radius:10px;border:none;font-weight:bold;" +
          (primary ? "background:#3a7bd5;color:#fff;" : "background:#3a3f45;color:#fff;");
        return btn;
      };
      const cancelBtn = mk(cancelText, false);
      const okBtn = mk(okText, true);
      row.appendChild(cancelBtn);
      row.appendChild(okBtn);
      box.appendChild(t); box.appendChild(b); box.appendChild(row);
      overlay.appendChild(box);
      document.body.appendChild(overlay);
      const done = (res) => { overlay.remove(); resolve(res); };
      okBtn.addEventListener("click", () => done(true), { once: true });
      cancelBtn.addEventListener("click", () => done(false), { once: true });
    });
  }

  // ===== ガードの設置・解除 =====
  function arm() {
    if (!enabled || armed) return;
    if (history.state && history.state.rkGuard) { armed = true; return; }
    try {
      history.pushState({ rkPageId: pageId, rkGuard: true }, "");
      armed = true;
    } catch (e) {}
  }

  // iOSはユーザー操作なしで積んだ履歴をフリップで飛ばすことがあるため、
  // 最初のタップを待ってからガードを積む
  function armOnFirstTouch() {
    if (!enabled) return;
    const h = () => {
      document.removeEventListener("touchend", h, true);
      document.removeEventListener("click", h, true);
      arm();
    };
    document.addEventListener("touchend", h, true);
    document.addEventListener("click", h, true);
  }

  // ガードを静かに外す（以後のフリップは確認なしで前の画面へ戻る）
  function disarm() {
    if (!armed) return;
    armed = false;
    if (history.state && history.state.rkGuard) {
      silentPop = true;
      history.back();
    }
  }

  // 意図した離脱（完了ボタン等）。ガードがあれば一緒に飛ばして前の画面へ戻る
  function leave() {
    leaving = true;
    if (typeof leaveHandler === "function" && leaveHandler(armed && history.state && history.state.rkGuard) === true) return;
    if (armed && history.state && history.state.rkGuard) {
      armed = false;
      history.go(-2);
    } else {
      history.back();
    }
  }

  window.addEventListener("popstate", async (e) => {
    if (!enabled) return;
    if (silentPop) { silentPop = false; return; }
    if (leaving) return;
    const s = e.state || {};
    if (s.rkGuard) { armed = true; return; } // 進む方向でガード位置に戻った
    if (!armed) return;
    // ガード用履歴が消費された＝戻る方向のフリップを検知
    armed = false;
    if (modalOpen) return;
    modalOpen = true;
    const ok = await showModal("⚠️ 誤操作を検知しました", "本当に画面を遷移しますか？", "OK", "キャンセル");
    modalOpen = false;
    if (ok) {
      if (typeof api.onConfirmLeave === "function") { try { api.onConfirmLeave(); } catch (err) {} }
      leave();
    } else {
      arm();
    }
  });

  // ===== 完了済み画面への再訪（進む方向のフリップ）の確認 =====
  // 戻り値: true=この画面に残る / false=前の画面へ戻した
  async function confirmRevisitIfDone() {
    if (!enabled || !isDone()) return true;
    if (modalOpen) return true;
    modalOpen = true;
    const ok = await showModal("⚠️ 誤操作を検知しました", "完了済みの画面に移動しました。この画面を開きますか？", "OK", "キャンセル");
    modalOpen = false;
    if (!ok) {
      leaving = true;
      history.back();
      return false;
    }
    return true;
  }

  // bfcacheから復元された場合（JSの状態が残ったまま戻ってきた場合）
  window.addEventListener("pageshow", async (e) => {
    if (!enabled || !e.persisted) return;
    // 離脱時の状態が残っているためリセットする
    leaving = false;
    silentPop = false;
    armed = !!(history.state && history.state.rkGuard);
    const stay = await confirmRevisitIfDone();
    // 未完了の画面に戻ってきた場合はガードを積み直す
    if (stay && !isDone() && !armed && typeof api.shouldRearm === "function" && api.shouldRearm()) armOnFirstTouch();
  });

  const api = {
    enabled,
    pageId,
    revisit,
    arm,
    armOnFirstTouch,
    disarm,
    leave,
    isDone,
    markDone,
    unmarkDone,
    confirmRevisitIfDone,
    setLeaveHandler(fn) { leaveHandler = fn; },
    onConfirmLeave: null,
    shouldRearm: null
  };
  window.RKNavGuard = api;
})();

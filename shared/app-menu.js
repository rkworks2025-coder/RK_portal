/* shared/app-menu.js
   全アプリ共通の3点メニュー。

   各アプリのヘッダー内の「既存ボタン群」の中に、実際の子要素として
   3点メニューボタンを挿入する。画面に絶対座標で重ねる方式は、
   アプリごとにヘッダーのボタン配置が違うため衝突しやすく、
   採用していない（挿入先が見つからない場合のみ右上に固定表示する）。

   各アプリのindex.htmlで以下を読み込むだけで動作する：
     <script src="../shared/user-context.js"></script>
     <script src="../shared/app-menu.js"></script>
   （JKS/予約表示/JKS-IIのように /tjm/ に分割されているアプリは、
    現在ログイン中の担当者に応じてリンク先を自動的に振り分ける）

   リンクは相対パスではなく、ポータルのGitHub Pages URLを
   起点にしたフルパスで書く。/tjm/ のようにアプリごとに
   階層の深さが違っても、常に同じ場所へ飛ばすため。
*/

(function () {
  const STYLE = `
    .rk-appmenu-btn, .rk-appmenu-btn-inline {
      -webkit-appearance: none;
      appearance: none;
      border-radius: 50%;
      background: rgba(255,255,255,0.08);
      border: 1px solid rgba(255,255,255,0.25);
      color: #fff;
      font-size: 18px;
      line-height: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
      padding: 0;
    }
    /* 挿入先が見つからない場合のフォールバック（画面右上に固定） */
    .rk-appmenu-btn {
      position: fixed;
      top: calc(8px + env(safe-area-inset-top));
      right: 8px;
      width: 36px;
      height: 36px;
      font-size: 20px;
      z-index: 2000;
    }
    /* 各アプリのヘッダー内に挿入する場合（既存ボタン列の一員として並ぶ） */
    .rk-appmenu-btn-inline {
      flex-shrink: 0;
      width: 30px;
      height: 30px;
      margin-left: 4px;
    }
    .rk-appmenu-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.45);
      z-index: 2001;
      display: none;
    }
    .rk-appmenu-overlay.show { display: block; }
    .rk-appmenu-popup {
      position: fixed;
      background: #1a1a1e;
      border: 1px solid rgba(255,255,255,0.15);
      border-radius: 12px;
      min-width: 160px;
      overflow: hidden;
      z-index: 2002;
      box-shadow: 0 8px 24px rgba(0,0,0,0.4);
    }
    .rk-appmenu-item {
      display: block;
      width: 100%;
      box-sizing: border-box;
      padding: 12px 16px;
      color: #eee;
      text-decoration: none;
      font-size: 15px;
      background: transparent;
      border: none;
      text-align: left;
      border-bottom: 1px solid rgba(255,255,255,0.08);
    }
    .rk-appmenu-item:last-child { border-bottom: none; }
    .rk-appmenu-item:active { background: rgba(255,255,255,0.08); }
    /* <button>版のメニュー項目はfontを継承しないため明示的に合わせる */
    button.rk-appmenu-item { font: inherit; }
    /* メモリ解放時の簡易トースト（各アプリ独自のトースト実装に依存しないよう自前で持つ） */
    .rk-appmenu-toast {
      position: fixed;
      left: 50%;
      bottom: calc(24px + env(safe-area-inset-bottom));
      transform: translateX(-50%) translateY(8px);
      background: #1a1a1e;
      border: 1px solid rgba(255,255,255,0.15);
      color: #eee;
      font-size: 13px;
      padding: 10px 16px;
      border-radius: 10px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.4);
      z-index: 2003;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.2s ease, transform 0.2s ease;
      white-space: nowrap;
    }
    .rk-appmenu-toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }
  `;

  // ===== リンク先の定義 =====
  // ポータルのGitHub Pages URL。/tjm/ サブフォルダなど階層の深さに
  // 関わらず常に正しい場所へ飛ぶよう、相対パスではなくフルパスで書く。
  const PORTAL_ROOT = "https://rkworks2025-coder.github.io/RK_portal/";

  // splitフォルダを持つアプリは、戸島の場合 /tjm/ を付与する。
  function resolveHref(base, isSplit) {
    const user = (typeof getCurrentUser === "function") ? getCurrentUser() : null;
    const isTojima = user && user.id === "tojima";
    return isSplit && isTojima ? `${base}tjm/` : base;
  }

  function buildMenuItems() {
    return [
      { label: "TOP",    href: PORTAL_ROOT },
      { label: "巡回",   href: `${PORTAL_ROOT}junkai/` },
      { label: "予約",   href: resolveHref(`${PORTAL_ROOT}yoyaku/`, true) },
      { label: "JKS",    href: resolveHref(`${PORTAL_ROOT}jks/`, true) },
      { label: "JKS II", href: resolveHref(`${PORTAL_ROOT}jks2/`, true) },
      { label: "実績",   href: `${PORTAL_ROOT}jisseki/` },
      { label: "メモリ解放", action: "releaseMemory" }
    ];
  }

  // ===== メモリ解放（手動トリガー） =====
  // メモリークリーナーアプリが行っているのと同じ発想で、意図的に
  // 大きなメモリを確保→即破棄することでiOS側に「フォアグラウンドの
  // このページのためにメモリが必要」と判断させ、バックグラウンドの
  // 不要プロセスをOS側に解放させる。効果はiOS側の裁量に委ねられる
  // ベストエフォートであり、確実な解放を保証するものではない。
  // サイズは自己を巻き込んで落ちない範囲で経験的に決めた暫定値。
  let toastEl = null;
  function showAppMenuToast(msg) {
    if (!toastEl) {
      toastEl = document.createElement("div");
      toastEl.className = "rk-appmenu-toast";
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = msg;
    // 一度表示済みの場合も再度アニメーションさせるため強制的にreflow
    toastEl.classList.remove("show");
    void toastEl.offsetWidth;
    toastEl.classList.add("show");
    clearTimeout(toastEl._hideTimer);
    toastEl._hideTimer = setTimeout(() => toastEl.classList.remove("show"), 2000);
  }

  function releaseMemory() {
    showAppMenuToast("メモリを解放中…");
    // トーストの描画を先に反映させてから重い処理に入る
    setTimeout(() => {
      try {
        const CHUNK_BYTES = 8 * 1024 * 1024;  // 8MBずつ確保
        const TARGET_MB = 160;                // 暫定値（要調整）
        const chunks = [];
        let allocated = 0;
        while (allocated < TARGET_MB * 1024 * 1024) {
          const buf = new Uint8Array(CHUNK_BYTES);
          // 単に確保しただけでは仮想アドレスの予約に留まる場合があるため、
          // 実メモリとして本当にコミットさせるべく全ページに書き込む
          for (let i = 0; i < buf.length; i += 4096) buf[i] = 1;
          chunks.push(buf);
          allocated += CHUNK_BYTES;
        }
        setTimeout(() => {
          chunks.length = 0; // 参照を破棄しGC対象にする
          showAppMenuToast("メモリを解放しました");
        }, 400);
      } catch (e) {
        // 確保上限到達(RangeError等)もここで握りつぶし、トーストのみ表示
        showAppMenuToast("メモリを解放しました");
      }
    }, 50);
  }

  // ===== 挿入先の探索 =====
  // 各アプリの「既存ボタン群」を優先的に探し、見つかった場所に
  // 通常のflex子要素として挿入する。見つからなければ右上に固定表示。
  const HOST_SELECTORS = [
    ".appbar .btns",     // 巡回(junkai)
    ".update-controls",  // 予約表示(yoyaku)
    ".update-wrapper",   // 初代JKS
    "header"              // JKS-II（シンプルな1行ヘッダー、末尾に追加）
  ];

  function findHost() {
    for (const sel of HOST_SELECTORS) {
      const el = document.querySelector(sel);
      if (el) return el;
    }
    return null;
  }

  function init() {
    const style = document.createElement("style");
    style.textContent = STYLE;
    document.head.appendChild(style);

    const host = findHost();

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = host ? "rk-appmenu-btn-inline" : "rk-appmenu-btn";
    btn.textContent = "⋮";
    btn.setAttribute("aria-label", "アプリ切り替えメニュー");

    const overlay = document.createElement("div");
    overlay.className = "rk-appmenu-overlay";

    const popup = document.createElement("div");
    popup.className = "rk-appmenu-popup";
    popup.style.display = "none";

    buildMenuItems().forEach(item => {
      if (item.action) {
        // アクション項目（他アプリへの遷移ではなく、その場で処理を実行する）
        const b = document.createElement("button");
        b.type = "button";
        b.className = "rk-appmenu-item";
        b.textContent = item.label;
        b.addEventListener("click", () => {
          closeMenu();
          if (item.action === "releaseMemory") releaseMemory();
        });
        popup.appendChild(b);
        return;
      }
      const a = document.createElement("a");
      a.className = "rk-appmenu-item";
      a.textContent = item.label;
      a.href = item.href;
      if (item.external) {
        a.target = "_blank";
        a.rel = "noopener";
      }
      popup.appendChild(a);
    });

    // ボタンの実際の位置を毎回計算してポップアップを直下に出す。
    // ヘッダーに挿入する方式にしたため、ボタンの場所がアプリごとに
    // 変わることを前提にしている。
    function positionPopup() {
      const margin = 8;
      const rect = btn.getBoundingClientRect();
      popup.style.display = "block"; // 幅計算のため先に表示
      const width = popup.offsetWidth;
      let left = rect.right - width;
      if (left < margin) left = margin;
      const maxLeft = window.innerWidth - width - margin;
      if (left > maxLeft) left = maxLeft;
      let top = rect.bottom + margin;
      popup.style.left = left + "px";
      popup.style.top = top + "px";
    }

    function openMenu() {
      overlay.classList.add("show");
      positionPopup();
    }
    function closeMenu() {
      overlay.classList.remove("show");
      popup.style.display = "none";
    }

    btn.addEventListener("click", openMenu);
    overlay.addEventListener("click", closeMenu);

    document.body.appendChild(overlay);
    document.body.appendChild(popup);

    if (host) {
      host.appendChild(btn);
    } else {
      document.body.appendChild(btn);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();

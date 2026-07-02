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
      border-radius: 50%;
      background: rgba(255,255,255,0.08);
      border: 1px solid rgba(255,255,255,0.25);
      color: inherit;
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

  // TMA本体（作業画面）。セッションが生きていればこのまま開き、
  // 切れていればTMA側が自動でログイン画面にリダイレクトする。
  // 常にログイン画面を経由させると、セッションが有効な時にも
  // 無駄なログイン操作が挟まってしまうため。
  const TMA_MAIN_URL = "https://dailycheck.tc-extsys.jp/tcrappsweb/web/tawTop.html";

  function buildMenuItems() {
    return [
      { label: "TOP",    href: PORTAL_ROOT },
      { label: "巡回",   href: `${PORTAL_ROOT}junkai/` },
      { label: "予約",   href: resolveHref(`${PORTAL_ROOT}yoyaku/`, true) },
      { label: "JKS",    href: resolveHref(`${PORTAL_ROOT}jks/`, true) },
      { label: "JKS II", href: resolveHref(`${PORTAL_ROOT}jks2/`, true) },
      { label: "実績",   href: `${PORTAL_ROOT}jisseki/` },
      { label: "TMA",    href: TMA_MAIN_URL }
    ];
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

/* shared/app-menu.js
   全アプリ共通の3点メニュー。
   ヘッダーのスペースを使わず、画面右上にfixedで重ねて表示する。
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
    .rk-appmenu-btn {
      position: fixed;
      top: calc(8px + env(safe-area-inset-top));
      right: 8px;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: rgba(20,20,24,0.85);
      border: 1px solid rgba(255,255,255,0.15);
      color: #fff;
      font-size: 20px;
      line-height: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2000;
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
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
      top: calc(52px + env(safe-area-inset-top));
      right: 8px;
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

  function buildMenuItems() {
    return [
      { label: "TOP",    href: PORTAL_ROOT },
      { label: "巡回",   href: `${PORTAL_ROOT}junkai/` },
      { label: "予約",   href: resolveHref(`${PORTAL_ROOT}yoyaku/`, true) },
      { label: "JKS",    href: resolveHref(`${PORTAL_ROOT}jks/`, true) },
      { label: "JKS II", href: resolveHref(`${PORTAL_ROOT}jks2/`, true) },
      { label: "実績",   href: `${PORTAL_ROOT}jisseki/` }
    ];
  }

  function init() {
    const style = document.createElement("style");
    style.textContent = STYLE;
    document.head.appendChild(style);

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "rk-appmenu-btn";
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
      popup.appendChild(a);
    });

    function openMenu() {
      overlay.classList.add("show");
      popup.style.display = "block";
    }
    function closeMenu() {
      overlay.classList.remove("show");
      popup.style.display = "none";
    }

    btn.addEventListener("click", openMenu);
    overlay.addEventListener("click", closeMenu);

    document.body.appendChild(overlay);
    document.body.appendChild(popup);
    document.body.appendChild(btn);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();

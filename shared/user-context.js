/* shared/user-context.js
   担当者判定の共通ロジック。
   各アプリ（junkai, yoyaku, jks, jks2, jisseki）はこのファイルを読み込み、
   getCurrentUser() で「片山」または「戸島」を取得し、
   それに応じて参照先スプレッドシートIDなどを切り替える。
*/

const RK_USER_STORAGE_KEY = "rk_portal_user";

/* 担当者定義
   id        : localStorageに保存する識別子
   label     : 画面表示名
   ssIdKey   : 各アプリ側で「この担当者の場合はこのSS IDを使う」と
               参照するためのキー。実際のSS IDは各アプリ側の設定で持つ。
*/
const RK_USERS = [
  { id: "katayama", label: "片山用" },
  { id: "tojima",   label: "戸島用" }
];

/**
 * 現在保存されている担当者情報を取得する。
 * 未選択の場合は null を返す。
 */
function getCurrentUser() {
  const raw = localStorage.getItem(RK_USER_STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (parsed && parsed.id) return parsed;
    return null;
  } catch (e) {
    return null;
  }
}

/**
 * 担当者を保存する。
 * 担当者が切り替わる場合（前回と異なるidがセットされる場合）は、
 * 各アプリがlocalStorageに保存しているエリア選択・表示モード等が
 * 前の担当者の値のまま引き継がれてしまうのを防ぐため、
 * 担当者情報以外のlocalStorageを全消去してから新しい担当者を保存する。
 * （このオリジン＝RK_portal以外のlocalStorageには影響しない）
 * @param {string} userId - "katayama" または "tojima"
 */
function setCurrentUser(userId) {
  const user = RK_USERS.find(u => u.id === userId);
  if (!user) {
    console.error("不明な担当者ID:", userId);
    return;
  }

  const previousUser = getCurrentUser();
  const isUserChanged = !previousUser || previousUser.id !== user.id;

  if (isUserChanged) {
    localStorage.clear();
  }

  localStorage.setItem(RK_USER_STORAGE_KEY, JSON.stringify(user));
}

/**
 * 担当者をリセットする（選択画面に戻したい場合に使用）。
 */
function clearCurrentUser() {
  localStorage.removeItem(RK_USER_STORAGE_KEY);
}

/**
 * 担当者が未選択なら選択画面へリダイレクトする。
 * 各アプリの先頭（index.htmlやapp.jsの初期化部分）で呼び出す想定。
 * @param {string} redirectPath - 選択画面のパス（ルートからの相対）
 */
function requireUser(redirectPath) {
  const user = getCurrentUser();
  if (!user) {
    window.location.href = redirectPath || "../select-user.html";
    return null;
  }
  return user;
}

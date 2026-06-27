/* shared/user-context.js
   担当者判定の共通ロジック。
   各アプリ（junkai, yoyaku, jks, jks2, jisseki）はこのファイルを読み込み、
   getCurrentUser() で「片山」または「戸島」を取得し、
   それに応じて参照先スプレッドシートIDなどを切り替える。
*/

const RK_USER_STORAGE_KEY = "rk_portal_user";

/* ローカルストレージ全体に「最後にどの担当者がセットされていたか」を
   タグとして記録しておくためのキー。
   ブラウザ側のキャッシュ消去・削除操作のタイミングや実装差に
   依存せず、ページ読み込み時に必ず整合性を取るための仕組み。 */
const RK_USER_TAG_KEY = "rk_portal_user_tag";

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
 * localStorageに保存されている内容の「持ち主タグ」と、
 * 今読み込まれている rk_portal_user の担当者IDを突き合わせる。
 * ズレている場合（担当者を切り替えたのに古いデータが残っている場合）は、
 * 担当者情報を含めて localStorage を全消去する。
 * ページが読み込まれる度（getCurrentUser/requireUserの呼び出し時）に
 * 必ず実行されるため、ブラウザのキャッシュ消去操作の有無や
 * タイミングに依存せず、常に正しい状態に揃う。
 */
function ensureUserStorageConsistency_() {
  const raw = localStorage.getItem(RK_USER_STORAGE_KEY);
  let currentUserId = null;
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.id) currentUserId = parsed.id;
    } catch (e) {
      currentUserId = null;
    }
  }

  const storedTag = localStorage.getItem(RK_USER_TAG_KEY);

  if (currentUserId === null) {
    // 担当者が未選択の状態。タグも残さない。
    if (storedTag !== null) {
      localStorage.clear();
    }
    return;
  }

  if (storedTag !== currentUserId) {
    // 担当者は選択済みだが、保存されているデータのタグが
    // 別の担当者のもの（またはタグ自体が無い古い状態）。
    // rk_portal_user 自体も含めて一旦全消去し、
    // 今回ログインした担当者の情報とタグだけを再設定する。
    const userToRestore = RK_USERS.find(u => u.id === currentUserId);
    localStorage.clear();
    if (userToRestore) {
      localStorage.setItem(RK_USER_STORAGE_KEY, JSON.stringify(userToRestore));
      localStorage.setItem(RK_USER_TAG_KEY, userToRestore.id);
    }
  }
}

/**
 * 現在保存されている担当者情報を取得する。
 * 未選択の場合は null を返す。
 * 呼び出しの度に、保存データと担当者タグの整合性チェックを行う。
 */
function getCurrentUser() {
  ensureUserStorageConsistency_();
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

  // 既存データはすべて前の担当者のものである可能性があるため、
  // タグの値に関わらず常に全消去してから新しい担当者を保存する。
  localStorage.clear();
  localStorage.setItem(RK_USER_STORAGE_KEY, JSON.stringify(user));
  localStorage.setItem(RK_USER_TAG_KEY, user.id);
}

/**
 * 担当者をリセットする（選択画面に戻したい場合に使用）。
 */
function clearCurrentUser() {
  localStorage.removeItem(RK_USER_STORAGE_KEY);
  localStorage.removeItem(RK_USER_TAG_KEY);
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

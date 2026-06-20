/* shared/pw-config.js
   担当者（片山 / 戸島）× PWモード（1 / 2）の組み合わせによる
   TMAログイン用パスワード一覧。
   数か月ごとにPWが1↔2で切り替わる運用のため、
   コード内の値そのものは保持しつつ、選択はボタンタップで行う。

   TMAログインには以下3つの値が必要:
     1. 共通ID（片山・戸島ともに同じ値）
     2. 担当者ID（片山・戸島で異なる値）
     3. PW（担当者×PWモードで決まる値）
*/

const RK_TMA_LOGIN_COMMON_ID = "0030";

const RK_TMA_LOGIN_USER_ID = {
  katayama: "927583",
  tojima: "928091"
};

const RK_PW_CONFIG = {
  katayama: {
    mode1: "Ccj-222223",
    mode2: "Ccj-322222"
  },
  tojima: {
    mode1: "Ccj-222229",
    mode2: "Ccj-922222"
  }
};

const RK_PW_MODE_STORAGE_KEY = "rk_portal_pw_mode";

/**
 * 現在保存されているPWモード（"mode1" または "mode2"）を取得する。
 * 未選択の場合は null を返す。
 */
function getCurrentPwMode() {
  const mode = localStorage.getItem(RK_PW_MODE_STORAGE_KEY);
  if (mode === "mode1" || mode === "mode2") return mode;
  return null;
}

/**
 * PWモードを保存する。
 * @param {string} mode - "mode1" または "mode2"
 */
function setCurrentPwMode(mode) {
  if (mode !== "mode1" && mode !== "mode2") {
    console.error("不明なPWモード:", mode);
    return;
  }
  localStorage.setItem(RK_PW_MODE_STORAGE_KEY, mode);
}

/**
 * PWモードをリセットする。
 */
function clearCurrentPwMode() {
  localStorage.removeItem(RK_PW_MODE_STORAGE_KEY);
}

/**
 * 指定した担当者・指定したPWモードに対応するPW値を取得する。
 * 選択画面で「このボタンを押すとどのPWになるか」を事前表示するために使う。
 *
 * @param {string} userId - "katayama" または "tojima"
 * @param {string} mode - "mode1" または "mode2"
 * @returns {string | null}
 */
function getPwValueFor(userId, mode) {
  const userConfig = RK_PW_CONFIG[userId];
  if (!userConfig) return null;
  return userConfig[mode] || null;
}

/**
 * 現在ログイン中の担当者・現在選択中のPWモードに対応する
 * TMAログイン用パスワードを取得する。
 * shared/user-context.js の getCurrentUser() に依存。
 *
 * @returns {string | null}
 */
function getCurrentTmaPassword() {
  const user = getCurrentUser();
  const mode = getCurrentPwMode();
  if (!user || !mode) return null;
  const userConfig = RK_PW_CONFIG[user.id];
  if (!userConfig) return null;
  return userConfig[mode];
}

/**
 * 現在ログイン中の担当者・現在選択中のPWモードに対応する
 * TMAログインに必要な3つの値（共通ID／担当者ID／PW）をまとめて取得する。
 *
 * @returns {{commonId: string, userId: string, password: string} | null}
 */
function getCurrentTmaLoginInfo() {
  const user = getCurrentUser();
  const password = getCurrentTmaPassword();
  if (!user || !password) return null;
  return {
    commonId: RK_TMA_LOGIN_COMMON_ID,
    userId: RK_TMA_LOGIN_USER_ID[user.id],
    password: password
  };
}

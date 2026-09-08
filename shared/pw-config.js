/* shared/pw-config.js
   担当者（片山 / 戸島）× PWモード（1 / 2）の選択状態を管理する。

   このファイルは公開GitHub Pagesで配信される（誰でもソースを閲覧できる）ため、
   実際のTMAログインID・パスワードは一切保持しない。
   画面には「mode1かmode2か」を見分けるための先頭1桁マスク表示のみを行う。
   実際のログイン処理（TMA_ID/PASSWORDの参照）はGitHub Actions側の
   Secretsから行われ、ここではmode1/mode2というラベルしか送らない。
*/

const RK_PW_HINT_CONFIG = {
  katayama: {
    mode1: "Ccj-2•••••",
    mode2: "Ccj-3•••••"
  },
  tojima: {
    mode1: "Ccj-2•••••",
    mode2: "Ccj-9•••••"
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
 * 指定した担当者・指定したPWモードに対応する、先頭1桁マスク済みの
 * 表示用ヒント文字列を取得する（実パスワードは含まない）。
 * 選択画面で「このボタンを押すとどのPWモードになるか」を
 * 見分けるためだけに使う。
 *
 * @param {string} userId - "katayama" または "tojima"
 * @param {string} mode - "mode1" または "mode2"
 * @returns {string | null}
 */
function getPwValueFor(userId, mode) {
  const userConfig = RK_PW_HINT_CONFIG[userId];
  if (!userConfig) return null;
  return userConfig[mode] || null;
}

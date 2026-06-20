/* shared/ss-config.js
   担当者（片山 / 戸島）ごとの SS ID・GAS WebApp URL 一覧。
   各アプリは getSSConfig(componentKey) を呼ぶことで、
   現在ログイン中の担当者に対応する SS ID / GAS URL を取得できる。

   componentKey の一覧:
     "junkai"   : 巡回管理メインSS
     "tire"     : タイヤ管理メインSS
     "yoyaku"   : 予約管理メインSS
     "jksSystem": JKS_System SS（JKS_II用）
*/

const RK_SS_CONFIG = {
  katayama: {
    junkai: {
      ssId: "11XglLANtnG7bCxYjLRMGoZY25wspjHsGR3IG2ZyRITs",
      gasUrl: "https://script.google.com/macros/s/AKfycbyXbPaarnD7mQa_rqm6mk-Os3XBH6C731aGxk7ecJC5U3XjtwfMkeF429rezkAo79jN/exec"
    },
    tire: {
      ssId: "1VQaC8n_rvbjyDxQSfMadQkpim43oRw9URb31hLovyhc",
      gasUrl: "https://script.google.com/macros/s/AKfycbyo2U1_TBxvzhJL50GHY8S0NeT1k0kueWb4tI1q2Oaw87NuGXqwjO7PWyCDdqFNZTdz/exec"
    },
    yoyaku: {
      ssId: "1LCyj16nsRYBk5cTpx2Sb75qmtm3YGKNEIdeyUvZzQQI",
      gasUrl: "https://script.google.com/macros/s/AKfycbwpNRM_753x0gG5sl5_LTwxn5afUUQqezpmPb874-Stsl5aVUJBLTBk70nW5RE_mdU0/exec"
    },
    jksSystem: {
      ssId: "16HYziQ5now1IATZJU3wZhTE08S_3B8xVP9MbfceHONE",
      gasUrl: "https://script.google.com/macros/s/AKfycbywQoNFA2x7qn8cMelt_5OVPiNumBYqPbTNnK3nzXWv59q0FmP2Mt8qmVxT5Zk6wPEr/exec"
    }
  },

  tojima: {
    junkai: {
      ssId: "1QvT_eA1ir-cjOcI1_WDDqjpFlrsBWjjfeqgRduEw4xI",
      gasUrl: "https://script.google.com/macros/s/AKfycbyhvDaXPbZQWkhGDbt2XkUZhwe2-xprpC9U_6s3JuPeXoD2fxAGsVXePvZasId5I1zUyQ/exec"
    },
    tire: {
      ssId: "1o2wFoiKo-7Vtre7AdfuGeZdUPM5nO6Qg_XzU9Pb7eMU",
      gasUrl: "https://script.google.com/macros/s/AKfycbyvF9xUna4h9-4dhvGeQsxbvbb-BOLRddpxwGozjCd8B8sICUZRaj2a3ujijYFPMImi/exec"
    },
    yoyaku: {
      ssId: "1LQwnhCgHZByC-JryFSW2xfQMMG08gvLrboXPCJyvVN0",
      gasUrl: "https://script.google.com/macros/s/AKfycby_h_EtlHsp2Tx_5RZdaY9RBimo4D6ASJrHLwwo1pOGtrHS0kjJxPGL0jfA9Sd5S8Ts/exec"
    },
    jksSystem: {
      ssId: "1sHT_qmnAV6gfQ--MMmK-WVhFqgxzDTTRwFXmAwifozI",
      gasUrl: "https://script.google.com/macros/s/AKfycbxAZpJaIANOuIS6d90E9Xt84JZauMmlRlnnBcfwoVJk2UkC9CTFQSRHtFPNSOkuTuwhOg/exec"
    }
  }
};

/**
 * 現在ログイン中の担当者に対応する SS設定を取得する。
 * shared/user-context.js の getCurrentUser() に依存。
 *
 * @param {string} componentKey - "junkai" | "tire" | "yoyaku" | "jksSystem"
 * @returns {{ssId: string, gasUrl: string} | null}
 */
function getSSConfig(componentKey) {
  const user = getCurrentUser();
  if (!user) {
    console.error("担当者が未選択です。select-user.html へ遷移してください。");
    return null;
  }
  const userConfig = RK_SS_CONFIG[user.id];
  if (!userConfig || !userConfig[componentKey]) {
    console.error("不明なコンポーネントキー:", componentKey);
    return null;
  }
  return userConfig[componentKey];
}

/**
 * 現在ログイン中の担当者に対応する GAS WebApp URL のみを取得する簡易関数。
 * @param {string} componentKey
 * @returns {string | null}
 */
function getGasUrl(componentKey) {
  const config = getSSConfig(componentKey);
  return config ? config.gasUrl : null;
}

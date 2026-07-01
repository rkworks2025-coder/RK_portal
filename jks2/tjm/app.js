// ===== JKS-II app.js (Map版) =====

// ===== ステーションデータ =====
const STATIONS_YAMATO = [
  {station_name:"タイムズ高座渋谷第９",stationCd:"QO51",lat:35.4313488727813,lng:139.4662523460068},
  {station_name:"アーバン長窪",stationCd:"KD04",lat:35.47074039185167,lng:139.4643774706423},
  {station_name:"ウイングヤマシタ",stationCd:"ND31",lat:35.445418909300315,lng:139.46661731316436},
  {station_name:"上和田月極駐車場",stationCd:"JH88",lat:35.44893160223813,lng:139.46750202825376},
  {station_name:"桜ヶ丘パーキング",stationCd:"LI64",lat:35.451594015969796,lng:139.4661397112309},
  {station_name:"下和田駐車場",stationCd:"OM45",lat:35.42871841517343,lng:139.46777210858005},
  {station_name:"スクエアパーキング",stationCd:"MP83",lat:35.45147701349736,lng:139.4668073971487},
  {station_name:"セソンレオ",stationCd:"ED92",lat:35.46714334341307,lng:139.4592173432807},
  {station_name:"イオン大和ショッピングセンター第３",stationCd:"T564",lat:35.433057599420195,lng:139.46636274803552},
  {station_name:"タイムズ小田急大和第２",stationCd:"EA47",lat:35.46801658970733,lng:139.46228003183552},
  {station_name:"大和市中央１丁目",stationCd:"RN29",lat:35.466383055795,lng:139.46164166200052},
  {station_name:"タイムズ高座渋谷駅前第２",stationCd:"DP49",lat:35.432298630914836,lng:139.46597898615485},
  {station_name:"タイムズ相鉄大和第３",stationCd:"EE69",lat:35.46990071934844,lng:139.46584177516658},
  {station_name:"タイムズ大和駅前第２",stationCd:"Q847",lat:35.47016523146331,lng:139.46336979114437},
  {station_name:"タイムズ大和駅前第６",stationCd:"QV94",lat:35.470260492879405,lng:139.4637021929126},
  {station_name:"タイムズ大和駅前第５",stationCd:"EU60",lat:35.4692541305158,lng:139.46152933588692},
  {station_name:"タイムズ大和中央第４",stationCd:"BP57",lat:35.46797563275211,lng:139.45828147352535},
  {station_name:"タイムズ大和徳洲会病院",stationCd:"LW85",lat:35.469577425585406,lng:139.4590393080431},
  {station_name:"タイムズ大和東第３",stationCd:"CQ93",lat:35.47037096251012,lng:139.46596808077692},
  {station_name:"タイムズ大和深見西",stationCd:"Y302",lat:35.47513201971745,lng:139.4630810921618},
  {station_name:"タイムズ大和南第３",stationCd:"CY75",lat:35.46948925430478,lng:139.4637667520018},
  {station_name:"タイムズ大和南第５",stationCd:"JG24",lat:35.46929821625879,lng:139.46472306698848},
  {station_name:"東門駐車場",stationCd:"RD51",lat:35.45839207335834,lng:139.46284316630508},
  {station_name:"タイムズ大和柳橋",stationCd:"EU53",lat:35.45323470189422,lng:139.46448849926813},
  {station_name:"中央１号公園前",stationCd:"MK68",lat:35.46717130626873,lng:139.45978422892907},
  {station_name:"テーエス駐車場",stationCd:"NI87",lat:35.47409265514781,lng:139.46095706803175},
  {station_name:"パークセレノ",stationCd:"QB13",lat:35.43479029447219,lng:139.46544994421873},
  {station_name:"Ｂ・Ｈパーキング",stationCd:"LM62",lat:35.43456977084484,lng:139.46496276488588},
  {station_name:"深見台１丁目第２",stationCd:"MD66",lat:35.46684800150695,lng:139.46754301104426},
  {station_name:"深見西１丁目",stationCd:"KF80",lat:35.475297584987246,lng:139.46160664049125},
  {station_name:"山口第１駐車場",stationCd:"KO93",lat:35.472079500534484,lng:139.45622962409962},
  {station_name:"山口第５駐車場",stationCd:"NN55",lat:35.47264921860433,lng:139.45611782131053},
  {station_name:"大和市中央５丁目",stationCd:"KO75",lat:35.46551068175239,lng:139.45797986088672},
  {station_name:"大和市中央７丁目",stationCd:"LM47",lat:35.46552537769491,lng:139.4621299070554},
  {station_name:"大和市中央５丁目３",stationCd:"KW15",lat:35.46777382526466,lng:139.45879182644146},
  {station_name:"大和東公園",stationCd:"EI13",lat:35.47200602674974,lng:139.461281854186},
  {station_name:"大和深見台１丁目",stationCd:"KO59",lat:35.46339258591683,lng:139.46803271007187},
  {station_name:"大和南１丁目月極",stationCd:"LQ17",lat:35.46855268464282,lng:139.46732648684596},
  {station_name:"ラークヴィラ",stationCd:"OK09",lat:35.47675229320314,lng:139.46117359224556},
  {station_name:"リリーガーデン",stationCd:"OE49",lat:35.47463634527185,lng:139.46333883372486},
];

const STATIONS_EBINA = [
  {station_name:"綾瀬市大上５丁目",stationCd:"RN13",lat:35.46478422772997,lng:139.42955445323648},
  {station_name:"Ｎ－ｓｔａｇｅかしわ台",stationCd:"KF65",lat:35.46827935294714,lng:139.42065673894624},
  {station_name:"海老名駅西口（ＥＶ）",stationCd:"LL76",lat:35.456695348513115,lng:139.39081448533716},
  {station_name:"海老名駅前第３",stationCd:"LO41",lat:35.451182820638145,lng:139.39108588738708},
  {station_name:"海老名国分北２丁目",stationCd:"OE71",lat:35.45847454056957,lng:139.3966762410321},
  {station_name:"海老名市中央３丁目",stationCd:"JU23",lat:35.45096004843584,lng:139.39120169795584},
  {station_name:"タイムズ海老名中央公園地下（ＥＶ）",stationCd:"LF72",lat:35.4524839491018,lng:139.39499142178468},
  {station_name:"扇町見世ビル",stationCd:"OL13",lat:35.45620696478464,lng:139.38791039007683},
  {station_name:"小田急厚木第１駐車場（小田急）",stationCd:"KD03",lat:35.44283711415111,lng:139.37719532828444},
  {station_name:"厚木第２駐車場（小田急）",stationCd:"DN33",lat:35.44337034950935,lng:139.37979646286382},
  {station_name:"鍵渡駐車場",stationCd:"QF98",lat:35.454109512325346,lng:139.38627960696863},
  {station_name:"かしわ台駅前",stationCd:"LD06",lat:35.466088771352915,lng:139.41438094648115},
  {station_name:"クラウンハイツ海老名",stationCd:"MQ43",lat:35.44918028385621,lng:139.39512016785125},
  {station_name:"さがみ野駅南口（屋上）",stationCd:"LD05",lat:35.4710448790322,lng:139.42870142470005},
  {station_name:"シュリンプタワー（西）",stationCd:"QM94",lat:35.45390907296019,lng:139.38781608537784},
  {station_name:"シュリンプタワー（東）",stationCd:"QM93",lat:35.45403959635696,lng:139.38842537432035},
  {station_name:"セントガーデン海老名＿限定",stationCd:"IW70",lat:35.457922824634686,lng:139.39131143119027},
  {station_name:"相鉄柏ケ谷月極パーキング",stationCd:"NW62",lat:35.468624743627615,lng:139.41157063072043},
  {station_name:"イオン海老名ショッピングセンターＧ",stationCd:"CM59",lat:35.44835978997188,lng:139.39370642406848},
  {station_name:"タイムズ海老名泉",stationCd:"KO78",lat:35.45728777183729,lng:139.38982846535433},
  {station_name:"タイムズ海老名駅西口第２",stationCd:"BH96",lat:35.45795515668009,lng:139.3880228944212},
  {station_name:"タイムズ海老名駅西口第３",stationCd:"BL65",lat:35.4561507330579,lng:139.3869456210073},
  {station_name:"タイムズ海老名駅西口第４",stationCd:"HA87",lat:35.456987566218636,lng:139.38774145548084},
  {station_name:"タイムズ海老名河原口",stationCd:"Q467",lat:35.45036253104263,lng:139.3874582854696},
  {station_name:"タイムズ海老名中央第４",stationCd:"CE79",lat:35.45095969960914,lng:139.38906982204284},
  {station_name:"タイムズ海老名中央第６",stationCd:"CG62",lat:35.44754826678669,lng:139.39401617602772},
  {station_name:"タイムズ海老名中央公園地下",stationCd:"EG12",lat:35.4524839491018,lng:139.39499142178468},
  {station_name:"タイムズかしわ台第３",stationCd:"BO13",lat:35.46352883997876,lng:139.41226913329444},
  {station_name:"タイムズさがみ野相鉄ライフ第２",stationCd:"DB30",lat:35.47235201879705,lng:139.42967240990075},
  {station_name:"スターバックスコーヒー海老名中央店",stationCd:"Y376",lat:35.44849979681869,lng:139.39183263430542},
  {station_name:"タイムズ東柏ケ谷",stationCd:"BX51",lat:35.46742153818923,lng:139.42357291795614},
  {station_name:"タイムズビナフロント",stationCd:"EW66",lat:35.45186197477463,lng:139.39008640403088},
  {station_name:"東柏ケ谷５丁目６",stationCd:"OW93",lat:35.46890442128869,lng:139.43055243612955},
  {station_name:"アイリスコートさがみ野",stationCd:"RN50",lat:35.47067672475835,lng:139.43632461230655},
  {station_name:"ＰーＲＥＸさがみ野駐車場",stationCd:"LZ15",lat:35.47011542218444,lng:139.42870134660143},
  {station_name:"ファミール",stationCd:"QB12",lat:35.46256627648722,lng:139.3957412242991},
  {station_name:"マイシャトーさがみ野Ａ",stationCd:"QB11",lat:35.47402015808761,lng:139.4348918757585},
  {station_name:"マハロ壱番館",stationCd:"MP82",lat:35.45763382394336,lng:139.38489728425228},
  {station_name:"見上駐車場",stationCd:"NQ58",lat:35.46839777263622,lng:139.41492438468308},
  {station_name:"ＵＲえびな団地",stationCd:"NP43",lat:35.4441030360536,lng:139.3813137016946},
  {station_name:"ＵＲえびな団地３地区",stationCd:"RQ79",lat:35.44328942963265,lng:139.38127493981332},
  {station_name:"ロイヤルプラザ海老名駐車場",stationCd:"LQ02",lat:35.457868644140184,lng:139.39527552396248},
];

const STATIONS_NAKAHARA = [
  {station_name:"ガーラ・ヴィスタ元住吉（屋外）",stationCd:"OH00",lat:35.560453219153054,lng:139.66176544722998},
  {station_name:"ガーラ・ヴィスタ元住吉（建物下）",stationCd:"OY31",lat:35.560453219153054,lng:139.66176544722998},
  {station_name:"西加瀬月極駐車場",stationCd:"KI06",lat:35.56064661912213,lng:139.65868191778213},
  {station_name:"タイムズ西加瀬",stationCd:"Y771",lat:35.55830122847612,lng:139.6584545766777},
  {station_name:"タイムズフロール元住吉（ＥＶ）",stationCd:"JP24",lat:35.5624129188396,lng:139.65914861778217},
  {station_name:"タイムズ元住吉第９",stationCd:"CP85",lat:35.56612942733056,lng:139.6529630883344},
  {station_name:"タイムズ元住吉駅前第８",stationCd:"HT87",lat:35.564030727637714,lng:139.65435331778215},
  {station_name:"ホンダソーラービル",stationCd:"QX55",lat:35.563244727752746,lng:139.6487576999911},
  {station_name:"ウェルス元住吉",stationCd:"OO35",lat:35.56124827353539,lng:139.64949231778215},
  {station_name:"ドミール・トモ",stationCd:"RF57",lat:35.56121771001222,lng:139.64924652943884},
  {station_name:"木月天王森交差点",stationCd:"NF82",lat:35.56130660999678,lng:139.65046797054333},
  {station_name:"コンフォート住吉",stationCd:"RF65",lat:35.55985997374799,lng:139.6565022705433},
  {station_name:"タイムズ関東労災病院",stationCd:"KR66",lat:35.56781379985506,lng:139.6578242999911},
  {station_name:"ＵＲ木月住吉団地",stationCd:"CV83",lat:35.56496772750059,lng:139.66097167054332},
  {station_name:"ルシエル",stationCd:"EH12",lat:35.581791500379474,lng:139.63638854534832},
  {station_name:"タイムズ下小田中",stationCd:"R610",lat:35.58028881597967,lng:139.63743881778214},
  {station_name:"タイムズ下小田中（ＥＶ）",stationCd:"JP32",lat:35.58028881597967,lng:139.63743881778214},
  {station_name:"ラフォーレ武蔵中原",stationCd:"ED02",lat:35.579670425348446,lng:139.63659327054333},
  {station_name:"リブリ・アフィニティ",stationCd:"DW42",lat:35.57101281746388,lng:139.6362169999911},
  {station_name:"ネイバーズ武蔵中原",stationCd:"ES84",lat:35.57470082607598,lng:139.63673239999113},
  {station_name:"上小田中１丁目第３駐車場",stationCd:"JC77",lat:35.59328481389968,lng:139.62957724109555},
  {station_name:"タイムズ上小田中",stationCd:"T881",lat:35.585102824553076,lng:139.6356309999911},
  {station_name:"ラフィーネ武蔵中原",stationCd:"KZ71",lat:35.58394107005918,lng:139.6368476999911},
  {station_name:"ノーブル駐車場",stationCd:"IJ64",lat:35.58778887884996,lng:139.6315955883344},
  {station_name:"ルピナス壱番館",stationCd:"JS19",lat:35.58177443058196,lng:139.6351560592305},
  {station_name:"グランクラージュ",stationCd:"QH26",lat:35.58366131543998,lng:139.63393145888662},
  {station_name:"タイムズ又玄寺",stationCd:"RR47",lat:35.585153529310425,lng:139.63302501534992},
];

// ===== 状態管理 =====
let CURRENT_AREA = 'yamato';
let STATIONS = STATIONS_YAMATO.map(s => ({...s}));
let gasStationMap = new Map();
let gMap = null;
let markerMap = new Map(); // stationCd → marker
let gpsMarker = null;
let currentStation = null;
let scanWrappers = []; // スキャンバッジマーカー
let scanMode = localStorage.getItem('jks_scan_mode') || 'normal';

const GAS_URL = (typeof getGasUrl === "function" ? getGasUrl("jksSystem") : null);
const AREA_KEY = () => CURRENT_AREA;
const MAP_CACHE_KEY = 'jks2_map_cache';
const GPS_CACHE_KEY = 'jks2_gps_cache';

const TIRE_APP_URL = 'https://rkworks2025-coder.github.io/TireCheck/';
const WORK_APP_URL = 'https://rkworks2025-coder.github.io/work/';
const JUNKAI_GAS_URL = 'https://script.google.com/macros/s/AKfycbyXbPaarnD7mQa_rqm6mk-Os3XBH6C731aGxk7ecJC5U3XjtwfMkeF429rezkAo79jN/exec';

// ===== Google Maps 初期化 =====
const AREA_CENTER = {
  yamato:   { lat: 35.4615, lng: 139.4633 },
  ebina:    { lat: 35.4576, lng: 139.4002 },
  nakahara: { lat: 35.5719, lng: 139.6458 },
};
const AREA_ZOOM = { yamato: 14, ebina: 13, nakahara: 14 };

const MAP_STYLES = [
  { elementType: 'geometry', stylers: [{ color: '#0d1520' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#4a6070' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#070b12' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#1a2d40' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#070b12' }] },
  { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#6a8090' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#243850' }] },
  { featureType: 'road.highway', elementType: 'labels.text.fill', stylers: [{ color: '#6a9090' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0a1824' }] },
  { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#1a3040' }] },
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
  { featureType: 'landscape', elementType: 'geometry', stylers: [{ color: '#0d1520' }] },
  { featureType: 'administrative', elementType: 'geometry.stroke', stylers: [{ color: '#1a2d40' }] },
  { featureType: 'administrative', elementType: 'labels.text.fill', stylers: [{ color: '#5a7080' }] },
];

function initMap() {
  if (typeof requireUser === "function" && !requireUser("../../select-user.html")) return;
  const center = AREA_CENTER[CURRENT_AREA];
  gMap = new google.maps.Map(document.getElementById('gmap'), {
    center, zoom: AREA_ZOOM[CURRENT_AREA],
    disableDefaultUI: true,
    gestureHandling: 'greedy',
    styles: MAP_STYLES
  });
  initStationLabel();
  fetchMapData();
  startGps();
  switchScanMode(scanMode);
}

// ===== ステータス色 =====
const STATUS_COLOR = {
  standby:     '#00e5a0',
  checked:     '#ff4d8d',
  '7days_rule':'#3d9bff',
  stopped:     '#445060',
  unnecessary: '#445060',
  unknown:     '#445060',
};

function makePinSvg(color, size = 14, opacity = 1) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
    <circle cx="${size/2}" cy="${size/2}" r="${size/2-1.5}" fill="${color}" fill-opacity="${opacity}" stroke="rgba(255,255,255,0.6)" stroke-width="1.5"/>
  </svg>`;
  return { url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg), scaledSize: new google.maps.Size(size, size), anchor: new google.maps.Point(size/2, size/2) };
}

function makeScanBadgeSvg(num) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26">
    <circle cx="13" cy="13" r="12" fill="#e0182d" stroke="white" stroke-width="2"/>
    <text x="13" y="18" text-anchor="middle" fill="white" font-size="14" font-weight="bold" font-family="sans-serif">${num}</text>
  </svg>`;
  return { url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg), scaledSize: new google.maps.Size(26, 26), anchor: new google.maps.Point(13, 13) };
}

function makeGpsSvg() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16">
    <circle cx="8" cy="8" r="6" fill="#ffe04d" stroke="rgba(255,224,77,0.5)" stroke-width="3"/>
  </svg>`;
  return { url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg), scaledSize: new google.maps.Size(16, 16), anchor: new google.maps.Point(8, 8) };
}

// ===== マーカー管理 =====
function clearMarkers() {
  markerMap.forEach(m => m.setMap(null));
  markerMap.clear();
  clearLabels();
  clearScanBadges();
}

function renderMarkers() {
  clearMarkers();
  let openIW = null;

  STATIONS.forEach(s => {
    const color = STATUS_COLOR[s.status] || '#445060';
    const isActive = s.status === 'standby';
    const size = isActive ? 14 : 10;
    const opacity = (s.status === 'checked' || s.status === 'unnecessary') ? 0.4 : 1;
    const icon = makePinSvg(color, size, opacity);

    const marker = new google.maps.Marker({
      map: gMap,
      position: { lat: s.lat, lng: s.lng },
      icon,
      title: s.station_name,
      zIndex: isActive ? 10 : 1
    });

    if (s.status !== 'checked' && s.status !== 'unnecessary') {
      const iw = new google.maps.InfoWindow({
        content: buildInfoWindowContent(s)
      });
      marker.addListener('click', () => {
        if (openIW) openIW.close();
        iw.open(gMap, marker);
        openIW = iw;
        openDetail(s);
      });
    }

    markerMap.set(s.stationCd, marker);
  });

  // マップタップで詳細パネルを閉じる
  gMap.addListener('click', () => {
    if (openIW) { openIW.close(); openIW = null; }
    closeDetail();
  });

  renderLabels();
}

function buildInfoWindowContent(s) {
  const color = STATUS_COLOR[s.status] || '#445060';
  return `<div style="background:rgba(13,21,32,0.97);border:1px solid #1a2d40;padding:10px 14px;min-width:160px;border-radius:8px;">
    <div style="font-size:13px;font-weight:bold;color:#e8f4ff;margin-bottom:4px;">${s.station_name}</div>
    <div style="font-size:11px;color:${color};">${s.status}</div>
  </div>`;
}

// ===== ステーション名ラベル =====
let labelOverlays = [];
let StationLabel = null;

function initStationLabel() {
  StationLabel = class extends google.maps.OverlayView {
    constructor(station, color) {
      super();
      this.station = station;
      this.color = color;
      this.div = null;
    }
    onAdd() {
      const div = document.createElement('div');
      div.style.cssText = `
        position:absolute;
        background:rgba(7,11,18,0.85);
        color:${this.color};
        font-size:9px;
        font-family:'Noto Sans JP',sans-serif;
        padding:2px 5px;
        border-radius:3px;
        border:1px solid ${this.color}66;
        white-space:normal;
        word-break:break-all;
        pointer-events:none;
        transform:translate(-50%,-190%);
        max-width:60px;
        line-height:1.4;
        text-align:center;
      `;
      div.textContent = this.station.station_name
        .replace('タイムズ','T ')
        .replace('駐車場','P')
        .replace('第','#');
      this.div = div;
      this.getPanes().floatPane.appendChild(div);
    }
    draw() {
      const proj = this.getProjection();
      if (!proj || !this.div) return;
      const pos = proj.fromLatLngToDivPixel(
        new google.maps.LatLng(this.station.lat, this.station.lng)
      );
      this.div.style.left = pos.x + 'px';
      this.div.style.top  = pos.y + 'px';
    }
    onRemove() {
      if (this.div) { this.div.parentNode.removeChild(this.div); this.div = null; }
    }
  };
}

function clearLabels() {
  labelOverlays.forEach(l => l.setMap(null));
  labelOverlays = [];
}

function renderLabels() {
  clearLabels();
  if (!StationLabel) return;
  STATIONS.forEach(s => {
    if (s.status === 'checked' || s.status === 'unnecessary') return;
    const color = STATUS_COLOR[s.status] || '#445060';
    const label = new StationLabel(s, color);
    label.setMap(gMap);
    labelOverlays.push(label);
  });
}


function applyMapData(stations) {
  stations.forEach(st => gasStationMap.set(st.stationCd, st));
  STATIONS.forEach(s => {
    const gas = gasStationMap.get(s.stationCd);
    s.status    = gas ? gas.status    : 'unknown';
    s.total     = gas ? gas.total     : 0;
    s.standby   = gas ? gas.standby   : 0;
    s.checked   = gas ? gas.checked   : 0;
    s.hasUrgent = gas ? gas.hasUrgent : false;
  });
}

async function fetchMapData(silent = false) {
  if (!silent) {
    try {
      const cacheRaw = localStorage.getItem(MAP_CACHE_KEY + '_' + AREA_KEY());
      if (cacheRaw) {
        const cache = JSON.parse(cacheRaw);
        applyMapData(cache.stations);
        renderMarkers();
        showLoading(false);
      } else {
        showLoading(true);
      }
    } catch(e) { showLoading(true); }
  }

  try {
    const res = await fetch(`${GAS_URL}?action=getMapData&area=${AREA_KEY()}`);
    const data = await res.json();
    if (data.result !== 'OK') throw new Error(data.error || 'GASエラー');
    try { localStorage.setItem(MAP_CACHE_KEY + '_' + AREA_KEY(), JSON.stringify({ stations: data.stations, ts: Date.now() })); } catch(e) {}
    gasStationMap = new Map();
    applyMapData(data.stations);
  } catch(err) {
    console.error('データ取得失敗:', err);
    STATIONS.forEach(s => { s.status = 'standby'; s.total = 0; });
  }

  renderMarkers();
  showLoading(false);
}

function showLoading(show) {
  document.getElementById('loadingOverlay').style.display = show ? 'flex' : 'none';
}

// ===== エリア切り替え =====
async function switchArea(areaKey) {
  if (CURRENT_AREA === areaKey) return;
  CURRENT_AREA = areaKey;

  STATIONS.length = 0;
  const src = areaKey === 'nakahara' ? STATIONS_NAKAHARA : areaKey === 'ebina' ? STATIONS_EBINA : STATIONS_YAMATO;
  src.forEach(s => STATIONS.push({...s}));

  document.querySelectorAll('.area-tab').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.area === areaKey);
  });

  gasStationMap = new Map();
  clearScanBadges();

  // マップをエリア中心に移動
  if (gMap) {
    gMap.setCenter(AREA_CENTER[areaKey]);
    gMap.setZoom(AREA_ZOOM[areaKey]);
  }

  await fetchMapData();
}

// ===== GPS =====
function onGpsSuccess(pos) {
  const lat = pos.coords.latitude;
  const lng = pos.coords.longitude;
  try { localStorage.setItem(GPS_CACHE_KEY, JSON.stringify({ lat, lng })); } catch(e) {}
  if (window._detailOpen) return;
  updateGpsMarker(lat, lng);
}

function onGpsError(err) {
  console.warn('GPS取得失敗:', err.message);
  try {
    const cached = localStorage.getItem(GPS_CACHE_KEY);
    if (cached) {
      const { lat, lng } = JSON.parse(cached);
      updateGpsMarker(lat, lng);
    }
  } catch(e) {}
}

function updateGpsMarker(lat, lng) {
  if (!gMap) return;
  if (!gpsMarker) {
    gpsMarker = new google.maps.Marker({
      map: gMap,
      position: { lat, lng },
      icon: makeGpsSvg(),
      title: '現在地',
      zIndex: 100
    });
    animateGpsMarker();
  } else {
    gpsMarker.setPosition({ lat, lng });
  }
  showGpsNote(true);
}

function animateGpsMarker() {
  if (!gpsMarker) return;
  let visible = true;
  setInterval(() => {
    if (!gpsMarker || window._detailOpen) return;
    visible = !visible;
    gpsMarker.setOpacity(visible ? 1 : 0.2);
  }, 600);
}

function startGps() {
  try {
    const cached = localStorage.getItem(GPS_CACHE_KEY);
    if (cached) {
      const { lat, lng } = JSON.parse(cached);
      onGpsSuccess({ coords: { latitude: lat, longitude: lng } });
    }
  } catch(e) {}
  if (!navigator.geolocation) return;
  navigator.geolocation.getCurrentPosition(onGpsSuccess, onGpsError, { enableHighAccuracy: true, timeout: 10000 });
}

function showGpsNote(show) {
  const note = document.getElementById('gps-note');
  if (note) note.style.display = show ? 'block' : 'none';
}

// ===== 詳細パネル =====
function openDetail(station) {
  currentStation = station;
  window._detailOpen = true;
  document.getElementById('detailStation').textContent = station.station_name;
  document.getElementById('detailCd').textContent = `ST: ${station.stationCd} ／ ${station.total || 0}台`;

  // 目的地マーカーを強調表示、GPS点滅を止める
  if (gpsMarker) gpsMarker.setOpacity(0.3);
  showGpsNote(false);

  const container = document.getElementById('detailVehicles');
  container.innerHTML = '<div style="color:#e8f4ff;font-size:12px;padding:8px;text-align:center;">読み込み中...</div>';

  document.getElementById('detailPanel').classList.add('show');
  document.getElementById('overlay').classList.add('show');

  fetch(`${GAS_URL}?action=getStationDetail&station=${encodeURIComponent(station.station_name)}&area=${AREA_KEY()}`)
    .then(r => r.json())
    .then(data => {
      if (data.result !== 'OK') throw new Error(data.error || 'GASエラー');
      renderVehicleCards(container, data.vehicles, station);
    })
    .catch(err => {
      container.innerHTML = `<div style="color:#ff4d4d;font-size:12px;padding:8px;">取得失敗: ${err.message}</div>`;
    });
}

function closeDetail() {
  document.getElementById('detailPanel').classList.remove('show');
  document.getElementById('overlay').classList.remove('show');
  window._detailOpen = false;
  if (gpsMarker) gpsMarker.setOpacity(1);
  showGpsNote(true);
}

function openNav() {
  if (!currentStation) return;
  const url = `https://www.google.com/maps/dir/?api=1&destination=${currentStation.lat},${currentStation.lng}&travelmode=driving`;
  window.open(url, '_blank');
}

// ===== 車両カード =====
function renderVehicleCards(container, vehicles, station) {
  container.innerHTML = '';
  if (!vehicles || vehicles.length === 0) {
    container.innerHTML = '<div style="color:#e8f4ff;font-size:12px;padding:8px;">車両データなし</div>';
    return;
  }
  vehicles.forEach(v => {
    const card = document.createElement('div');
    card.className = 'vehicle-card';
    const color = STATUS_COLOR[v.status] || '#445060';
    const topRow = document.createElement('div');
    topRow.style.cssText = 'display:flex;align-items:center;gap:10px;width:100%;';
    topRow.innerHTML = `
      <div class="vehicle-status" style="background:${color};opacity:0.8;flex-shrink:0;"></div>
      <div class="vehicle-info" style="flex:1;min-width:0;">
        <div class="vehicle-plate">${v.plate}</div>
        <div class="vehicle-model">${v.model} ／ <span style="color:${color};font-size:12px;">${v.status}</span></div>
        ${v.lastChecked ? `<div style="font-size:11px;color:#e8f4ff;margin-top:2px;">前回: ${v.lastChecked}</div>` : ''}
      </div>
      <div class="vehicle-actions">
        <button class="btn-small btn-tire" onclick="goTireApp('${v.plate}','${station.station_name}','${v.model}')">点検</button>
      </div>
    `;
    card.appendChild(topRow);
    if (v.timeline) {
      const tlRow = document.createElement('div');
      tlRow.style.cssText = 'width:100%;padding-top:6px;border-top:1px solid #1a2d40;';
      tlRow.appendChild(buildTimeline(v.timeline, v.getTime));
      card.appendChild(tlRow);
    }
    container.appendChild(card);
  });
}

function buildTimeline(timeline, getTime) {
  const timelineStr = timeline;
  if (!timelineStr) return document.createElement('div');
  let baseDate = new Date((getTime || '').replace(/-/g, '/'));
  if (isNaN(baseDate.getTime())) baseDate = new Date();
  const totalSlots = timelineStr.length;
  const totalHours = totalSlots / 4;
  const timelineWidth = totalHours === 144 ? 3200 : 1600;
  let slotsHtml = '';
  for (const ch of timelineStr) {
    const cls = ch === '○' ? 'tl-ok' : (ch === 's' ? 'tl-stopped' : 'tl-ng');
    slotsHtml += `<div class="tl-slot ${cls}"></div>`;
  }
  let labelsHtml = '', gridsHtml = '';
  for (let h = 0; h < totalHours; h++) {
    const leftPos = (h / totalHours) * 100;
    const slotDate = new Date(baseDate.getTime() + h * 3600 * 1000);
    const currentHour = slotDate.getHours();
    if (currentHour % 2 === 0) {
      labelsHtml += `<div class="tl-label" style="left:${leftPos}%">${currentHour}</div>`;
      if (currentHour === 0) {
        const mm = slotDate.getMonth() + 1, dd = slotDate.getDate();
        labelsHtml += `<div class="tl-label tl-date" style="left:${leftPos}%;margin-left:6px;">${mm}/${dd}</div>`;
      }
    }
    gridsHtml += `<div class="tl-grid" style="left:${leftPos}%"></div>`;
  }
  const wrapper = document.createElement('div');
  wrapper.className = 'tl-scroll';
  wrapper.innerHTML = `<div class="tl-full" style="width:${timelineWidth}px">${labelsHtml}<div class="tl-bar">${slotsHtml}</div>${gridsHtml}</div>`;
  return wrapper;
}

// ===== 点検ボタン =====
function goTireApp(plate, stationName, model) {
  const JUNKAI_AREA_URL = `https://rkworks2025-coder.github.io/-/area.html?city=${CURRENT_AREA}`;
  try {
    localStorage.setItem('junkai:auto_tire_plate', plate);
    localStorage.setItem('junkai:auto_tire_station', stationName);
    localStorage.setItem('junkai:auto_tire_model', model);
  } catch(e) {}
  showToast(`巡回アプリに切り替えてください\n【${plate}】の点検ボタンが自動で押されます`);
}

// ===== スキャン =====
function clearScanBadges() {
  scanWrappers.forEach(m => { if (m) m.setMap(null); });
  scanWrappers = [];
}

function applyScanBadges(items) {
  clearScanBadges();
  let displayItems;
  if (scanMode === 'cluster') {
    displayItems = filterByClusterMode(items);
    if (displayItems.length === 0) { alert('完遂条件を満たすステーションが見つかりません'); return; }
  } else {
    const seen = new Set();
    displayItems = [];
    for (const item of items) {
      if (!seen.has(item.station)) { seen.add(item.station); displayItems.push(item); }
      if (displayItems.length >= 5) break;
    }
  }

  displayItems.forEach((item, idx) => {
    const s = STATIONS.find(st => st.station_name === item.station);
    if (!s) return;
    const marker = new google.maps.Marker({
      map: gMap,
      position: { lat: s.lat, lng: s.lng },
      icon: makeScanBadgeSvg(idx + 1),
      title: s.station_name,
      zIndex: 50
    });
    scanWrappers.push(marker);
  });
}

function filterByClusterMode(items) {
  const groups = new Map();
  items.forEach(item => {
    if (!groups.has(item.station)) groups.set(item.station, []);
    groups.get(item.station).push(item);
  });
  const result = [];
  groups.forEach((group) => {
    const rep = group.find(c => c.isUrgent) || group[0];
    const activeCount = rep.availableCount !== undefined ? rep.availableCount : group.length;
    const total = rep.stationTotal || activeCount;
    const checked = rep.stationChecked || 0;
    const remaining = total - checked;
    let shouldShow = false;
    if (remaining === 1 && activeCount >= 1) shouldShow = true;
    else if (remaining === 2 && activeCount >= 2) shouldShow = true;
    else if (remaining === 3 && activeCount >= 3) shouldShow = true;
    else if (total >= 4 && remaining >= 4 && activeCount >= 2) {
      shouldShow = true;
      if ((remaining - activeCount) === 1) shouldShow = false;
    }
    if (shouldShow) { rep.clusterInfo = { activeCount, total, remaining }; result.push(rep); }
  });
  return result.slice(0, 5);
}

function switchScanMode(mode) {
  scanMode = mode;
  localStorage.setItem('jks_scan_mode', mode);
  document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.mode === mode);
  });
  clearScanBadges();
}

async function triggerScan() {
  const btn = document.getElementById('scanBtn');
  if (!navigator.geolocation) { alert('GPS非対応です'); return; }
  btn.disabled = true; btn.classList.add('scanning'); btn.textContent = '取得中...';
  navigator.geolocation.getCurrentPosition(async (pos) => {
    const lat = pos.coords.latitude, lng = pos.coords.longitude;
    btn.textContent = 'スキャン中...';
    try {
      const res = await fetch(`${GAS_URL}?action=scan&lat=${lat}&lng=${lng}&area=${AREA_KEY()}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      applyScanBadges(data.items || []);
    } catch(err) { alert('スキャン失敗: ' + err.message); }
    finally { btn.disabled = false; btn.classList.remove('scanning'); btn.textContent = 'スキャン'; }
  }, () => {
    alert('現在地を取得できませんでした');
    btn.disabled = false; btn.classList.remove('scanning'); btn.textContent = 'スキャン';
  }, { enableHighAccuracy: true, timeout: 10000 });
}

// ===== 更新ボタン =====
async function triggerUpdate() {
  const btn = document.getElementById('updateBtn');
  btn.disabled = true; btn.textContent = '送信中...';
  const requestId = 'req-' + Date.now() + '-' + Math.random().toString(36).slice(-4);
  fetch(GAS_URL, { method: 'POST', body: JSON.stringify({ action: 'update', area: AREA_KEY(), requestId }), keepalive: true })
    .then(r => r.json())
    .then(data => {
      if (data.result === 'OK') {
        btn.textContent = '更新中...';
        setTimeout(() => {
          btn.textContent = '再読込中';
          fetchMapData().then(() => { btn.disabled = false; btn.textContent = '更新'; });
        }, 5 * 60 * 1000);
      } else throw new Error(data.error || '更新失敗');
    })
    .catch(err => { console.error(err); btn.disabled = false; btn.textContent = '更新'; });
}

// ===== トースト =====
function showToast(msg, duration = 4000) {
  let toast = document.getElementById('jks2-toast');
  toast.textContent = msg;
  toast.classList.add('show');
  if (toast._timer) clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), duration);
  toast.onclick = () => { clearTimeout(toast._timer); toast.classList.remove('show'); };
}

// ===== visibilitychange =====
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState !== 'visible') return;
  const toast = document.getElementById('jks2-toast');
  if (toast) { if (toast._timer) clearTimeout(toast._timer); toast.classList.remove('show'); }
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(onGpsSuccess, onGpsError, { enableHighAccuracy: true, timeout: 10000 });
  }
  if (window._detailOpen && currentStation) {
    const container = document.getElementById('detailVehicles');
    fetch(`${GAS_URL}?action=getStationDetail&station=${encodeURIComponent(currentStation.station_name)}&area=${AREA_KEY()}`)
      .then(r => r.json())
      .then(data => {
        if (data.result !== 'OK') return;
        if (data.vehicles.length === 0) { closeDetail(); fetchMapData(true); }
        else { renderVehicleCards(container, data.vehicles, currentStation); fetchMapData(true); }
      }).catch(() => {});
  } else {
    fetchMapData(true);
  }
});

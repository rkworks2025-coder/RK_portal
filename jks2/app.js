// ===== JKS-II app.js (Map版) =====

// ===== ステーションデータ =====
const STATIONS_TAMA = [
  {station_name:"パトリア桜ヶ丘",stationCd:"RB27",lat:35.65285,lng:139.44469},
  {station_name:"ＵＲプラザ永山",stationCd:"BH51",lat:35.63182,lng:139.44723},
  {station_name:"ＡＯＫＩ聖蹟桜ヶ丘店",stationCd:"QG74",lat:35.65185,lng:139.43947},
  {station_name:"アヴァンセ唐木田",stationCd:"LP58",lat:35.61578,lng:139.40835},
  {station_name:"多摩センター第３駐車場（小田急）",stationCd:"EA24",lat:35.62624,lng:139.42718},
  {station_name:"永山第７駐車場（小田急）",stationCd:"DN35",lat:35.62993,lng:139.43904},
  {station_name:"コメット",stationCd:"OJ88",lat:35.60979,lng:139.42806},
  {station_name:"聖蹟桜ヶ丘駅北第２",stationCd:"OX67",lat:35.65252,lng:139.44595},
  {station_name:"聖蹟桜ヶ丘東寺方１丁目",stationCd:"HH60",lat:35.64819,lng:139.44258},
  {station_name:"聖蹟桜ヶ丘モーリン駐車場",stationCd:"MC65",lat:35.64960,lng:139.44426},
  {station_name:"聖蹟桜ヶ丘ルートストレージ",stationCd:"KX72",lat:35.65050,lng:139.45317},
  {station_name:"タイムズ天本病院",stationCd:"QG60",lat:35.62220,lng:139.41341},
  {station_name:"タイムズガーデンヒルズ聖蹟桜ヶ丘",stationCd:"MF91",lat:35.65181,lng:139.44037},
  {station_name:"タイムズ聖蹟桜ヶ丘駅北",stationCd:"LM14",lat:35.65236,lng:139.44887},
  {station_name:"タイムズ聖蹟桜ヶ丘駅前交差点",stationCd:"R265",lat:35.65051,lng:139.44547},
  {station_name:"タイムズ聖蹟桜ヶ丘駅南口",stationCd:"DC98",lat:35.64886,lng:139.44754},
  {station_name:"タイムズ聖蹟和田",stationCd:"OO83",lat:35.64751,lng:139.43606},
  {station_name:"タイムズ多摩落合",stationCd:"R269",lat:35.62602,lng:139.42434},
  {station_name:"タイムズ多摩諏訪",stationCd:"HU00",lat:35.63418,lng:139.45078},
  {station_name:"タイムズ多摩諏訪２丁目",stationCd:"QP12",lat:35.62821,lng:139.44926},
  {station_name:"タイムズ多摩関戸第４",stationCd:"V070",lat:35.64181,lng:139.45135},
  {station_name:"タイムズ多摩関戸第５",stationCd:"T797",lat:35.65023,lng:139.44808},
  {station_name:"タイムズ多摩関戸第７",stationCd:"MF85",lat:35.64993,lng:139.45197},
  {station_name:"タイムズ多摩鶴牧第３",stationCd:"U501",lat:35.62359,lng:139.41787},
  {station_name:"タイムズ多摩鶴牧第４",stationCd:"KH83",lat:35.62281,lng:139.41697},
  {station_name:"タイムズプロムナード多摩",stationCd:"KH02",lat:35.61798,lng:139.42311},
  {station_name:"多摩愛宕４丁目",stationCd:"NY60",lat:35.63000,lng:139.43038},
  {station_name:"多摩一ノ宮",stationCd:"KG73",lat:35.65221,lng:139.44115},
  {station_name:"多摩一ノ宮鈴木駐車場",stationCd:"KW37",lat:35.64977,lng:139.44504},
  {station_name:"多摩落合１丁目",stationCd:"KU12",lat:35.62331,lng:139.43087},
  {station_name:"フォンテーヌ雅",stationCd:"RI38",lat:35.62565,lng:139.41934},
  {station_name:"タイムズ多摩乞田",stationCd:"IU60",lat:35.63212,lng:139.44126},
  {station_name:"タイムズ多摩センター中央第１",stationCd:"DG00",lat:35.62174,lng:139.42417},
  {station_name:"タイムズ多摩センター中央第３",stationCd:"R724",lat:35.62345,lng:139.42365},
  {station_name:"タイムズ多摩センター東第１",stationCd:"S306",lat:35.62455,lng:139.42851},
  {station_name:"多摩東寺方",stationCd:"II95",lat:35.64796,lng:139.44628},
  {station_name:"豊ヶ丘１丁目第１",stationCd:"ME81",lat:35.62623,lng:139.43088},
  {station_name:"タイムズ永山",stationCd:"OF51",lat:35.63330,lng:139.44610},
  {station_name:"永山第６駐車場（小田急）",stationCd:"KH39",lat:35.63042,lng:139.44111},
  {station_name:"馬場永山パーキング",stationCd:"QG86",lat:35.63405,lng:139.44810},
  {station_name:"ＵＲ諏訪一丁目ハイツ",stationCd:"DA16",lat:35.63168,lng:139.45020},
  {station_name:"ＵＲ多摩永山二丁目",stationCd:"Y755",lat:35.62515,lng:139.44953},
  {station_name:"ＵＲ多摩永山二丁目第２",stationCd:"LK45",lat:35.62604,lng:139.44927},
];

const STATIONS_FUCHU = [
  {station_name:"エリオ駐車場",stationCd:"KB50",lat:35.674979,lng:139.483962},
  {station_name:"タイムズ北府中",stationCd:"BP54",lat:35.682679,lng:139.471187},
  {station_name:"タイムズ多摩川競艇場前",stationCd:"BX03",lat:35.658916,lng:139.499385},
  {station_name:"タイムズ大國魂神社",stationCd:"BJ56",lat:35.669808,lng:139.479747},
  {station_name:"タイムズ大國魂神社（ＥＶ）",stationCd:"RJ77",lat:35.669808,lng:139.479747},
  {station_name:"タイムズ府中宮町第４",stationCd:"Q486",lat:35.669884,lng:139.482495},
  {station_name:"タイムズ府中宮町第６",stationCd:"U074",lat:35.670128,lng:139.480657},
  {station_name:"タイムズ府中宮西町第３",stationCd:"KV42",lat:35.670739,lng:139.475488},
  {station_name:"タイムズ府中寿町第２",stationCd:"U641",lat:35.674918,lng:139.475320},
  {station_name:"タイムズ府中小柳町第２",stationCd:"OK22",lat:35.664278,lng:139.502608},
  {station_name:"タイムズ府中小柳町第３",stationCd:"QA10",lat:35.662024,lng:139.502427},
  {station_name:"タイムズ府中新町１丁目",stationCd:"QB10",lat:35.687322,lng:139.487356},
  {station_name:"タイムズ府中栄町",stationCd:"BA69",lat:35.689633,lng:139.479922},
  {station_name:"タイムズ府中栄町第３",stationCd:"IU62",lat:35.688779,lng:139.479370},
  {station_name:"タイムズ府中町第３",stationCd:"T864",lat:35.674777,lng:139.481244},
  {station_name:"タイムズ府中緑町第３",stationCd:"EL20",lat:35.672004,lng:139.484468},
  {station_name:"タイムズ府中緑町第４",stationCd:"MJ91",lat:35.671460,lng:139.486792},
  {station_name:"タイムズ府中若松町第２",stationCd:"KE79",lat:35.673812,lng:139.498579},
  {station_name:"タイムズ府中ＦＲＣ",stationCd:"EJ52",lat:35.670787,lng:139.477875},
  {station_name:"タイムズ東京競馬場横",stationCd:"Y343",lat:35.662479,lng:139.491297},
  {station_name:"タイムズ東京競馬場横第２",stationCd:"RN89",lat:35.661728,lng:139.491862},
  {station_name:"タイムズ東府中駅前",stationCd:"BE95",lat:35.669504,lng:139.496397},
  {station_name:"フォトレ府中",stationCd:"DP94",lat:35.672102,lng:139.475670},
  {station_name:"マイプレイス東府中",stationCd:"IR04",lat:35.668110,lng:139.496191},
  {station_name:"メルベーユ多磨霊園",stationCd:"LJ16",lat:35.665129,lng:139.505486},
  {station_name:"ユーコート府中",stationCd:"CN26",lat:35.672585,lng:139.482908},
  {station_name:"レジデンス若松一番館",stationCd:"KU17",lat:35.672820,lng:139.501841},
  {station_name:"ヴェルト府中",stationCd:"QV05",lat:35.672478,lng:139.483006},
  {station_name:"北府中駅前",stationCd:"OL69",lat:35.678863,lng:139.473652},
  {station_name:"天神町１丁目",stationCd:"NH42",lat:35.678210,lng:139.488135},
  {station_name:"天神町２丁目",stationCd:"QE33",lat:35.681208,lng:139.491883},
  {station_name:"天神町４丁目",stationCd:"OC70",lat:35.681550,lng:139.492950},
  {station_name:"府中八幡町２丁目",stationCd:"BW45",lat:35.670268,lng:139.487017},
  {station_name:"府中大久保駐車場",stationCd:"BS67",lat:35.674966,lng:139.483232},
  {station_name:"府中幸町１丁目",stationCd:"OT24",lat:35.678407,lng:139.481923},
  {station_name:"府中是政６丁目",stationCd:"MT68",lat:35.655486,lng:139.483026},
  {station_name:"府中栄町第４",stationCd:"QE32",lat:35.690177,lng:139.479696},
  {station_name:"府中浅間町２丁目",stationCd:"QZ63",lat:35.683984,lng:139.497154},
  {station_name:"府中町２丁目駐車場",stationCd:"DX27",lat:35.673969,lng:139.484253},
  {station_name:"府中緑町１丁目",stationCd:"DB87",lat:35.671030,lng:139.486794},
  {station_name:"府中緑町２丁目第２",stationCd:"MH17",lat:35.672586,lng:139.490149},
  {station_name:"府中緑町２丁目第３",stationCd:"OG99",lat:35.671273,lng:139.487823},
  {station_name:"府中若松町１丁目第２",stationCd:"MR39",lat:35.669958,lng:139.501518},
  {station_name:"府中若松町２丁目",stationCd:"LR95",lat:35.672551,lng:139.496466},
  {station_name:"東府中マンション",stationCd:"KR74",lat:35.669518,lng:139.496391},
  {station_name:"清水が丘１丁目",stationCd:"QZ05",lat:35.666925,lng:139.493610},
  {station_name:"ＭＡＸＩＶ東府中",stationCd:"LV90",lat:35.671863,lng:139.497634},
  {station_name:"Ｔ'ｓ ｇａｒｄｅｎ府中",stationCd:"EA57",lat:35.678233,lng:139.486989},
  {station_name:"ＵＲ府中グリーンハイツ",stationCd:"V216",lat:35.678543,lng:139.477863},
];

// ===== 状態管理 =====
let CURRENT_AREA = 'tama';
let STATIONS = STATIONS_TAMA.map(s => ({...s}));
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
  tama:  { lat: 35.635, lng: 139.440 },
  fuchu: { lat: 35.672, lng: 139.485 },
};
const AREA_ZOOM = { tama: 13, fuchu: 14 };

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
  if (typeof requireUser === "function" && !requireUser("../select-user.html")) return;
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
  const src = areaKey === 'fuchu' ? STATIONS_FUCHU : STATIONS_TAMA;
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

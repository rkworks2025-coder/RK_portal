// ===== JKS-II app.js (Map版) =====

// ===== 状態管理 =====
let CURRENT_AREA = 'tama';
let STATIONS = []; // stationIDシート(GAS経由)から動的に構築
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

  // 既存ステーションを更新（座標はstationIDシート由来のGAS値を優先、
  // GAS未取得/異常値の場合のみローカルのハードコート値にフォールバック）
  STATIONS.forEach(s => {
    const gas = gasStationMap.get(s.stationCd);
    s.status    = gas ? gas.status    : 'unknown';
    s.total     = gas ? gas.total     : 0;
    s.standby   = gas ? gas.standby   : 0;
    s.checked   = gas ? gas.checked   : 0;
    s.hasUrgent = gas ? gas.hasUrgent : false;
    if (gas && Number.isFinite(gas.lat) && Number.isFinite(gas.lng)) {
      s.lat = gas.lat;
      s.lng = gas.lng;
    }
  });

  // STATIONSはstationIDシート(GAS)から全て動的に構築される。
  // まだSTATIONSに存在しないstationCdはここで新規追加として拾う
  const localCds = new Set(STATIONS.map(s => s.stationCd));
  stations.forEach(gas => {
    if (localCds.has(gas.stationCd)) return;
    if (!Number.isFinite(gas.lat) || !Number.isFinite(gas.lng)) return;
    STATIONS.push({
      station_name: gas.stationName,
      stationCd:    gas.stationCd,
      lat:          gas.lat,
      lng:          gas.lng,
      status:       gas.status    || 'unknown',
      total:        gas.total     || 0,
      standby:      gas.standby   || 0,
      checked:      gas.checked   || 0,
      hasUrgent:    gas.hasUrgent || false,
    });
    localCds.add(gas.stationCd);
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

  // エリア切り替え時はSTATIONSを空にし、以降のfetchMapData/キャッシュ読込で
  // stationIDシート(GAS)から新エリア分を構築する
  STATIONS.length = 0;

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
      zIndex: 100,
      cursor: 'pointer'
    });
    // 現在地マーカーはzIndexが全マーカー中最も高いため、
    // ステーションのピンと重なるとタップを吸収してしまう。
    // その場合は一番近いステーションのclickを代わりに発火させる。
    gpsMarker.addListener('click', () => {
      const pos = gpsMarker.getPosition();
      if (!pos) return;
      let nearest = null;
      let nearestDist = Infinity;
      STATIONS.forEach(s => {
        const dLat = s.lat - pos.lat();
        const dLng = s.lng - pos.lng();
        const dist = dLat * dLat + dLng * dLng;
        if (dist < nearestDist) {
          nearestDist = dist;
          nearest = s;
        }
      });
      // 目安として約30m以内(度換算で0.0003前後)にステーションが
      // あれば重なっていると判断し、そのマーカーのclickへ転送する
      if (nearest && nearestDist < 0.0003 * 0.0003) {
        const stationMarker = markerMap.get(nearest.stationCd);
        if (stationMarker) {
          google.maps.event.trigger(stationMarker, 'click');
        }
      }
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
      zIndex: 50,
      cursor: 'pointer'
    });
    // バッジはステーションマーカーの真上に重なるため、
    // バッジタップ時は下にあるステーションマーカーのclickを
    // そのまま発火させて詳細パネル/InfoWindowを開く
    marker.addListener('click', () => {
      const stationMarker = markerMap.get(s.stationCd);
      if (stationMarker) {
        google.maps.event.trigger(stationMarker, 'click');
      } else {
        openDetail(s);
      }
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

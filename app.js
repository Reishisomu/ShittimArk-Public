'use strict';
const translations = {
  'zh-CN': {skip:'跳至下载',navigation:'网站导航',language:'语言',heading1:'老师，欢迎回到',heading2:'我们的日常。',intro:'让阿洛娜与基沃托斯的风景，留在每一次点亮屏幕的瞬间。',features:'记忆大厅 · 动态桌宠 · 你的个性桌面',download:'下载 Android 版',github:'在 GitHub 查看',checksum:'校验 SHA-256',loading:'正在连接什亭之匣…',candidate:'公开测试版 · 完整兼容性仍在验证',stable:'完整 Android 安装包',unavailable:'下载暂时不可用，请前往 GitHub Releases。',copied:'校验值已复制。',copyFailed:'请手动复制：',independent:'独立同人项目 · 非官方应用',credit:'阿洛娜角色 © NEXON Games · 本站主视觉为 AI 绘制同人插画',artAlt:'阿洛娜站在蓝天与校园前，向老师伸出手',description:'Dreamheart Atelier · Shittim Ark。让阿洛娜与基沃托斯的风景，留在每一次点亮屏幕的瞬间。'},
  'zh-TW': {skip:'跳至下載',navigation:'網站導覽',language:'語言',heading1:'老師，歡迎回到',heading2:'我們的日常。',intro:'讓阿洛娜與奇普托斯的風景，留在每一次點亮螢幕的瞬間。',features:'回憶大廳 · 動態桌寵 · 你的個性桌面',download:'下載 Android 版',github:'在 GitHub 查看',checksum:'校驗 SHA-256',loading:'正在連接什亭之匣…',candidate:'公開測試版 · 完整相容性仍在驗證',stable:'完整 Android 安裝包',unavailable:'下載暫時無法使用，請前往 GitHub Releases。',copied:'校驗值已複製。',copyFailed:'請手動複製：',independent:'獨立同人專案 · 非官方應用程式',credit:'阿洛娜角色 © NEXON Games · 本站主視覺為 AI 繪製同人插畫',artAlt:'阿洛娜站在藍天與校園前，向老師伸出手',description:'Dreamheart Atelier · Shittim Ark。讓阿洛娜與奇普托斯的風景，留在每一次點亮螢幕的瞬間。'},
  en:{skip:'Skip to download',navigation:'Site navigation',language:'Language',heading1:'Welcome back, Sensei.',heading2:'Your everyday awaits.',intro:'A little Arona, a little Kivotos. A familiar world, every time your screen lights up.',features:'Memorial lobbies · Animated companions · A desktop of your own',download:'Download for Android',github:'Explore on GitHub',checksum:'Verify SHA-256',loading:'Connecting to the Shittim Chest…',candidate:'Public test build · Full compatibility is still being verified',stable:'Full Android installer',unavailable:'Download unavailable. Please visit GitHub Releases.',copied:'Checksum copied.',copyFailed:'Copy manually: ',independent:'Independent fan project · Unofficial app',credit:'Arona © NEXON Games · AI-created fan illustration',artAlt:'Arona reaches out to Sensei beneath a blue sky, with a school campus behind her',description:'Dreamheart Atelier · Shittim Ark. Bring Arona and a little Kivotos to your Android desktop.'},
  ja:{skip:'ダウンロードへ',navigation:'サイトナビゲーション',language:'言語',heading1:'おかえりなさい、先生。',heading2:'いつもの日常へ。',intro:'画面を灯す、その瞬間に。アロナとキヴォトスの風景を、あなたのそばへ。',features:'メモリアルロビー · 動くデスクトップペット · 自分だけのホーム画面',download:'Android版をダウンロード',github:'GitHubで見る',checksum:'SHA-256を確認',loading:'シッテムの箱に接続中…',candidate:'公開テスト版 · 互換性は引き続き検証中です',stable:'Android用フルインストーラー',unavailable:'ダウンロードできません。GitHub Releasesをご確認ください。',copied:'チェックサムをコピーしました。',copyFailed:'手動でコピー：',independent:'個人制作のファンプロジェクト · 非公式アプリ',credit:'アロナ © NEXON Games · AIで制作したファンイラスト',artAlt:'青空と校舎を背景に、先生に手を差し伸べるアロナ',description:'Dreamheart Atelier · Shittim Ark。アロナとキヴォトスの風景を、あなたのAndroidホーム画面へ。'},
  ko:{skip:'다운로드로 이동',navigation:'사이트 탐색',language:'언어',heading1:'어서 오세요, 선생님.',heading2:'우리의 일상으로.',intro:'화면을 켜는 순간마다, 아로나와 키보토스의 풍경이 선생님 곁에 머물도록.',features:'메모리얼 로비 · 움직이는 데스크톱 펫 · 나만의 홈 화면',download:'Android 버전 다운로드',github:'GitHub에서 보기',checksum:'SHA-256 확인',loading:'싯딤의 상자에 연결 중…',candidate:'공개 테스트 버전 · 전체 호환성 검증 진행 중',stable:'Android 전체 설치 파일',unavailable:'다운로드할 수 없습니다. GitHub Releases를 확인해 주세요.',copied:'체크섬을 복사했습니다.',copyFailed:'직접 복사: ',independent:'독립 팬 프로젝트 · 비공식 앱',credit:'아로나 © NEXON Games · AI로 제작한 팬 일러스트',artAlt:'푸른 하늘과 학교를 배경으로 선생님에게 손을 내미는 아로나',description:'Dreamheart Atelier · Shittim Ark. 아로나와 키보토스의 풍경을 Android 홈 화면에서 만나 보세요.'}
};
let language = 'zh-CN';
let release = null;
let releaseState = 'loading';
let feedbackState = '';
function text(key) {return translations[language][key];}
function httpsUrl(value) {
  if (typeof value !== 'string' || !value) return null;
  try {const u = new URL(value); return u.protocol === 'https:' && !u.username && !u.password ? u.href : null;} catch {return null;}
}
function updateStatus() {
  document.querySelector('#publication-note').textContent = text(releaseState === 'ready' ? (release.channel === 'prerelease' ? 'candidate' : 'stable') : releaseState === 'failed' ? 'unavailable' : 'loading');
  const feedback = document.querySelector('#hash-feedback');
  feedback.textContent = feedbackState === 'copied' ? text('copied') : feedbackState === 'failed' && release ? text('copyFailed') + release.sha256 : '';
}
function applyLanguage(next) {
  language = Object.hasOwn(translations, next) ? next : 'zh-CN';
  document.documentElement.lang = language;
  document.querySelector('#language').value = language;
  document.querySelectorAll('[data-i18n]').forEach(node => {node.textContent = text(node.dataset.i18n);});
  document.querySelectorAll('[data-i18n-aria]').forEach(node => {node.setAttribute('aria-label', text(node.dataset.i18nAria));});
  document.querySelectorAll('[data-i18n-alt]').forEach(node => {node.alt = text(node.dataset.i18nAlt);});
  document.querySelector('meta[name=description]').content = text('description');
  updateStatus();
}
let savedLanguage = null;
try {savedLanguage = localStorage.getItem('dreamheart-language');} catch {}
applyLanguage(new URLSearchParams(location.search).get('lang') || savedLanguage || 'zh-CN');
document.querySelector('#language').addEventListener('change', event => {
  applyLanguage(event.target.value);
  try {localStorage.setItem('dreamheart-language', language);} catch {}
  const url = new URL(location.href);url.searchParams.delete('lang');
  try {history.replaceState(null, '', url);} catch {}
});
document.querySelector('#copy-hash').addEventListener('click', async () => {
  if (!release || !/^[0-9a-f]{64}$/.test(release.sha256)) return;
  try {await navigator.clipboard.writeText(release.sha256);feedbackState = 'copied';} catch {feedbackState = 'failed';}
  updateStatus();
});
async function loadRelease() {
  try {
    const response = await fetch('release.json', {cache:'no-store'});
    if (!response.ok) throw new Error('Release metadata unavailable');
    const value = await response.json();
    const download = httpsUrl(value.downloadUrl);
    if (value.publicationState !== 'published' || !download || !/^[0-9a-f]{64}$/.test(value.sha256) || !Number.isFinite(value.bytes) || value.bytes <= 0) throw new Error('Release not published');
    release = value;releaseState = 'ready';
    document.querySelector('#version-number').textContent = release.versionName;
    document.querySelector('#file-size').textContent = `ARM64 · ${(release.bytes / 1048576).toFixed(1)} MiB`;
    const link = document.querySelector('#download-apk');link.href = download;link.removeAttribute('aria-disabled');link.rel = 'noopener noreferrer';
    document.querySelector('#copy-hash').disabled = false;
  } catch {releaseState = 'failed';}
  updateStatus();
}
loadRelease();

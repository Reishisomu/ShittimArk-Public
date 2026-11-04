'use strict';
function httpsUrl(value) {
  if (typeof value !== 'string' || !value) return null;
  try { const u = new URL(value); return u.protocol === 'https:' && !u.username && !u.password ? u.href : null; } catch { return null; }
}
async function loadRelease() {
  const response = await fetch('release.json', {cache: 'no-store'});
  if (!response.ok) throw new Error('版本说明暂时不可用');
  const release = await response.json();
  document.querySelector('#version-number').textContent = release.versionName;
  document.querySelector('#file-size').textContent = `ARM64 · ${(release.bytes / 1048576).toFixed(1)} MiB`;
  const download = httpsUrl(release.downloadUrl);
  const ready = release.publicationState === 'published' && download && /^[0-9a-f]{64}$/.test(release.sha256);
  if (ready) {
    const link = document.querySelector('#download-apk'); link.href = download; link.removeAttribute('aria-disabled'); link.rel = 'noopener';
    document.querySelector('#publication-note').textContent = `完整安装包 · ${release.versionName}`;
    for (const mirror of release.mirrors || []) {
      const url = httpsUrl(mirror.url);
      if (!url || mirror.sha256 !== release.sha256) continue;
      const a = document.createElement('a'); a.href = url; a.textContent = mirror.name; a.rel = 'noopener';
      document.querySelector('#download-mirrors').append(a);
    }
  }
  const changes = document.querySelector('#change-list'); changes.replaceChildren();
  for (const text of release.notes || []) {const li = document.createElement('li'); li.textContent = text; changes.append(li);}
  if (/^[0-9a-f]{64}$/.test(release.sha256)) {
    const copy = document.querySelector('#copy-hash'); copy.disabled = false;
    copy.addEventListener('click', async () => {
      const feedback = document.querySelector('#hash-feedback');
      try {await navigator.clipboard.writeText(release.sha256); feedback.textContent = '校验值已复制。';}
      catch {feedback.textContent = release.sha256;}
    });
  }
  const source = httpsUrl(release.sourceUrl);
  if (source) {const a = document.querySelector('#source-link'); a.href = source; a.textContent = '非核心模块源码'; a.removeAttribute('aria-disabled'); a.rel = 'noopener';}
  for (const entry of release.resources || []) {
    const url = httpsUrl(entry.url); if (!url) continue;
    const a = document.createElement('a'); a.href = url; a.textContent = entry.name; a.rel = 'noopener'; document.querySelector('#resource-links').append(a);
  }
}
loadRelease().catch(() => {document.querySelector('#publication-note').textContent = '版本信息读取失败，请稍后刷新。';document.querySelector('#change-list').textContent = '暂时无法读取更新说明。';});

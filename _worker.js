const versions = /^\d{1,3}(?:\.\d{1,3}){3}$/;
const releaseRepository = "https://github.com/Reishisomu/ShittimArk-Public/releases/download/";

async function resolveAttachment(releaseUrl, refresh) {
  const source = new URL(releaseUrl);
  if (refresh) source.searchParams.set("refresh", String(Date.now()));
  const result = await fetch(source, {
    method: "HEAD",
    redirect: "manual",
    cache: "no-store",
    headers: { "User-Agent": "ShittimArk-Download-Page", "Cache-Control": "no-cache" },
    signal: AbortSignal.timeout(6500)
  });
  const location = result.headers.get("Location");
  if (![301, 302, 303, 307, 308].includes(result.status) || !location) return null;

  const asset = new URL(location);
  if (asset.origin !== "https://release-assets.githubusercontent.com" ||
      asset.username || asset.password ||
      !asset.pathname.startsWith("/github-production-release-asset/1445260550/")) {
    return null;
  }
  // GitHub signs this address for a limited time. Leave time to start a download.
  const expiry = asset.searchParams.get("se");
  if (expiry !== null && !(Date.parse(expiry) > Date.now() + 60000)) return null;
  return asset.href;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (!url.pathname.startsWith("/downloads/")) return env.ASSETS.fetch(request);
    const headers = new Headers({ "Cache-Control": "private, no-store", "Referrer-Policy": "no-referrer" });
    if (!/^\/downloads\/ShittimArk-\d{1,3}(?:\.\d{1,3}){3}\.apk$/.test(url.pathname)) {
      return new Response(null, { status: 404, headers });
    }
    if (request.method !== "GET" && request.method !== "HEAD") {
      headers.set("Allow", "GET, HEAD");
      return new Response(null, { status: 405, headers });
    }
    let releaseUrl;
    try {
      const metadata = await env.ASSETS.fetch(new Request(new URL("/release.json", url)));
      if (!metadata.ok) throw Error("Release unavailable");
      const release = await metadata.json();
      if (release.publicationState !== "published" || release.channel !== "stable" ||
          typeof release.versionName !== "string" || !versions.test(release.versionName)) {
        throw Error("Release unavailable");
      }
      const filename = "ShittimArk-" + release.versionName + ".apk";
      releaseUrl = releaseRepository + release.versionName + "/" + filename;
      if (release.downloadUrl !== releaseUrl) throw Error("Invalid release URL");
      if (url.pathname !== "/downloads/" + filename) return new Response(null, { status: 404, headers });
    } catch {
      return new Response(null, { status: 503, headers });
    }
    for (const refresh of [false, true]) {
      try {
        const location = await resolveAttachment(releaseUrl, refresh);
        if (location) {
          headers.set("Location", location);
          return new Response(null, { status: 307, headers });
        }
      } catch {
        // Retry once with a fresh release lookup, including on a timeout.
      }
    }
    headers.set("Retry-After", "30");
    return new Response(request.method === "HEAD" ? null : "GitHub download temporarily unavailable.",
      { status: 503, headers });
  }
};

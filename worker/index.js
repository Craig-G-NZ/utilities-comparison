/** Utilities comparison Worker — canonical host check + static assets */

const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1']);

function readCanonicalHost(env) {
  return (env.CANONICAL_HOST || '').trim().toLowerCase();
}

function isAllowedHost(request, canonicalHost) {
  if (!canonicalHost) return true;
  const host = new URL(request.url).hostname.toLowerCase();
  return host === canonicalHost || LOCAL_HOSTS.has(host);
}

function blockedHostResponse(canonicalHost) {
  const site = canonicalHost ? `https://${canonicalHost}` : 'the configured custom domain';
  return new Response(
    `This app is only available at ${site}. workers.dev and preview URLs are disabled.`,
    { status: 403, headers: { 'Content-Type': 'text/plain; charset=utf-8' } }
  );
}

export default {
  async fetch(request, env) {
    const canonicalHost = readCanonicalHost(env);
    if (!isAllowedHost(request, canonicalHost)) {
      return blockedHostResponse(canonicalHost);
    }

    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return new Response('Method Not Allowed', { status: 405 });
    }

    return env.ASSETS.fetch(request);
  },
};

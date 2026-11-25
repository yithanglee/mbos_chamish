// Transitional routing: application, database and uploads run on Linode.
export default {
  async fetch(request) {
    const publicUrl = new URL(request.url);
    const originUrl = new URL(request.url);
    originUrl.hostname = 'mbos.damienslab.com';
    originUrl.protocol = 'https:';
    originUrl.port = '';
    const headers = new Headers(request.headers);
    headers.set('Host', originUrl.hostname);
    headers.set('X-Forwarded-Host', publicUrl.hostname);
    const response = await fetch(new Request(originUrl, {
      method: request.method, headers,
      body: ['GET', 'HEAD'].includes(request.method) ? undefined : request.body,
      redirect: 'manual',
    }));
    const outgoing = new Response(response.body, response);
    const location = outgoing.headers.get('Location');
    if (location) {
      const target = new URL(location, originUrl);
      if (target.hostname === originUrl.hostname) {
        target.hostname = publicUrl.hostname;
        outgoing.headers.set('Location', target.href);
      }
    }
    outgoing.headers.set('X-MBOS-Origin', 'linode');
    return outgoing;
  },
};

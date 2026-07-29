export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const response = await env.ASSETS.fetch(request);

    if (response.status === 404) {
      if (url.pathname.startsWith('/assets/')) {
        return new Response('Not Found', { status: 404 });
      }
      return env.ASSETS.fetch(new Request(new URL('/index.html', request.url), request));
    }

    return response;
  }
};

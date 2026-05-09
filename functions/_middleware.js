export async function onRequest({ request, next }) {
  const url = new URL(request.url);

  if (url.hostname === 'www.fariaslabs.cl') {
    url.hostname = 'fariaslabs.cl';
    return Response.redirect(url.toString(), 301);
  }

  return next();
}

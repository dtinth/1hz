// Licensed under a CC0 1.0 Universal (CC0 1.0) Public Domain Dedication
// http://creativecommons.org/publicdomain/zero/1.0/

// HTML files: try the network first, then the cache.
// Other files: try the cache first, then the network.
// Both: cache a fresh version if possible.
// (beware: the cache will grow and grow; there's no cleanup)

const cacheName = 'files';

addEventListener('fetch',  fetchEvent => {
  const request = fetchEvent.request;
  if (request.method !== 'GET') {
    return;
  }
  fetchEvent.respondWith(async function() {
    const fetchPromise = fetch(request).then(response => ({
      responseFromFetch: response,
      responseCopy: response.clone(),
    }));
    fetchEvent.waitUntil(async function() {
      const { responseCopy } = await fetchPromise;
      const myCache = await caches.open(cacheName);
      return myCache.put(request, responseCopy);
    }());
    if (request.headers.get('Accept').includes('text/html')) {
      try {
        const { responseFromFetch } = await fetchPromise;
        return responseFromFetch;
      }
      catch(error) {
        return caches.match(request);
      }
    } else {
      const responseFromCache = await caches.match(request);
      if (responseFromCache) {
        return responseFromCache;
      }
      const { responseFromFetch } = await fetchPromise;
      return responseFromFetch;
    }
  }());
});
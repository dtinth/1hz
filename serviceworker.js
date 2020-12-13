/* global workbox */
importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/5.0.0/workbox-sw.js"
);

const { registerRoute } = workbox.routing;
const { StaleWhileRevalidate, NetworkFirst } = workbox.strategies;

registerRoute(
  ({ request }) => request.headers.get("Accept").includes("text/html"),
  new NetworkFirst()
);

registerRoute(() => true, new StaleWhileRevalidate());

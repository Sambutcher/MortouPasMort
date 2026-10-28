// Service worker minimal : il sert seulement à rendre le jeu installable.
// Pas de cache ni de mode hors ligne, tout passe par le réseau comme avant.

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));

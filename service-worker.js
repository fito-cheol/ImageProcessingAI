const CACHE_NAME = 'figure-fusion-ai-cache-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/index.tsx',
  '/App.tsx',
  '/FigureFusionApp.tsx',
  '/TryOnApp.tsx',
  '/SoccerUniformApp.tsx',
  '/components/ColorInput.tsx',
  '/components/Footer.tsx',
  '/components/Header.tsx',
  '/components/ImageUploader.tsx',
  '/components/Loader.tsx',
  '/components/ModeSelector.tsx',
  '/components/PoseOptions.tsx',
  '/components/ResultDisplay.tsx',
  '/components/ServiceSelector.tsx',
  '/components/SoccerUniformOptions.tsx',
  '/components/Tooltip.tsx',
  '/components/TransformOptions.tsx',
  '/components/icons/BoxIcon.tsx',
  '/components/icons/SoccerBallIcon.tsx',
  '/components/icons/SparklesIcon.tsx',
  '/components/icons/UserIcon.tsx',
  '/contexts/LanguageContext.tsx',
  '/services/geminiService.ts',
  '/utils/fileUtils.ts',
  'https://cdn.tailwindcss.com',
  'https://lh3.google.com/u/0/d/1TVJqlkWJ8L3X-16TRM2CfdH0fvGq8uT0=w1920-h945-iv1?auditContext=prefetch',
  'https://lh3.google.com/u/0/d/1lGroK1OmZEYlv2iBJF-7BU64mOudX5fS=w1920-h945-iv2?auditContext=prefetch',
  'https://lh3.google.com/u/0/d/18CBXS8roCba8VbVDmfAMClBzbozoUwxM=w1297-h945-iv1?auditContext=prefetch'
];

// Install event: cache all static assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .catch(err => {
        console.error('Failed to cache assets:', err);
      })
  );
});

// Activate event: clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      );
    })
  );
});

// Fetch event: serve from cache, fall back to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});
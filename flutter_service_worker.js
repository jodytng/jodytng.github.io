'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "version.json": "53fb59e54fb87bb44dba7c2200e1dead",
"index.html": "ae37e7a0776bd0df761271a894c18b46",
"/": "ae37e7a0776bd0df761271a894c18b46",
"main.dart.js": "a7cddc69e1e64bd866b340aef833b881",
"flutter.js": "f85e6fb278b0fd20c349186fb46ae36d",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"manifest.json": "ace26d0c71a6ddf01f5f72671a426a89",
"assets/images/floralarrangements/petals.gif": "e4ed80db126c820a68fc60d31e8a007e",
"assets/images/floralarrangements/White-L.png": "1ed2d5c8d25b1b5a1a8e9269787cb23b",
"assets/images/floralarrangements/Yellow-R.png": "951ed459d3609393e922667792b6c6fb",
"assets/images/floralarrangements/Red-L.png": "1096b290af5a0b69d4fcea4fd693501f",
"assets/images/floralarrangements/Blue-L.png": "38376987692d6877df741cae894695b1",
"assets/images/floralarrangements/Colorful-R.png": "5b2d99f9731a27a54e9e602f325d27bd",
"assets/images/floralarrangements/Pink-R.png": "48425ae8edebac1f8d43f1167e621356",
"assets/images/floralarrangements/Blue-R.png": "5697c81d521d3337972c810cff568f73",
"assets/images/floralarrangements/Colorful-L.png": "4f8504ac72023faa555bd6c35df4f385",
"assets/images/floralarrangements/Pink-L.png": "6c5cab1339234a7b9c1400ae7dbe6e4c",
"assets/images/floralarrangements/White-R.png": "1d8fa1589c3b5ecae7ee726f6708b20f",
"assets/images/floralarrangements/Yellow-L.png": "b2ade3d21c1a397316465f6a1b5ed04e",
"assets/images/floralarrangements/Red-R.png": "3db3a7a5f4dc168b70aff70930dcae12",
"assets/images/caskets/casket2.png": "a0fbb4d922b008c91022ff3ca054b67d",
"assets/images/caskets/casket3.png": "b207492ae21bef6afc8a766ec6427e80",
"assets/images/caskets/casket1.png": "838aa70c045a2ba8ae371e2c4f8c13d7",
"assets/images/caskets/casket4.png": "9e81f308d453f8500fd74973c67e22e4",
"assets/images/placeholder.png": "28f83b4494d510b3cab240a62c43e4e0",
"assets/images/backgrounds/Dark.png": "506b6096a94b8f6c4805b3c1d33aa660",
"assets/images/backgrounds/Party.png": "bb76c0344dc23ef8a354ad5a81b3abd9",
"assets/images/backgrounds/Tropical.png": "9d24e8b66b412f332c1a033a9be69ed0",
"assets/images/backgrounds/Default.png": "038a41dcc9cfa7b9835f842066755e56",
"assets/images/menus/Chinese.png": "9c13f049cf2368b39cbc1c867f66b3a3",
"assets/images/menus/Western.png": "26aa716637679b6a6e89c6cff2e2a947",
"assets/images/menus/Vegetarian.png": "f821a38ca61b391f9548bcd881cde55d",
"assets/images/menus/Halal.png": "bafa7dfb870b820754326ef3cc6dc883",
"assets/AssetManifest.json": "efc63cfb5bac3fe3921ebeca005db398",
"assets/NOTICES": "9f9abcb0a6e36a732e1aec5276b2b6ab",
"assets/FontManifest.json": "99e27fc3e34adacb97e6af88c426e7ee",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"assets/shaders/ink_sparkle.frag": "4d54087e283340d5034d3b63d8f72630",
"assets/fonts/Vollkorn-Regular.ttf": "c23c3bc1f799f3872878f2d76b543bd1",
"assets/fonts/Vollkorn-Italic.ttf": "949a668205aa63b83a970966c706dfeb",
"assets/fonts/MaterialIcons-Regular.otf": "95db9098c58fd6db106f1116bae85a0b",
"canvaskit/canvaskit.js": "2bc454a691c631b07a9307ac4ca47797",
"canvaskit/profiling/canvaskit.js": "38164e5a72bdad0faa4ce740c9b8e564",
"canvaskit/profiling/canvaskit.wasm": "95a45378b69e77af5ed2bc72b2209b94",
"canvaskit/canvaskit.wasm": "bf50631470eb967688cca13ee181af62"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "main.dart.js",
"index.html",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}

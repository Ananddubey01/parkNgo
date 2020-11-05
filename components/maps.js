const API_KEY = "hiFb9AwLW8YykC9ba9JqrSt5364sy0HnwQlhOLFdusc";
var platform = new H.service.Platform({
  apikey: API_KEY,
});

var defaultLayers = platform.createDefaultLayers();

var map = new H.Map(
  document.getElementById("mapContainer"),
  defaultLayers.vector.normal.map,
  {
    zoom: 12,
    center: { lat: 28.7041, lng: 77.1025 },
  }
);



map.addEventListener("tap", function (evt) {
  // Log 'tap' and 'mouse' events:
  console.log(evt.type, evt.currentPointer.type);
});
var mapEvents = new H.mapevents.MapEvents(map);

var behavior = new H.mapevents.Behavior(mapEvents);

var svgMarkup =
  '<svg width="24" height="24" ' +
  'xmlns="http://www.w3.org/2000/svg">' +
  '<rect stroke="white" fill="#1b468d" x="1" y="1" width="22" ' +
  'height="22" /><text x="12" y="18" font-size="12pt" ' +
  'font-family="Arial" font-weight="bold" text-anchor="middle" ' +
  'fill="white">H</text></svg>';

// Create an icon, an object holding the latitude and longitude, and a marker:
var icon = new H.map.Icon(svgMarkup),
  coords = { lat: 28.7041, lng: 77.1025 },
  marker = new H.map.Marker(coords, { icon: icon });

// Add the marker to the map and center the map at the location of the marker:
map.addObject(marker);
map.setCenter(coords);
map.setZoom(16);

var ui = H.ui.UI.createDefault(map, defaultLayers, 'en-US');

var service = platform.getSearchService();

// Call the geocode method with the geocoding parameters,
// the callback and an error callback function (called if a
// communication error occurs):
service.geocode({
  q: 'Lucknow'
}, (result) => {
  // Add a marker for each location found
  result.items.forEach((item) => {
    map.addObject(new H.map.Marker(item.position));
  });
}, alert);
console.log("alert");
const API_KEY = "hiFb9AwLW8YykC9ba9JqrSt5364sy0HnwQlhOLFdusc";

//Intialise Map Object
const locationList = [
  { lat: 28.6139, lng: 77.209 },
  { lat: 28.5479, lng: 77.2031 },
  { lat: 28.6505, lng: 77.2303 },
  { lat: 28.6304, lng: 77.2177 },
  { lat: 28.5649, lng: 77.2403 },
  { lat: 28.4595, lng: 77.0266 },
];
function initMap(API_KEY) {
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

  var mapEvents = new H.mapevents.MapEvents(map);

  var behavior = new H.mapevents.Behavior(mapEvents);

  function addMarkerToMap(props) {
    var hostPlaceMarker = new H.map.Marker(props.chords);
    map.addObject(hostPlaceMarker);
  }

  window.addEventListener("resize", () => map.getViewPort().resize());

  window.onload = function () {
    locationList.forEach((element) => {
      addMarkerToMap({ chords: element });
    });
  };
}

initMap(API_KEY);

map.addEventListener("tap", function (evt) {
  // Log 'tap' and 'mouse' events:
  console.log(evt.type, evt.currentPointer.type);
});

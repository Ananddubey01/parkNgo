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

function getUserCurrentLocation(callback) {
  navigator.geolocation.getCurrentPosition(function (position) {
    var lat = position.coords.latitude;
    var lng = position.coords.longitude;
    window.console &&
      console.log("coords : latitude=" + lat + ", longitude=" + lng);
    callback(["coords", lat, lng]);
  });
}

function initMap(API_KEY) {
  var platform = new H.service.Platform({
    apikey: API_KEY,
  });

  var defaultLayers = platform.createDefaultLayers();
  var map = new H.Map(
    document.getElementById("mapContainer"),

    defaultLayers.vector.normal.map,
    {
      zoom: 10,
      center: { lat: lat, lng: lng },
    }
  );


  function addMarkerToMap(props) {
    var hostPlaceMarker = new H.map.Marker(props.chords);
    map.addObject(hostPlaceMarker);
  }

  window.onload = function () {
    locationList.forEach((element) => {
    addMarkerToMap({ chords: element });
    console.log("Check");
      });
  };

  var mapEvents = new H.mapevents.MapEvents(map);
  var behavior = new H.mapevents.Behavior(mapEvents);
  var ui = H.ui.UI.createDefault(map, defaultLayers, 'en-US');
}


var lat = 28.6139;
var lng = 77.209;
getUserCurrentLocation(function (callback) {
  lat = callback[1];
  lng = callback[2];

  // Override for getting Delhi location

  lat = 28.6139;
  lng = 77.209;
});
initMap(API_KEY);

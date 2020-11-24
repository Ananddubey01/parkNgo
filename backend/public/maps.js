mapboxgl.accessToken =
  'pk.eyJ1Ijoic2hyZXktZGV2ZXAiLCJhIjoiY2todmtqeXczNTRkeDJzbDZreXpoeWYzciJ9.1ONnJIWMZeFQEAGw2XIAvQ';
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11', // style URL
  center: [-74.5, 40], // starting position [lng, lat]
  zoom: 9, // starting zoom
});

map.addControl(new mapboxgl.NavigationControl());

map.addControl(
  new MapboxDirections({
  accessToken: mapboxgl.accessToken
  }),
  'top-left'
  );
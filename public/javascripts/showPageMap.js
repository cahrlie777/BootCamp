geo = JSON.parse(geometry);
mapboxgl.accessToken = mapToken;
  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
    center: geo.coordinates, // starting position [lng, lat]
    zoom: 8 // starting zoom
  });

var marker = new mapboxgl.Marker()
.setLngLat(geo.coordinates)
.addTo(map);

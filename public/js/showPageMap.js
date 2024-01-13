mapboxgl.accessToken = mapToken;

if (!mapboxgl.supported()) {
  alert("Your browser does not support Mapbox GL");
} else {
  const coordinates = JSON.parse(coordinatesAsJson);
  const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v12",
    center: coordinates,
    zoom: 9,
  });
  map.addControl(new mapboxgl.NavigationControl());
  new mapboxgl.Marker()
    .setLngLat(coordinates)
    .setPopup(
        new mapboxgl.Popup({
            offset:25
        })
        .setHTML(
            `<h3>${campgroundTitle}</h3><p>${campgroundLocation}</p>`
        )
    )
    .addTo(map);
}

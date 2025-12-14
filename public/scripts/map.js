/* eslint-disable no-undef */

const mapEl = document.getElementById("map");

const locations = JSON.parse(mapEl.dataset.locations);

const map = L.map("map", {
  scrollWheelZoom: false,
  zoomControl: false,
  closePopupOnClick: false
}).setView([51.505, -0.09], 10);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

const bounds = L.latLngBounds();

locations.forEach((point) => {
  const latLng = [point.coordinates[1], point.coordinates[0]];
  bounds.extend(latLng);

  L.marker(latLng)
    .addTo(map)
    .bindPopup(`Day ${point.day}: ${point.description}`, {
      offset: [0, -1]
    });
});

map.fitBounds(bounds, {
  padding: [100, 100]
});

import L from "leaflet";

export const createUserLocationIcon = () => {
  return L.divIcon({
    className: "user-marker bg-purple-dark",
    html: `<div style="width: 28px; height: 28px; border-radius: 50%; border: 5px solid white; background-color: green;"></div>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  });
};

export const createProductLocationIcon = () => {
  return L.divIcon({
    className: "user-marker bg-purple-dark",
    html: `<div style="width: 28px; height: 28px; border-radius: 50%; border: 5px solid white; background-color: blue;"></div>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  });
};
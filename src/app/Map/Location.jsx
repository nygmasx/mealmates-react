import { useState, useEffect } from "react";

const useGeolocation = () => {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        (error) => {
          console.error("Erreur de loc:", error);
        },
        { enableHighAccuracy: true }
      );
    }
  }, []);

  return { latitude, longitude };
};

export default useGeolocation;

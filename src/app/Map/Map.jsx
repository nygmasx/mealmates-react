import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import useGeolocation from "./Location.jsx";
import { createUserLocationIcon } from "./CustomMarker.jsx";
import { useState, useCallback, useEffect } from "react";

const LocationMarker = ({ position, setPosition }) => {
  return position === null ? null : (
    <Marker position={position} icon={createUserLocationIcon()}>
      <Popup>Ma position</Popup>
    </Marker>
  );
};

const MapController = ({ onLocateClick, setPosition }) => {
  const map = useMap();

  const handleLocate = useCallback(() => {
    map.locate();
  }, [map]);

  useEffect(() => {
    const handleLocationFound = (e) => {
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    };

    const handleLocationError = () => {
      map.flyTo([49.20345799589907, 2.588511010251282], map.getZoom());
    };

    map.on("locationfound", handleLocationFound);
    map.on("locationerror", handleLocationError);

    map.locate();

    return () => {
      map.off("locationfound", handleLocationFound);
      map.off("locationerror", handleLocationError);
    };
  }, [map, setPosition]);

  onLocateClick(handleLocate);

  return null;
};

const Map = () => {
  const { latitude, longitude } = useGeolocation();
  const [currentPosition, setCurrentPosition] = useState([49.20345799589907, 2.588511010251282]);
  const [locateFunction, setLocateFunction] = useState(null);

  const handleSetLocateFunction = useCallback((fn) => {
    setLocateFunction(() => fn);
  }, []);

  const handleButtonClick = () => {
    if (locateFunction) {
      locateFunction();
    }
  };

  useEffect(() => {
    if (latitude && longitude) {
      setCurrentPosition([latitude, longitude]);
    }
  }, [latitude, longitude]);

  return (
    <div className="relative">
      <MapContainer style={{ width: "100%", height: "100vh" }} center={currentPosition} zoom={13} scrollWheelZoom={true}>
        <TileLayer attribution='&copy; <a href="https://github.com/nygmasx/mealmates-react">Mealmates</a>' url="https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png" />
        <LocationMarker position={currentPosition} setPosition={setCurrentPosition} />
        <MapController onLocateClick={handleSetLocateFunction} setPosition={setCurrentPosition} />
      </MapContainer>
      <div className="absolute bottom-4 right-4 z-[1000]">
        <button className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-100 transition-colors" onClick={handleButtonClick} aria-label="Localiser ma position">
          <svg width="24" height="24" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 10C9.10457 10 10 9.10457 10 8C10 6.89543 9.10457 6 8 6C6.89543 6 6 6.89543 6 8C6 9.10457 6.89543 10 8 10Z" fill="#000000" />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M2.08296 7C2.50448 4.48749 4.48749 2.50448 7 2.08296V0H9V2.08296C11.5125 2.50448 13.4955 4.48749 13.917 7H16V9H13.917C13.4955 11.5125 11.5125 13.4955 9 13.917V16H7V13.917C4.48749 13.4955 2.50448 11.5125 2.08296 9H0V7H2.08296ZM4 8C4 5.79086 5.79086 4 8 4C10.2091 4 12 5.79086 12 8C12 10.2091 10.2091 12 8 12C5.79086 12 4 10.2091 4 8Z"
              fill="#000000"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Map;

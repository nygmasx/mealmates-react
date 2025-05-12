import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import useGeolocation from "./Location.jsx";
import { createUserLocationIcon } from "./CustomMarker.jsx";
import { useState, useCallback, useEffect, useRef } from "react";
import Searchbar from "@/components/map/Searchbar.jsx";
import Navbar from "@/components/Navbar.jsx";

const LocationMarker = ({ position }) => {
  return position === null ? null : (
      <Marker position={position} icon={createUserLocationIcon()}>
        <Popup>Ma position</Popup>
      </Marker>
  );
};

const MapController = ({ onLocateClick, setPosition }) => {
  const map = useMap();

  useEffect(() => {
    const handleLocate = () => {
      map.locate();
    };

    if (onLocateClick) {
      onLocateClick(handleLocate);
    }

    const handleLocationFound = (e) => {
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    };

    const handleLocationError = (e) => {
      console.log("Erreur de localisation:", e);
      map.flyTo([49.20345799589907, 2.588511010251282], map.getZoom());
    };

    map.on("locationfound", handleLocationFound);
    map.on("locationerror", handleLocationError);

    const locateTimer = setTimeout(() => {
      try {
        map.locate();
      } catch (error) {
        console.error("Erreur lors de l'appel à map.locate():", error);
      }
    }, 500);

    return () => {
      clearTimeout(locateTimer);
      map.off("locationfound", handleLocationFound);
      map.off("locationerror", handleLocationError);
    };
  }, [map, setPosition, onLocateClick]);

  return null;
};

const Map = () => {
  const { latitude, longitude } = useGeolocation();
  const [currentPosition, setCurrentPosition] = useState([49.20345799589907, 2.588511010251282]);
  const locateFunctionRef = useRef(null);

  const handleSetLocateFunction = useCallback((fn) => {
    locateFunctionRef.current = fn;
  }, []);

  const handleButtonClick = () => {
    if (locateFunctionRef.current) {
      locateFunctionRef.current();
    }
  };

  useEffect(() => {
    if (latitude && longitude) {
      setCurrentPosition([latitude, longitude]);
    }
  }, [latitude, longitude]);

  return (
      <div className="flex flex-col h-screen">
        <div className="relative flex-grow h-[90%]">
          <MapContainer className="h-full w-full" center={currentPosition} zoom={13} scrollWheelZoom={true}>
            <TileLayer attribution='&copy; <a href="https://github.com/nygmasx/mealmates-react">Mealmates</a>' url="https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png" />
            <LocationMarker position={currentPosition} />
            <MapController onLocateClick={handleSetLocateFunction} setPosition={setCurrentPosition}/>
          </MapContainer>

          <div className="absolute top-4 left-0 right-0 z-[1000]">
            <Searchbar/>
          </div>

          <div className="absolute bottom-4 right-4 z-[1000]">
            <button
                className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-100 transition-colors border border-gray-200"
                onClick={handleButtonClick}
                aria-label="Localiser ma position"
            >
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

        <div className="flex-shrink-0 h-[10%] fixed bottom-0 left-0 w-full bg-white shadow-md pb-[env(safe-area-inset-bottom)] z-[1000]">
          <Navbar />
        </div>
      </div>
  );
};

export default Map;

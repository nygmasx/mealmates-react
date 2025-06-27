import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import useGeolocation from "./Location.jsx";
import { createUserLocationIcon } from "./CustomMarker.jsx";
import ProductLocationMarker from "./ProductMarkers.jsx";
import { useState, useCallback, useEffect, useRef } from "react";
import Searchbar from "@/components/map/Searchbar.jsx";
import Layout from "../Layout.jsx";
import axiosConfig from "@/context/axiosConfig.js";
import { geocodeAddress } from "./geocodingService.js";

const LocationMarker = ({ position }) => {
  return position === null ? null : (
    <Marker position={position} icon={createUserLocationIcon()}>
      <Popup>Ma position</Popup>  
    </Marker>
  );
};

const MapController = ({ onLocateClick, setPosition, searchLocation }) => {
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
      map.flyTo([49.20345799589907, 2.588511010251282], map.getZoom());
    };

    map.on("locationfound", handleLocationFound);
    map.on("locationerror", handleLocationError);

    const locateTimer = setTimeout(() => {
      try {
        map.locate();
      } catch (error) {
      }
    }, 500);

    return () => {
      clearTimeout(locateTimer);
      map.off("locationfound", handleLocationFound);
      map.off("locationerror", handleLocationError);
    };
  }, [map, setPosition, onLocateClick]);

  useEffect(() => {
    if (searchLocation && searchLocation.coordinates) {
      const { latitude, longitude } = searchLocation.coordinates;
      const newPosition = [latitude, longitude];
      setPosition(newPosition);
      map.flyTo(newPosition, 14);
    }
  }, [searchLocation, map, setPosition]);

  return null;
};

const Map = () => {
  const { latitude, longitude } = useGeolocation();
  const [currentPosition, setCurrentPosition] = useState([49.20345799589907, 2.588511010251282]);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterLoading, setFilterLoading] = useState(false);
  const [error, setError] = useState(null);
  const [geocodingProgress, setGeocodingProgress] = useState({ current: 0, total: 0 });
  const [selectedLocation, setSelectedLocation] = useState(null);
  const locateFunctionRef = useRef(null);

  const handleSetLocateFunction = useCallback((fn) => {
    locateFunctionRef.current = fn;
  }, []);

  const handleButtonClick = () => {
    if (locateFunctionRef.current) {
      locateFunctionRef.current();
    }
  };

  const handleLocationSelected = useCallback((locationData) => {
    console.log('Localisation sélectionnée:', locationData);
    setSelectedLocation(locationData);
  }, []);

  const handleFiltersApplied = useCallback(async (filteredData) => {
    if (filteredData && filteredData.length > 0) {
      setFilterLoading(true);
      try {
        const geocodedFilteredProducts = await geocodeProducts(filteredData);
        setFilteredProducts(geocodedFilteredProducts);
      } catch (error) {
        console.error('Erreur lors du filtrage:', error);
      } finally {
        setFilterLoading(false);
        setGeocodingProgress({ current: 0, total: 0 });
      }
    } else {
      setFilteredProducts([]);
      setFilterLoading(false);
    }
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilteredProducts([]);
    setSelectedLocation(null);
    setFilterLoading(false);
    setGeocodingProgress({ current: 0, total: 0 });
  }, []);

  const geocodeProducts = async (productsData) => {
    const geocodedProducts = [];
    setGeocodingProgress({ current: 0, total: productsData.length });
    for (let i = 0; i < productsData.length; i++) {
      const productData = productsData[i];
      const address = productData?.pickingAddress;
      if (address && address.trim()) {
        try {
          const geocodeResult = await geocodeAddress(address);
          if (geocodeResult) {
            const updatedProductData = {
              ...productData,
              latitude: geocodeResult.latitude,
              longitude: geocodeResult.longitude,
              geocoded: true,
              originalAddress: address,
              geocodedAddress: geocodeResult.displayName
            };
            geocodedProducts.push(updatedProductData);
          } else {
            geocodedProducts.push({
              ...productData,
              geocoded: false,
              geocodeError: true,
              errorAddress: address
            });
          }
        } catch (error) {
          geocodedProducts.push({
            ...productData,
            geocoded: false,
            geocodeError: true,
            errorAddress: address
          });
        }
      } else {
        geocodedProducts.push({
          ...productData,
          geocoded: false,
          noAddress: true
        });
      }
      setGeocodingProgress({ current: i + 1, total: productsData.length });
    }
    return geocodedProducts;
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axiosConfig.get('/product/');
        const geocodedProducts = await geocodeProducts(response.data);
        setProducts(geocodedProducts);
        setFilteredProducts([]);
      } catch (error) {
        setError("Impossible de charger les produits");
        setProducts([]);
      } finally {
        setLoading(false);
        setGeocodingProgress({ current: 0, total: 0 });
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (latitude && longitude) {
      setCurrentPosition([latitude, longitude]);
    }
  }, [latitude, longitude]);

  const displayedProducts = filteredProducts.length > 0 ? filteredProducts : products;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const validProducts = displayedProducts.filter(productData => {
    const hasValidCoordinates = productData.geocoded && 
                               productData.latitude && 
                               productData.longitude && 
                               !isNaN(productData.latitude) && 
                               !isNaN(productData.longitude);
    const isNotExpired = new Date(productData.expiresAt) >= today;
    return hasValidCoordinates && isNotExpired;
  });

  const hasActiveFilters = filteredProducts.length > 0;

  return (
    <Layout>
      <div className="flex flex-col h-full">
          <MapContainer 
            className="h-full w-full z-[900]" 
            center={currentPosition} 
            zoom={13} 
            scrollWheelZoom={true}
          >
            <TileLayer 
              attribution='&copy; <a href="https://github.com/nygmasx/mealmates-react">Mealmates</a>' 
              url="https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png" 
            />
            <LocationMarker position={currentPosition} />
            {validProducts.map((productData, index) => (
              <ProductLocationMarker 
                key={productData?.id || index} 
                productData={productData} 
              />
            ))}
            <MapController 
              onLocateClick={handleSetLocateFunction} 
              setPosition={setCurrentPosition}
              searchLocation={selectedLocation}
            />
          </MapContainer>
          <div className="fixed top-4 left-0 right-0 z-[1000]">
            <Searchbar 
              onFiltersApplied={handleFiltersApplied}
              onClearFilters={handleClearFilters}
              hasActiveFilters={hasActiveFilters}
              onLocationSelected={handleLocationSelected}
            />
          </div>
          <div className="absolute bottom-28 right-4 z-[900]">
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
          {(loading || (filterLoading && geocodingProgress.total > 0)) && (
            <div className="absolute inset-0 flex items-center justify-center z-[1000]">
              <div className="bg-white p-4 rounded-lg shadow-lg flex items-center space-x-3">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-green-500 border-t-transparent"></div>
                <span className="text-sm text-gray-700">
                  {filterLoading 
                    ? `Géolocalisation des filtres... ${geocodingProgress.current}/${geocodingProgress.total}`
                    : 'Chargement des produits...'
                  }
                </span>
              </div>
            </div>
          )}
          {error && (
            <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-[1000] bg-red-100 border border-red-400 text-red-700 rounded-lg px-4 py-2">
              <span className="text-sm">{error}</span>
            </div>
          )}
          {hasActiveFilters && (
            <div className="absolute top-20 left-4 z-[999] bg-green-100 border border-green-400 text-green-700 rounded-lg px-3 py-2">
              <span className="text-sm">
                {validProducts.length} produit{validProducts.length !== 1 ? 's' : ''} filtré{validProducts.length !== 1 ? 's' : ''}
              </span>
            </div>
          )}
      </div>
    </Layout>
  );
};

export default Map;

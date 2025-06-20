const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const GOOGLE_GEOCODING_BASE_URL = 'https://maps.googleapis.com/maps/api/geocode/json';

const geocodeCache = new Map();

export const geocodeAddress = async (address) => {
  if (!address || typeof address !== 'string') {
    return null;
  }

  if (!GOOGLE_MAPS_API_KEY) {
    console.error('Clé API Google Maps manquante. Vérifiez votre fichier .env (VITE_GOOGLE_MAPS_API_KEY)');
    return null;
  }

  const cacheKey = address.toLowerCase().trim();
  if (geocodeCache.has(cacheKey)) {
    return geocodeCache.get(cacheKey);
  }

  try {
    const encodedAddress = encodeURIComponent(address);
    const url = `${GOOGLE_GEOCODING_BASE_URL}?address=${encodedAddress}&key=${GOOGLE_MAPS_API_KEY}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.status !== 'OK') {
      console.warn(`Erreur de géocodage Google: ${data.status}`, data.error_message || '');
      geocodeCache.set(cacheKey, null);
      return null;
    }
    
    if (data.results && data.results.length > 0) {
      const firstResult = data.results[0];
      const result = {
        latitude: firstResult.geometry.location.lat,
        longitude: firstResult.geometry.location.lng,
        displayName: firstResult.formatted_address,
        originalAddress: address,
        placeId: firstResult.place_id,
        types: firstResult.types,
        addressComponents: firstResult.address_components
      };
      
      geocodeCache.set(cacheKey, result);
      return result;
    } else {
      geocodeCache.set(cacheKey, null);
      return null;
    }
    
  } catch (error) {
    console.error('Erreur de géocodage Google:', error);
    geocodeCache.set(cacheKey, null);
    return null;
  }
};

export const geocodeMultipleAddresses = async (addresses) => {
  const results = [];
  
  for (let i = 0; i < addresses.length; i++) {
    const address = addresses[i];
    const result = await geocodeAddress(address);
    results.push({ address, result });
    
  }
  
  return results;
};

export const extractAddressComponent = (addressComponents, type) => {
  const component = addressComponents?.find(comp => comp.types.includes(type));
  return component ? component.long_name : null;
};

export const parseAddressComponents = (addressComponents) => {
  if (!addressComponents) return {};
  
  return {
    streetNumber: extractAddressComponent(addressComponents, 'street_number'),
    route: extractAddressComponent(addressComponents, 'route'),
    locality: extractAddressComponent(addressComponents, 'locality'),
    administrativeAreaLevel1: extractAddressComponent(addressComponents, 'administrative_area_level_1'),
    administrativeAreaLevel2: extractAddressComponent(addressComponents, 'administrative_area_level_2'),
    country: extractAddressComponent(addressComponents, 'country'),
    postalCode: extractAddressComponent(addressComponents, 'postal_code')
  };
};
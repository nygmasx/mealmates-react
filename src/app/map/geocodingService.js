const GEOCODING_API_KEY = import.meta.env.VITE_GEOCODING_API_KEY;
const GEOCODING_BASE_URL = 'https://geocode.maps.co/search';

const geocodeCache = new Map();

export const geocodeAddress = async (address) => {
  if (!address || typeof address !== 'string') {
    return null;
  }

  if (!GEOCODING_API_KEY) {
    console.error('Clé API de géocodage manquante. Vérifiez votre fichier .env');
    return null;
  }

  const cacheKey = address.toLowerCase().trim();
  if (geocodeCache.has(cacheKey)) {
    return geocodeCache.get(cacheKey);
  }

  try {
    const encodedAddress = encodeURIComponent(address);
    const url = `${GEOCODING_BASE_URL}?q=${encodedAddress}&api_key=${GEOCODING_API_KEY}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data && data.length > 0) {
      const result = {
        latitude: parseFloat(data[0].lat),
        longitude: parseFloat(data[0].lon),
        displayName: data[0].display_name,
        originalAddress: address
      };
      
      geocodeCache.set(cacheKey, result);
      return result;
    } else {
      geocodeCache.set(cacheKey, null);
      return null;
    }
    
  } catch (error) {
    console.error('Erreur de géocodage:', error);
    geocodeCache.set(cacheKey, null);
    return null;
  }
};

export const geocodeMultipleAddresses = async (addresses, delay = 1100) => {
  const results = [];
  
  for (let i = 0; i < addresses.length; i++) {
    const address = addresses[i];
    const result = await geocodeAddress(address);
    results.push({ address, result });
    
    if (i < addresses.length - 1) {
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  return results;
};
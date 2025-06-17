import { Marker, Popup, useMap } from "react-leaflet";
import { createProductLocationIcon } from "./CustomMarker.jsx";

const ProductLocationMarker = ({ productData }) => {
  const map = useMap();

  const product = productData["0"];
  const latitude = productData.latitude;
  const longitude = productData.longitude;

  if (!latitude || !longitude || !product) {
    console.warn("Produit sans coordonnées ou données manquantes:", productData);
    return null;
  }

  const position = [parseFloat(latitude), parseFloat(longitude)];

  const handleMarkerClick = () => {
    const mapContainer = map.getContainer();
    const mapHeight = mapContainer.offsetHeight;
    
    const offsetY = mapHeight * 0.4;
    
    const targetPoint = map.project(position, map.getZoom()).subtract([0, offsetY]);
    const targetLatLng = map.unproject(targetPoint, map.getZoom());
    
    map.flyTo(targetLatLng, 15, {
      duration: 1
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Date non spécifiée';
    try {
      return new Date(dateString).toLocaleDateString('fr-FR');
    } catch {
      return 'Date invalide';
    }
  };

  const getProductType = (type) => {
    const types = {
      'vegetables': 'Légumes',
      'fruits': 'Fruits', 
      'prepared_meal': 'Plat préparé',
      'dairy_product': 'Produit laitier',
      'cake': 'Gâteau',
      'food': 'Alimentation',
      'other': 'Autre'
    };
    return types[type] || type || 'Non spécifié';
  };

  const getAvailabilities = (availabilities) => {
    if (!availabilities || !Array.isArray(availabilities)) return 'Non spécifiées';
    
    const enabledDays = availabilities
      .filter(av => av.isEnabled)
      .map(av => `${av.day} ${av.startTime}-${av.endTime}`);
    
    return enabledDays.length > 0 ? enabledDays : ['Aucune disponibilité'];
  };

  return (
    <Marker 
      position={position} 
      icon={createProductLocationIcon()}
      eventHandlers={{
        click: handleMarkerClick
      }}
    >
      <Popup maxWidth={300} minWidth={250}>
        <div className="min-w-[250px] p-3">
          <h3 className="font-bold text-lg mb-2 text-gray-800">
            {product.title || 'Titre manquant'}
          </h3>
          
          <div className="flex justify-between items-center mb-2">
            <div className="text-sm text-gray-600">
              <span className="font-medium">Type:</span> {getProductType(product.type)}
            </div>
            {product.quantity && (
              <div className="text-sm text-gray-600">
                <span className="font-medium">Qté:</span> {product.quantity}
              </div>
            )}
          </div>
          
          <div className="flex justify-between items-center mb-2">
            <span className="font-bold text-green-600 text-lg">
              {product.price > 0 ? `${product.price}€` : 'Gratuit'}
            </span>
            {product.isRecurring && (
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                Récurrent
              </span>
            )}
          </div>
          
          <div className="text-xs text-gray-500 mb-3">
            <span className="font-medium">Expire le:</span> {formatDate(product.expiresAt)}
          </div>

          {product.pickingAddress && (
            <div className="text-xs text-gray-600 mb-2">
              <span className="font-medium">📍 Adresse:</span> {product.pickingAddress}
            </div>
          )}

          {product.availabilities && product.availabilities.length > 0 && (
            <div className="mb-3">
              <div className="text-xs font-medium text-gray-700 mb-1">
                Disponibilités:
              </div>
              <div className="text-xs text-gray-600 max-h-20 overflow-y-auto">
                {getAvailabilities(product.availabilities).slice(0, 3).map((availability, index) => (
                  <div key={index} className="truncate">
                    {availability}
                  </div>
                ))}
                {getAvailabilities(product.availabilities).length > 3 && (
                  <div className="text-gray-500">
                    +{getAvailabilities(product.availabilities).length - 3} autres...
                  </div>
                )}
              </div>
            </div>
          )}
          
          {product.dietaryPreferences && product.dietaryPreferences.length > 0 && (
            <div className="mb-3">
              <div className="text-xs font-medium text-gray-700 mb-1">
                Régimes compatibles:
              </div>
              <div className="flex flex-wrap gap-1">
                {product.dietaryPreferences.slice(0, 3).map((pref) => (
                  <span 
                    key={pref.id} 
                    className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs"
                  >
                    {pref.name}
                  </span>
                ))}
                {product.dietaryPreferences.length > 3 && (
                  <span className="text-gray-500 text-xs">
                    +{product.dietaryPreferences.length - 3} autres
                  </span>
                )}
              </div>
            </div>
          )}

          {product.images && product.images.length > 0 && (
            <div className="text-xs text-gray-500 mt-2 pt-2 border-t border-gray-200">
              📸 {product.images.length} photo{product.images.length > 1 ? 's' : ''} disponible{product.images.length > 1 ? 's' : ''}
            </div>
          )}
        </div>
      </Popup>
    </Marker>
  );
};

export default ProductLocationMarker;

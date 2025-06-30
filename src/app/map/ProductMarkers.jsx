import {Marker, Popup, useMap} from "react-leaflet";
import {createProductLocationIcon} from "./CustomMarker.jsx";
import {Button} from "@/components/ui/button.jsx";
import {FaShoppingCart} from "react-icons/fa";
import React, {useState} from "react";
import axiosConfig from "@/context/axiosConfig.js";
import {useNavigate} from 'react-router';
import {FaMessage} from "react-icons/fa6";
import {useAuth} from "@/context/AuthContext.jsx";

const ProductLocationMarker = ({productData}) => {
    const map = useMap();
    const navigate = useNavigate();
    const { user } = useAuth();

    const product = productData;
    const latitude = productData.latitude;
    const longitude = productData.longitude;

    const [isLoading, setIsLoading] = useState(false);

    if (!latitude || !longitude || !product) {
        console.warn("Produit sans coordonnées ou données manquantes:", productData);
        return null;
    }

    const position = [parseFloat(latitude), parseFloat(longitude)];

    const isOwner = user && product.user && product.user.id === user.id;

    const handleMarkerClick = () => {
        const mapHeight = map.getContainer().offsetHeight;
        const zoom = Math.max(map.getZoom(), 15);
        const offsetY = mapHeight * 0.15;

        const offsetPosition = map.unproject(
            map.project(position, zoom).add([0, -offsetY]),
            zoom
        );

        map.flyTo(offsetPosition, zoom, {duration: 1.2, easeLinearity: 0.15});
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

    const handlePurchase = async () => {
        setIsLoading(true);
        try {
            if (!product.id) {
                throw new Error('Product ID is missing');
            }

            const bookingData = {
                product_id: product.id
            };

            const response = await axiosConfig.post('/bookings', bookingData);

            if (response.status === 201) {
                const booking = response.data;

                alert(`Réservation créée avec succès pour "${product.title || product.name}"!\n` +
                    `ID de réservation: ${booking.id}\n` +
                    `Prix total: ${booking.total_price}€\n` +
                    `Status: En attente de confirmation du vendeur`);

                navigate('/messages');
            }
        } catch (error) {
            if (error.response) {
                const errorMessage = error.response.data?.message || 'Erreur lors de la réservation';
                console.error(`Erreur (${error.response.status}): ${errorMessage}`);
            } else {
                console.error(`Une erreur inattendue s'est produite: ${error.message}`);
            }
            console.error('Erreur lors de l\'achat:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleMessage = () => {
        if (!product.user.id) {
            console.error('Product seller ID is missing');
            return;
        }
        
        navigate('/messages/contact', { 
            state: { 
                product: product,
                seller: product.user
            } 
        });
    };

    return (
        <Marker
            position={position}
            icon={createProductLocationIcon()}
            eventHandlers={{
                click: handleMarkerClick
            }}
        >
            <Popup maxWidth={300} minWidth={250} autoPan={false}>
                <div className="min-w-[250px] p-3">
                    <h3 className="font-bold text-lg mb-2 text-gray-800">
                        {product.title || 'Titre manquant'}
                    </h3>

                    {isOwner && (
                        <div className="mb-2">
                            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                                Votre annonce
                            </span>
                        </div>
                    )}

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
                
                {!isOwner && (
                    <div className="space-y-2">
                        <button
                            onClick={handlePurchase}
                            disabled={isLoading}
                            className="flex-1 py-3 w-full bg-button-green text-white font-medium rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center disabled:opacity-50"
                        >
                            {isLoading ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                            ) : (
                                <>
                                    <FaShoppingCart className="mr-2"/>
                                    Réserver
                                </>
                            )}
                        </button>

                        <button
                            onClick={handleMessage}
                            disabled={isLoading}
                            className="flex-1 py-3 w-full bg-google-blue text-white font-medium rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center disabled:opacity-50"
                        >
                            {isLoading ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                            ) : (
                                <>
                                    <FaMessage className="mr-2"/>
                                    Contacter
                                </>
                            )}
                        </button>
                    </div>
                )}
            </Popup>
        </Marker>
    );
};

export default ProductLocationMarker;

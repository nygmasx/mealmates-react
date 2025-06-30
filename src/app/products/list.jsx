import React, { useEffect, useState } from 'react';
import axiosConfig from "@/context/axiosConfig.js";
import { FaRegClock, FaMapMarkerAlt, FaUser, FaPhone, FaShoppingCart } from "react-icons/fa";
import { FiSearch, FiArrowLeft, FiMessageCircle } from "react-icons/fi";
import { Input } from "@/components/ui/input";
import { useNavigate } from 'react-router';
import Layout from '../Layout';
import { showToast } from "@/utils/toast.js";

const ProductModal = ({ product, isOpen, onClose, onPurchase }) => {
    const navigate = useNavigate();
    const [quantity, setQuantity] = useState(1);
    const [isLoading, setPurchaseLoading] = useState(false);

    const formatPrice = (price) => {
        if (!price && price !== 0) return '0.00';
        if (typeof price === 'string') {
            return parseFloat(price).toFixed(2);
        }
        return price.toFixed(2);
    };

    const getExpirationText = (expirationDate) => {
        if (!expirationDate) return null;

        const today = new Date();
        const expDate = new Date(expirationDate);
        const diffTime = expDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return "aujourd'hui";
        if (diffDays === 1) return "demain";
        if (diffDays > 1) return `dans ${diffDays} jours`;
        return "expiré";
    };

    const getImageUrl = (product) => {
        if (product.images && product.images.length > 0) {
            return `https://apimates.testingtest.fr/${product.images[0]}`;
        }
        const productName = product.title || product.name || 'Produit';
        return `https://placehold.co/600x400/e2e8f0/ffffff?text=${encodeURIComponent(productName.split(' ')[0])}`;
    };

    const handlePurchase = async () => {
        setPurchaseLoading(true);
        try {
            await onPurchase(product, quantity);
            onClose();
        } catch (error) {
            console.error('Erreur lors de l\'achat:', error);
        } finally {
            setPurchaseLoading(false);
        }
    };

    const handleContactSeller = () => {
        if (product?.seller) {
            navigate('/messages/contact', {
                state: {
                    product: product,
                    seller: product.seller
                }
            });
        }
    };

    if (!product) return null;

    const totalPrice = (parseFloat(product.price || 0) * quantity).toFixed(2);
    const isFree = product.isDonation || product.price === '0' || product.price === 0;

    if (!isOpen || !product) return null;

    return (
        <div className="fixed inset-0 bg-opacity-50 z-[999] flex items-end">
            <div className="bg-gray-100 w-full max-h-[90vh] rounded-t-2xl overflow-y-auto">
                <div className="sticky top-0 bg-[#53b1753d] p-4 flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Détails du produit</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full"
                    >
                        <IoMdClose className="h-6 w-6" />
                    </button>
                </div>

                <div className="bg-[#53b1753d] p-4">
                    <div className="relative mb-4">
                        <img
                            src={getImageUrl(product)}
                            alt={product.title || product.name}
                            className="w-full h-64 object-cover rounded-xl"
                            onError={(e) => {
                                e.target.src = `https://placehold.co/600x400/e2e8f0/ffffff?text=${encodeURIComponent((product.title || product.name || 'Produit').split(' ')[0])}`;
                            }}
                        />
                        {product.discount && (
                            <div className="absolute top-3 left-3 bg-red-500 text-white text-sm px-3 py-1 rounded-lg">
                                -{product.discount}%
                            </div>
                        )}
                    </div>

                    <div className="">
                        <h3 className="text-2xl font-bold mb-2">{product.title || product.name}</h3>
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex flex-col">
                                <span className="text-2xl font-bold text-button-green">
                                    {isFree ? 'Gratuit' : `${formatPrice(product.price)}€`}
                                </span>
                                {product.originalPrice && (
                                    <span className="text-lg text-gray-400 line-through">
                                        {formatPrice(product.originalPrice)}€
                                    </span>
                                )}
                            </div>
                            {!isFree && (
                                <div className="flex flex-col items-end ml-4">
                                    <span className="text-sm text-gray-600">
                                        <span className="font-medium">Qté:</span> {product.quantity}
                                    </span>
                                </div>
                            )}
                        </div>
                        {product.expirationDate && (
                            <div className="flex items-center mb-3 text-gray-600">
                                <FaRegClock className="mr-2" size={14} />
                                <span>Expire {getExpirationText(product.expirationDate)}</span>
                            </div>
                        )}

                        {product.description && (
                            <div className="mb-4">
                                <h4 className="font-semibold mb-2">Description</h4>
                                <p className="text-gray-700">{product.description}</p>
                            </div>
                        )}

                        {product.dietaryTags && product.dietaryTags.length > 0 && (
                            <div className="mb-4">
                                <h4 className="font-semibold mb-2">Préférences alimentaires</h4>
                                <div className="flex flex-wrap gap-2">
                                    {product.dietaryTags.map((tag, index) => (
                                        <span
                                            key={index}
                                            className="px-3 py-1 bg-green-100 text-button-green text-sm rounded-full"
                                        >
                                            {tag.name || tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {product.seller && (
                            <div className="border-t pt-4 mb-4">
                                <h4 className="font-semibold mb-2">Vendeur</h4>
                                <div className="flex items-center mb-2">
                                    <FaUser className="mr-2 text-gray-500" />
                                    <span>{product.seller.name || product.seller.username}</span>
                                </div>
                                {product.seller.phone && (
                                    <div className="flex items-center">
                                        <FaPhone className="mr-2 text-gray-500" />
                                        <span>{product.seller.phone}</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="sticky bottom-0 bg-[#53b1753d] p-4">
                    <div className="flex gap-2">
                        <button
                            onClick={onClose}
                            className="flex-1 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Annuler
                        </button>
                        {product.seller && (
                            <button
                                onClick={handleContactSeller}
                                className="flex-1 py-3 border border-[#53B175] text-[#53B175] font-medium rounded-lg hover:bg-[#53B175]/5 transition-colors flex items-center justify-center"
                            >
                                <FiMessageCircle className="mr-2" />
                                Contacter
                            </button>
                        )}
                        <button
                            onClick={handlePurchase}
                            disabled={isLoading}
                            className="flex-1 py-3 bg-button-green text-white font-medium rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center disabled:opacity-50"
                        >
                            {isLoading ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                            ) : (
                                <>
                                    <FaShoppingCart className="mr-2" />
                                    Réserver
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ProductGridCard = ({ product, onClick }) => {
    const formatPrice = (price) => {
        if (!price && price !== 0) return '0.00';
        if (typeof price === 'string') {
            return parseFloat(price).toFixed(2);
        }
        return price.toFixed(2);
    };

    const getExpirationText = (expirationDate) => {
        if (!expirationDate) return null;

        const today = new Date();
        const expDate = new Date(expirationDate);
        const diffTime = expDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return "aujourd'hui";
        if (diffDays === 1) return "demain";
        if (diffDays > 1) return `dans ${diffDays} jours`;
        return "expiré";
    };

    const getImageUrl = (product) => {
        if (product.images && product.images.length > 0) {
            return `https://apimates.testingtest.fr/${product.images[0]}`;
        }
        const productName = product.title || product.name || 'Produit';
        return `https://placehold.co/400x200/e2e8f0/ffffff?text=${encodeURIComponent(productName.split(' ')[0])}`;
    };

    return (
        <div
            className="bg-white md:w-72 rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => onClick(product)}
        >
            <div className="relative">
                <img
                    src={getImageUrl(product)}
                    alt={product.title || product.name}
                    className="w-full h-40 object-contain"
                    onError={(e) => {
                        e.target.src = `https://placehold.co/400x200/e2e8f0/ffffff?text=${encodeURIComponent((product.title || product.name || 'Produit').split(' ')[0])}`;
                    }}
                />
                {product.discount && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-md">
                        -{product.discount}%
                    </div>
                )}
            </div>

            <div className="p-3">
                <h3 className="font-semibold text-gray-900 mb-1 truncate">{product.title || product.name}</h3>

                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                        <span className="text-lg font-bold text-button-green">
                            {product.isDonation || product.price === '0' || product.price === 0
                                ? 'Gratuit'
                                : `${formatPrice(product.price)}€`}
                        </span>
                        {product.originalPrice && (
                            <span className="text-sm text-gray-400 line-through ml-2">
                                {formatPrice(product.originalPrice)}€
                            </span>
                        )}
                    </div>
                    {product.distance && (
                        <div className="flex items-center text-gray-500">
                            <FaMapMarkerAlt className="mr-1" size={10} />
                            <span className="text-xs">{product.distance}km</span>
                        </div>
                    )}
                </div>

                {product.expirationDate && (
                    <div className="flex items-center text-gray-500">
                        <FaRegClock className="mr-1" size={10} />
                        <span className="text-xs">Expire {getExpirationText(product.expirationDate)}</span>
                    </div>
                )}

                {product.description && (
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">{product.description}</p>
                )}
            </div>
        </div>
    );
};

function OffersList() {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [sortBy, setSortBy] = useState('recent');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setIsLoading(true);
                setError(null);

                const response = await axiosConfig.get('/product/');

                let productsArray = [];
                if (Array.isArray(response.data)) {
                    productsArray = response.data;
                } else if (response.data && typeof response.data === 'object') {
                    if (response.data.products) {
                        productsArray = response.data.products;
                    } else if (response.data.data) {
                        productsArray = response.data.data;
                    } else {
                        productsArray = [response.data];
                    }
                }

                setProducts(productsArray);
                setFilteredProducts(productsArray);

            } catch (error) {
                console.error("Erreur lors de la récupération des produits:", error);
                setError("Impossible de charger les produits");
                setProducts([]);
                setFilteredProducts([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, []);

    useEffect(() => {
        let filtered = [...products];

        if (searchTerm) {
            filtered = filtered.filter(product =>
                (product.title && product.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (product.name && product.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'price-low':
                    return parseFloat(a.price || 0) - parseFloat(b.price || 0);
                case 'price-high':
                    return parseFloat(b.price || 0) - parseFloat(a.price || 0);
                case 'expiration':
                    if (!a.expirationDate && !b.expirationDate) return 0;
                    if (!a.expirationDate) return 1;
                    if (!b.expirationDate) return -1;
                    return new Date(a.expirationDate) - new Date(b.expirationDate);
                case 'recent':
                default:
                    return new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0);
            }
        });

        setFilteredProducts(filtered);
    }, [products, searchTerm, sortBy]);

    const handleProductClick = (product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedProduct(null);
    };

    const handlePurchase = async (product, quantity) => {
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

                showToast.success(`Réservation créée avec succès pour "${product.title || product.name}"!\nID de réservation: ${booking.id}\nPrix total: ${booking.total_price}€\nStatus: En attente de confirmation du vendeur`);

                // Navigate with booking state to trigger auto-selection
                navigate('/messages', {
                    state: {
                        productId: product.id,
                        fromBooking: true
                    }
                });
            }
        } catch (error) {

            if (error.response) {
                const errorMessage = error.response.data?.message || 'Erreur lors de la réservation';
                showToast.error(`Erreur (${error.response.status}): ${errorMessage}`);
            } else {
                showToast.error(`Une erreur inattendue s'est produite: ${error.message}`);
            }

            throw error;
        }
    };

    const handleClearSearch = () => {
        setSearchTerm('');
    };

    if (isLoading) {
        return (
            <Layout>
                <div className="flex flex-col h-screen">
                    <div className="flex-grow p-4 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-button-green"></div>
                    </div>
                </div>
            </Layout>
        );
    }

    if (error) {
        return (
            <Layout>
                <div className="flex flex-col h-screen">
                    <div className="flex-grow p-4 flex items-center justify-center">
                        <div className="text-center">
                            <p className="text-red-500 mb-4">{error}</p>
                            <button
                                onClick={() => window.location.reload()}
                                className="bg-button-green text-white px-4 py-2 rounded"
                            >
                                Réessayer
                            </button>
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="flex flex-col h-full">
                <div className="flex-grow overflow-y-auto">
                    <div className="sticky top-0 bg-white border-b border-gray-500 z-10 p-4">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center">
                                <button
                                    onClick={() => window.history.back()}
                                    className="mr-3 p-2 hover:bg-gray-100 rounded-full"
                                >
                                    <FiArrowLeft size={20} />
                                </button>
                                <h1 className="text-xl font-bold">Tous les produits</h1>
                            </div>
                            <span className="text-sm text-gray-500">
                                {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''}
                            </span>
                        </div>

                        <div className="relative mb-4">
                            <div className="flex items-center bg-gray-100 rounded-xl">
                                <FiSearch className="ml-4 text-gray-500" size={20} />
                                <Input
                                    type="text"
                                    placeholder="Rechercher un produit..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="border-0 bg-transparent px-2 py-3 focus:ring-0 focus:outline-none w-full"
                                />
                                {searchTerm && (
                                    <button
                                        type="button"
                                        onClick={handleClearSearch}
                                        className="mr-4 p-1.5 bg-gray-200 rounded-full"
                                    >
                                        <IoMdClose className="text-gray-500" size={16} />
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-2 overflow-x-auto pb-2">
                            <button
                                onClick={() => setSortBy('recent')}
                                className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
                                    sortBy === 'recent'
                                        ? 'bg-button-green text-white'
                                        : 'bg-gray-100 text-gray-700'
                                }`}
                            >
                                Récents
                            </button>
                            <button
                                onClick={() => setSortBy('price-low')}
                                className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
                                    sortBy === 'price-low'
                                        ? 'bg-button-green text-white'
                                        : 'bg-gray-100 text-gray-700'
                                }`}
                            >
                                Prix croissant
                            </button>
                            <button
                                onClick={() => setSortBy('price-high')}
                                className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
                                    sortBy === 'price-high'
                                        ? 'bg-button-green text-white'
                                        : 'bg-gray-100 text-gray-700'
                                }`}
                            >
                                Prix décroissant
                            </button>
                            <button
                                onClick={() => setSortBy('expiration')}
                                className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
                                    sortBy === 'expiration'
                                        ? 'bg-button-green text-white'
                                        : 'bg-gray-100 text-gray-700'
                                }`}
                            >
                                Expiration
                            </button>
                        </div>
                    </div>

                    <div className="p-4">
                        {filteredProducts.length > 0 ? (
                            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                                {filteredProducts.map((product, index) => (
                                    <ProductGridCard
                                        key={product.id || index}
                                        product={product}
                                        onClick={handleProductClick}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-gray-500 mb-2">
                                    {searchTerm ? 'Aucun produit trouvé pour votre recherche' : 'Aucun produit disponible'}
                                </p>
                                {searchTerm && (
                                    <button
                                        onClick={handleClearSearch}
                                        className="text-button-green text-sm"
                                    >
                                        Effacer la recherche
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <ProductModal
                product={selectedProduct}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onPurchase={handlePurchase}
            />
        </Layout>
    );
}

export default OffersList;

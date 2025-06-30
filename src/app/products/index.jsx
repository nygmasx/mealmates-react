import React, { useState, useEffect } from 'react';
import { useAuth } from "@/context/AuthContext.jsx";
import axiosConfig from "@/context/axiosConfig.js";
import { FaRegClock, FaMapMarkerAlt, FaUser, FaPhone, FaShoppingCart } from "react-icons/fa";
import { IoLeafOutline } from "react-icons/io5";
import { IoMdHeart } from "react-icons/io";
import { RiArrowRightSLine } from "react-icons/ri";
import { FiSearch, FiFilter, FiMessageCircle } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";
import { Input } from "@/components/ui/input";
import Layout from '../Layout';
import { useNavigate } from 'react-router';
import {showToast} from "@/utils/toast.js";

const ProductModal = ({ product, isOpen, onClose, onPurchase }) => {
    const navigate = useNavigate();
    const [quantity, setQuantity] = useState(1);
    const [isLoading, setPurchaseLoading] = useState(false);

    const formatPrice = (price) => {
        if (!price && price !== 0) return '0.00';
        if (typeof price === 'string') {
            return parseFloat(price);
        }
        return price;
    };

    const getExpirationText = (expiresAt) => {
        if (!expiresAt) return null;

        const today = new Date();
        const expDate = new Date(expiresAt);
        const diffTime = expDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return "aujourd'hui";
        if (diffDays === 1) return "demain";
        if (diffDays > 1) return `dans ${diffDays} jours`;
        if (diffDays < 0) return "expiré";
        return "expiré";
    };

    const getImageUrl = (product) => {
        if (product.images && product.images.length > 0) {
            return `https://apimates.testingtest.fr/${product.images[0]}`;
        }
        const productName = product.title || 'Produit';
        return `https://placehold.co/600x400/e2e8f0/ffffff?text=${encodeURIComponent(productName.split(' ')[0])}`;
    };

    const handlePurchase = async () => {
        try {
            setPurchaseLoading(true);
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
        } finally {
            setPurchaseLoading(false);
        }
    };

    const handleContactSeller = () => {
        navigate('/messages');
    };

    if (!isOpen || !product) return null;

    const isFree = product.price === 0 || product.price === '0';

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
                            alt={product.title}
                            className="w-full h-64 object-cover rounded-xl"
                            onError={(e) => {
                                e.target.src = `https://placehold.co/600x400/e2e8f0/ffffff?text=${encodeURIComponent((product.title || 'Produit').split(' ')[0])}`;
                            }}
                        />
                        {product.discount && (
                            <div className="absolute top-3 left-3 bg-red-500 text-white text-sm px-3 py-1 rounded-lg">
                                -{product.discount}%
                            </div>
                        )}
                    </div>

                    <div className="">
                        <h3 className="text-2xl font-bold mb-2">{product.title}</h3>
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
                        {product.expiresAt && (
                            <div className="flex items-center mb-3 text-gray-600">
                                <FaRegClock className="mr-2" size={14} />
                                <span>Expire {getExpirationText(product.expiresAt)}</span>
                            </div>
                        )}

                        {product.description && (
                            <div className="mb-4">
                                <h4 className="font-semibold mb-2">Description</h4>
                                <p className="text-gray-700">{product.description}</p>
                            </div>
                        )}

                        {product.dietaryPreferences && product.dietaryPreferences.length > 0 && (
                            <div className="mb-4">
                                <h4 className="font-semibold mb-2">Préférences alimentaires</h4>
                                <div className="flex flex-wrap gap-2">
                                    {product.dietaryPreferences.map((pref, index) => (
                                        <span
                                            key={index}
                                            className="px-3 py-1 bg-green-100 text-button-green text-sm rounded-full"
                                        >
                                            {pref.name || pref}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {product.user && (
                            <div className="border-t pt-4 mb-4">
                                <h4 className="font-semibold mb-2">Vendeur</h4>
                                <div className="flex items-center mb-2">
                                    <FaUser className="mr-2 text-gray-500" />
                                    <span>{product.user.name || product.user.username}</span>
                                </div>
                                {product.user.phone && (
                                    <div className="flex items-center">
                                        <FaPhone className="mr-2 text-gray-500" />
                                        <span>{product.user.phone}</span>
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
                        {product.user && (
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

const ProductCard = ({ product, onClick }) => {
    const formatPrice = (price) => {
        if (typeof price === 'string') {
            return parseFloat(price);
        }
        return price;
    };

    const getExpirationText = (expiresAt) => {
        if (!expiresAt) return null;

        const today = new Date();
        const expDate = new Date(expiresAt);
        const diffTime = expDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return "aujourd'hui";
        if (diffDays === 1) return "demain";
        if (diffDays > 1) return `dans ${diffDays} jours`;
        if (diffDays < 0) return "expiré";
        return "expiré";
    };

    const getImageUrl = (product) => {
        if (product.images && product.images.length > 0) {
            return `https://apimates.testingtest.fr/${product.images[0]}`;
        }
        const productName = product.title || 'Produit';
        return `https://placehold.co/400x200/e2e8f0/ffffff?text=${encodeURIComponent(productName.split(' ')[0])}`;
    };

    return (
        <div
            className="min-w-[150px] max-w-[170px] flex-shrink-0 shadow-md rounded-xl overflow-hidden bg-white cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => onClick(product)}
        >
            <div className="relative">
                <img
                    src={getImageUrl(product)}
                    alt={product.title}
                    className="w-full h-28 object-cover"
                    onError={(e) => {
                        e.target.src = `https://placehold.co/400x200/e2e8f0/ffffff?text=${encodeURIComponent((product.title || 'Produit').split(' ')[0])}`;
                    }}
                />
                {product.discount && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-md">
                        -{product.discount}%
                    </div>
                )}
            </div>
            <div className="p-2.5">
                <p className="text-sm font-medium truncate">{product.title}</p>
                <div className="flex justify-between items-center mt-1">
                    <div className="flex items-center">
                        <span className="text-sm font-semibold text-button-green">
                            {product.price === 0 || product.price === '0'
                                ? 'Gratuit'
                                : `${formatPrice(product.price)}€`}
                        </span>
                        {product.originalPrice && (
                            <span className="text-xs text-gray-400 line-through ml-1">
                                {formatPrice(product.originalPrice)}€
                            </span>
                        )}
                    </div>
                    <div className="text-xs text-gray-500 flex items-center">
                        {product.distance && (
                            <>
                                <FaMapMarkerAlt className="mr-1" size={10} />
                                <span>{product.distance}km</span>
                            </>
                        )}
                    </div>
                </div>
                {product.expiresAt && (
                    <div className="flex items-center mt-1 text-xs text-gray-500">
                        <FaRegClock className="mr-1" size={10} />
                        <span>Expire {getExpirationText(product.expiresAt)}</span>
                    </div>
                )}
                {product.quantity && (
                    <div className="text-xs text-gray-500 mt-1">
                        Quantité: {product.quantity}
                    </div>
                )}
            </div>
        </div>
    );
};

const ProductSection = ({ title, subtitle, seeAllLink, products, icon, onProductClick }) => {
    if (!products || products.length === 0) return null;

    return (
        <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
                <div>
                    <div className="flex items-center">
                        {icon}
                        <h2 className="text-lg font-semibold">{title}</h2>
                    </div>
                    {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
                </div>
                <a href={seeAllLink} className="text-button-green flex items-center text-sm">
                    Voir tout <RiArrowRightSLine size={18} />
                </a>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {products.map((product, index) => (
                    <ProductCard key={product.id || index} product={product} onClick={onProductClick} />
                ))}
            </div>
        </div>
    );
};

const SearchBar = ({ onSearch, onFilter }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        onSearch(searchTerm);
    };

    const handleClear = () => {
        setSearchTerm('');
        onSearch('');
    };

    return (
        <div className="relative w-full mb-4">
            <form onSubmit={handleSearch} className="relative">
                <div className="flex items-center bg-gray-100 rounded-xl">
                    <FiSearch className="ml-4 text-gray-500" size={20} />
                    <Input
                        type="text"
                        placeholder="Rechercher un repas..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="border-0 bg-transparent px-2 py-3 focus:ring-0 focus:outline-none w-full"
                    />
                    {searchTerm && (
                        <button
                            type="button"
                            onClick={handleClear}
                            className="mr-2 p-1.5 bg-gray-200 rounded-full"
                        >
                            <IoMdClose className="text-gray-500" size={16} />
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={onFilter}
                        className="p-3 bg-button-green text-white rounded-r-xl flex items-center justify-center"
                    >
                        <FiFilter size={20} />
                    </button>
                </div>
            </form>
        </div>
    );
};

const FilterPanel = ({ isOpen, onClose, onApply }) => {
    const [selectedType, setSelectedType] = useState('');
    const [priceRange, setPriceRange] = useState(20);
    const [expirationDate, setExpirationDate] = useState('');
    const [selectedPreferences, setSelectedPreferences] = useState([]);

    const types = {
        food: 'Alimentation',
        beverage: 'Boisson',
        bakery: 'Boulangerie',
        dairy: 'Produits laitiers',
        other: 'Autre',
    };

    const dietaryPreferences = [
        { id: 1, name: 'Végétarien' },
        { id: 2, name: 'Végétalien' },
        { id: 3, name: 'Sans gluten' },
        { id: 4, name: 'Sans lactose' },
        { id: 5, name: 'Halal' },
        { id: 6, name: 'Kasher' }
    ];

    const handleTypeChange = (type) => {
        setSelectedType(type === selectedType ? '' : type);
    };

    const handlePreferenceToggle = (prefId) => {
        setSelectedPreferences(prev =>
            prev.includes(prefId)
                ? prev.filter(id => id !== prefId)
                : [...prev, prefId]
        );
    };

    const handleApply = () => {
        onApply({
            type: selectedType,
            maxPrice: priceRange,
            expirationDate,
            dietaryPreferences: selectedPreferences
        });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-white z-[950] overflow-y-auto">
            <div className="p-4 pb-24">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">Filtres</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full"
                    >
                        <IoMdClose className="h-6 w-6" />
                    </button>
                </div>

                <div className="mb-6">
                    <h3 className="text-lg font-medium mb-3">Type de produit</h3>
                    <div className="grid grid-cols-2 gap-3">
                        {Object.entries(types).map(([key, value]) => (
                            <button
                                key={key}
                                className={`
                                    border rounded-lg p-3 text-left transition-colors
                                    ${selectedType === key ? 'bg-green-100 border-button-green' : 'border-gray-300'}
                                `}
                                onClick={() => handleTypeChange(key)}
                            >
                            <span className={selectedType === key ? 'text-button-green' : 'text-gray-700'}>
                            {value}
                            </span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mb-6">
                    <h3 className="text-lg font-medium mb-3">Date d'expiration maximale</h3>
                    <input
                        type="date"
                        min={new Date().toISOString().split('T')[0]}
                        value={expirationDate}
                        onChange={(e) => setExpirationDate(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-button-green focus:border-button-green"
                    />
                </div>

                <div className="mb-6">
                    <h3 className="text-lg font-medium mb-3">Prix maximum: {priceRange}€</h3>
                    <input
                        type="range"
                        min="0"
                        max="50"
                        value={priceRange}
                        onChange={(e) => setPriceRange(e.target.value)}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-button-green"
                    />
                    <div className="flex justify-between text-sm text-gray-500 mt-1">
                        <span>0 €</span>
                        <span>50 €</span>
                    </div>
                </div>

                <div className="mb-8">
                    <h3 className="text-lg font-medium mb-3">Préférences alimentaires</h3>
                    <div className="grid grid-cols-2 gap-3">
                        {dietaryPreferences.map(pref => (
                            <button
                                key={pref.id}
                                className={`
                  border rounded-lg p-3 text-left transition-colors
                  ${selectedPreferences.includes(pref.id) ? 'bg-green-100 border-button-green' : 'border-gray-300'}
                `}
                                onClick={() => handlePreferenceToggle(pref.id)}
                            >
                <span className={selectedPreferences.includes(pref.id) ? 'text-button-green' : 'text-gray-700'}>
                  {pref.name}
                </span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="fixed bottom-0 left-0 right-0 z-[900] p-4 bg-white border-t border-gray-200">
                    <button
                        onClick={handleApply}
                        className="w-full py-3 bg-button-green text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
                    >
                        Appliquer les filtres
                    </button>
                </div>
            </div>
        </div>
    );
};

const Search = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [products, setProducts] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [error, setError] = useState(null);
    const [activeFilters, setActiveFilters] = useState({});
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

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

            } catch (error) {
                console.error("Erreur lors de la récupération des produits:", error);
                setError("Impossible de charger les produits");
                setProducts([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const getProductsByCategory = (category) => {
        if (!products || products.length === 0) return [];

        switch(category) {
            case 'lastChance':
                return products.filter(product => {
                    if (!product.expiresAt) return false;
                    const today = new Date();
                    const expDate = new Date(product.expiresAt);
                    const diffTime = expDate - today;
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    return diffDays <= 1 && diffDays >= 0;
                });

            case 'donations':
                return products.filter(product =>
                    product.price === 0 || product.price === '0'
                );

            case 'vegan':
                return products.filter(product => {
                    if (!product.dietaryPreferences || !Array.isArray(product.dietaryPreferences)) return false;
                    return product.dietaryPreferences.some(pref => {
                        const prefString = JSON.stringify(pref).toLowerCase();
                        return prefString.includes('végétalien') ||
                               prefString.includes('vegan') ||
                               prefString.includes('vegetalien');
                    });
                });

            case 'recent':
                return products
                    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
                    .slice(0, 5);

            default:
                return products.slice(0, 5);
        }
    };

    const handleSearch = (term) => {
        if (!term.trim()) {
            setSearchResults([]);
            return;
        }

        const results = products.filter(product =>
            (product.title && product.title.toLowerCase().includes(term.toLowerCase())) ||
            (product.description && product.description.toLowerCase().includes(term.toLowerCase()))
        );

        setSearchResults(results);
    };

    const handleApplyFilters = (filters) => {
        setActiveFilters(filters);

        let filteredProducts = [...products];

        if (filters.type) {
            filteredProducts = filteredProducts.filter(p => p.type === filters.type);
        }

        if (filters.maxPrice) {
            filteredProducts = filteredProducts.filter(p => {
                const price = parseFloat(p.price);
                return price <= filters.maxPrice;
            });
        }

        if (filters.expirationDate) {
            filteredProducts = filteredProducts.filter(p => {
                if (!p.expiresAt) return false;
                const expDate = new Date(p.expiresAt);
                const filterDate = new Date(filters.expirationDate);
                return expDate <= filterDate;
            });
        }

        if (filters.dietaryPreferences && filters.dietaryPreferences.length > 0) {
            filteredProducts = filteredProducts.filter(p => {
                if (!p.dietaryPreferences || !Array.isArray(p.dietaryPreferences)) return false;
                return p.dietaryPreferences.some(pref => {
                    if (pref.id) {
                        return filters.dietaryPreferences.includes(pref.id);
                    }
                    return filters.dietaryPreferences.some(filterId =>
                        JSON.stringify(pref).includes(filterId.toString())
                    );
                });
            });
        }

        setSearchResults(filteredProducts);
    };

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

                alert(`Réservation créée avec succès pour "${product.title}"!\n` +
                    `ID de réservation: ${booking.id}\n` +
                    `Prix total: ${booking.total_price}€\n` +
                    `Status: En attente de confirmation du vendeur`);

                handleCloseModal();

                // Navigate to messages with product info to auto-open the conversation
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
                alert(`Erreur (${error.response.status}): ${errorMessage}`);
            } else {
                alert(`Une erreur inattendue s'est produite: ${error.message}`);
            }

            throw error;
        }
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
                <div className="flex-grow p-4 bg-gray-50">
                    <h1 className="text-2xl font-bold mb-4">Explorer</h1>

                    <SearchBar
                        onSearch={handleSearch}
                        onFilter={() => setIsFilterOpen(true)}
                    />

                    <FilterPanel
                        isOpen={isFilterOpen}
                        onClose={() => setIsFilterOpen(false)}
                        onApply={handleApplyFilters}
                    />

                    {searchResults.length > 0 ? (
                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-3">
                                <h2 className="text-lg font-semibold">
                                    Résultats ({searchResults.length})
                                </h2>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                {searchResults.map((product, index) => (
                                    <ProductCard key={product.id || `search-${index}`} product={product} onClick={handleProductClick} />
                                ))}
                            </div>
                        </div>
                    ) : (
                        <>
                            <ProductSection
                                title="Dernière chance"
                                subtitle="Produits qui expirent bientôt"
                                seeAllLink="/offers/last-chance"
                                products={getProductsByCategory('lastChance')}
                                icon={<FaRegClock className="text-button-green mr-2" size={20} />}
                                onProductClick={handleProductClick}
                            />

                            <ProductSection
                                title="Dons gratuits"
                                subtitle="Produits offerts généreusement"
                                seeAllLink="/offers/donations"
                                products={getProductsByCategory('donations')}
                                icon={<IoMdHeart className="text-button-green mr-2" size={20} />}
                                onProductClick={handleProductClick}
                            />

                            <ProductSection
                                title="Options végétaliennes"
                                subtitle="Découvrez nos options 100% végétales"
                                seeAllLink="/offers/vegan"
                                products={getProductsByCategory('vegan')}
                                icon={<IoLeafOutline className="text-button-green mr-2" size={20} />}
                                onProductClick={handleProductClick}
                            />

                            <ProductSection
                                title="Récemment ajoutés"
                                subtitle="Les dernières offres près de chez vous"
                                seeAllLink="/offers/recent"
                                products={getProductsByCategory('recent')}
                                icon={<FaMapMarkerAlt className="text-button-green mr-2" size={20} />}
                                onProductClick={handleProductClick}
                            />

                            <ProductSection
                                title="Tous les produits"
                                subtitle="Découvrez toute notre sélection"
                                seeAllLink="/offers/all"
                                products={products.slice(0, 10)}
                                icon={<IoMdHeart className="text-button-green mr-2" size={20} />}
                                onProductClick={handleProductClick}
                            />
                        </>
                    )}

                    {products.length === 0 && !isLoading && (
                        <div className="text-center py-8">
                            <p className="text-gray-500">Aucun produit disponible pour le moment</p>
                        </div>
                    )}
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
};

export default Search;

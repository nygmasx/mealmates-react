import React, { useState, useEffect } from 'react';
import { useAuth } from "@/context/AuthContext.jsx";
import axiosConfig from "@/context/axiosConfig.js";
import Navbar from "@/components/Navbar.jsx";
import { FaRegClock } from "react-icons/fa";
import { IoLeafOutline } from "react-icons/io5";
import { FaMapMarkerAlt } from "react-icons/fa";
import { IoMdHeart } from "react-icons/io";
import { RiArrowRightSLine } from "react-icons/ri";
import { FiSearch, FiFilter } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";
import { Input } from "@/components/ui/input";

const ProductCard = ({ product }) => {
    return (
        <div className="min-w-[150px] max-w-[170px] flex-shrink-0 shadow-md rounded-xl overflow-hidden bg-white">
            <div className="relative">
                <img
                    src={`https://placehold.co/400x200/${product.color || 'e2e8f0'}/ffffff?text=${encodeURIComponent(product.name.split(' ')[0])}`}
                    alt={product.name}
                    className="w-full h-28 object-cover"
                />
                {product.discount && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-md">
                        -{product.discount}%
                    </div>
                )}
                <button className="absolute top-2 right-2 bg-white p-1.5 rounded-full shadow-md">
                    <IoMdHeart className={product.isFavorite ? "text-red-500" : "text-gray-300"} size={18} />
                </button>
            </div>
            <div className="p-2.5">
                <p className="text-sm font-medium truncate">{product.name}</p>
                <div className="flex justify-between items-center mt-1">
                    <div className="flex items-center">
                        <span className="text-sm font-semibold text-button-green">{product.price.toFixed(2)}€</span>
                        {product.originalPrice && (
                            <span className="text-xs text-gray-400 line-through ml-1">
                {product.originalPrice.toFixed(2)}€
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
                {product.expirationDate && (
                    <div className="flex items-center mt-1 text-xs text-gray-500">
                        <FaRegClock className="mr-1" size={10} />
                        <span>Expire {product.expirationDate}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

const ProductSection = ({ title, subtitle, seeAllLink, products, icon }) => {
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
                    <ProductCard key={index} product={product} />
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
        fruits: 'Fruits',
        vegetables: 'Légumes',
        prepared_meal: 'Plats préparés',
        dairy_product: 'Produits laitiers',
        baked_goods: 'Pâtisseries',
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
        <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
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

                <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
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
    const [isLoading, setIsLoading] = useState(true);
    const [recommendAgain, setRecommendAgain] = useState([]);
    const [lastChance, setLastChance] = useState([]);
    const [veganTonight, setVeganTonight] = useState([]);
    const [localTrends, setLocalTrends] = useState([]);
    const [customized, setCustomized] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [activeFilters, setActiveFilters] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const recommendResponse = await getMockProducts('recommend');
                setRecommendAgain(recommendResponse);

                const lastChanceResponse = await getMockProducts('lastChance');
                setLastChance(lastChanceResponse);

                const veganResponse = await getMockProducts('vegan');
                setVeganTonight(veganResponse);

                const trendsResponse = await getMockProducts('trends');
                setLocalTrends(trendsResponse);

                const customResponse = await getMockProducts('custom');
                setCustomized(customResponse);
            } catch (error) {
                console.error("Erreur lors de la récupération des données:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const getMockProducts = async (type) => {
        await new Promise(resolve => setTimeout(resolve, 300));

        const baseProducts = [
            {
                name: "Salade César",
                price: 3.99,
                originalPrice: 6.99,
                color: '4ade80',
                distance: 1.2,
                expirationDate: "aujourd'hui",
                discount: 40
            },
            {
                name: "Lasagnes à la bolognaise",
                price: 4.50,
                originalPrice: 7.99,
                color: 'ef4444',
                distance: 0.8,
                expirationDate: "demain",
                discount: 35
            },
            {
                name: "Quinoa Bowl aux légumes",
                price: 5.99,
                originalPrice: 8.99,
                color: 'd8b4fe',
                distance: 1.5,
                expirationDate: "dans 2 jours",
                discount: 30,
                isFavorite: true
            },
            {
                name: "Poulet rôti et pommes de terre",
                price: 6.50,
                originalPrice: 9.99,
                color: 'fcd34d',
                distance: 0.5,
                expirationDate: "aujourd'hui",
                discount: 35
            },
            {
                name: "Sushi Mix Box",
                price: 7.99,
                originalPrice: 12.99,
                color: '06b6d4',
                distance: 2.0,
                expirationDate: "aujourd'hui",
                discount: 40
            }
        ];

        switch(type) {
            case 'lastChance':
                return baseProducts.map(p => ({...p, expirationDate: "aujourd'hui"}));
            case 'vegan':
                return [
                    {
                        name: "Buddha Bowl Vegan",
                        price: 5.99,
                        originalPrice: 8.99,
                        color: '84cc16',
                        distance: 1.3,
                        expirationDate: "demain",
                        discount: 30
                    },
                    {
                        name: "Wraps aux légumes",
                        price: 4.50,
                        originalPrice: 6.99,
                        color: 'bef264',
                        distance: 0.7,
                        expirationDate: "aujourd'hui",
                        discount: 35
                    },
                    {
                        name: "Curry de légumes",
                        price: 6.50,
                        originalPrice: 9.99,
                        color: 'fde047',
                        distance: 1.1,
                        expirationDate: "dans 2 jours",
                        discount: 30,
                        isFavorite: true
                    },
                    {
                        name: "Salade vegan complète",
                        price: 4.99,
                        originalPrice: 7.99,
                        color: 'a3e635',
                        distance: 1.8,
                        expirationDate: "demain",
                        discount: 40
                    },
                    {
                        name: "Plat de falafels",
                        price: 5.50,
                        originalPrice: 8.50,
                        color: '65a30d',
                        distance: 0.9,
                        expirationDate: "aujourd'hui",
                        discount: 35
                    }
                ];
            case 'trends':
                return baseProducts.map(p => ({...p, discount: 50}));
            case 'custom':
                return baseProducts.slice(0, 4).map(p => ({...p, isFavorite: true}));
            default:
                return baseProducts;
        }
    };

    const handleSearch = (term) => {
        if (!term.trim()) {
            setSearchResults([]);
            return;
        }

        const allProducts = [
            ...recommendAgain,
            ...lastChance,
            ...veganTonight,
            ...localTrends,
            ...customized
        ];

        const uniqueProducts = Array.from(new Map(allProducts.map(item => [item.name, item])).values());

        const results = uniqueProducts.filter(product =>
            product.name.toLowerCase().includes(term.toLowerCase())
        );

        setSearchResults(results);
    };

    const handleApplyFilters = (filters) => {
        setActiveFilters(filters);

        const allProducts = [
            ...recommendAgain,
            ...lastChance,
            ...veganTonight,
            ...localTrends,
            ...customized
        ];

        const uniqueProducts = Array.from(new Map(allProducts.map(item => [item.name, item])).values());

        let filteredProducts = [...uniqueProducts];

        if (filters.type) {
            filteredProducts = filteredProducts.filter(p => p.type === filters.type);
        }

        if (filters.maxPrice) {
            filteredProducts = filteredProducts.filter(p => p.price <= filters.maxPrice);
        }

        if (filters.expirationDate) {
            filteredProducts = filteredProducts.filter(p => {
                if (p.expirationDate === "aujourd'hui") return true;
                if (p.expirationDate === "demain") return true;
                return false;
            });
        }

        setSearchResults(filteredProducts);
    };

    if (isLoading) {
        return (
            <div className="flex flex-col h-screen">
                <div className="flex-grow p-4 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-button-green"></div>
                </div>
                <Navbar />
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen">
            <div className="flex-grow p-4 overflow-y-auto">
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
                            <h2 className="text-lg font-semibold">Résultats</h2>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {searchResults.map((product, index) => (
                                <ProductCard key={`search-${index}`} product={product} />
                            ))}
                        </div>
                    </div>
                ) : (
                    <>
                        <ProductSection
                            title="Recommander à nouveau"
                            subtitle="Commandez à nouveau chez vos vendeurs préférés"
                            seeAllLink="/search/recommend"
                            products={recommendAgain}
                            icon={<IoMdHeart className="text-button-green mr-2" size={20} />}
                        />

                        <ProductSection
                            title="Dernière chance"
                            subtitle="Produits qui expirent aujourd'hui"
                            seeAllLink="/search/last-chance"
                            products={lastChance}
                            icon={<FaRegClock className="text-button-green mr-2" size={20} />}
                        />

                        <ProductSection
                            title="Ce soir je mange vegan"
                            subtitle="Découvrez nos options 100% végétales"
                            seeAllLink="/search/vegan"
                            products={veganTonight}
                            icon={<IoLeafOutline className="text-button-green mr-2" size={20} />}
                        />

                        <ProductSection
                            title="Tendances locales"
                            subtitle="Populaire près de chez vous"
                            seeAllLink="/search/trends"
                            products={localTrends}
                            icon={<FaMapMarkerAlt className="text-button-green mr-2" size={20} />}
                        />

                        <ProductSection
                            title="Sur mesure pour vous"
                            subtitle="Basé sur vos préférences et votre historique"
                            seeAllLink="/search/custom"
                            products={customized}
                            icon={<IoMdHeart className="text-button-green mr-2" size={20} />}
                        />
                    </>
                )}
            </div>
            <div className="flex-shrink-0 h-[10%] fixed bottom-0 left-0 w-full bg-white shadow-md pb-[env(safe-area-inset-bottom)] z-[1000]">
                <Navbar/>
            </div>
            
        </div>
    );
};

export default Search;

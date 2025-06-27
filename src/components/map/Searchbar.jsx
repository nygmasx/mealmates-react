import React, {useEffect, useState} from 'react';
import {Input} from "@/components/ui/input.jsx";
import {IoMdClose} from "react-icons/io";
import {motion, AnimatePresence} from "framer-motion";
import axiosConfig from "@/context/axiosConfig.js";
import {FiFilter} from "react-icons/fi";

const SearchIcon = (props) => {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.3-4.3"/>
        </svg>
    )
}

const FilterPanel = ({isOpen, onClose, onFiltersApplied}) => {
    const [selectedType, setSelectedType] = useState('');
    const [priceRange, setPriceRange] = useState([0, 100]);
    const [expirationDate, setExpirationDate] = useState('');
    const [dietaryPreferences, setDietaryPreferences] = useState([]);
    const [selectedPreferences, setSelectedPreferences] = useState([]);

    const Types = {
        food: 'Alimentation',
        beverage: 'Boisson',
        bakery: 'Boulangerie',
        dairy: 'Produits laitiers',
        other: 'Autre',
    };

    const token = localStorage.getItem("token");

    useEffect(() => {
        if (token) {
            fetchDietaryPreferences();
        }
    }, [token]);

    const today = new Date().toISOString().split('T')[0];
    
    const fetchDietaryPreferences = async () => {
        try {
            axiosConfig.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            const response = await axiosConfig.get('/dietary-preferences/');
            setDietaryPreferences(response.data);
        } catch (error) {
        }
    };

    const handleTypeChange = (e) => {
        setSelectedType(e.target.value);
    };

    const handlePriceRangeChange = (e) => {
        setPriceRange([0, parseInt(e.target.value)]);
    };

    const handleExpirationDateChange = (e) => {
        setExpirationDate(e.target.value);
    };

    const handleDietaryPreferenceChange = (prefId) => {
        setSelectedPreferences(prevSelected => {
            const newSelected = prevSelected.includes(prefId) 
                ? prevSelected.filter(id => id !== prefId)
                : [...prevSelected, prefId];
            return newSelected;
        });
    };

    const handleApplyFilters = async () => {
        try {
            const token = localStorage.getItem("token");
            
            if (!token) {
                return;
            }

            axiosConfig.defaults.headers.common["Authorization"] = `Bearer ${token}`;

            let formattedExpirationDate = undefined;
            if (expirationDate) {
                const date = new Date(expirationDate);
                date.setDate(date.getDate() + 1);
                date.setHours(0, 0, 0, 0);
                formattedExpirationDate = date.toISOString();
            }

            const filterData = {
                filters: {
                    type: selectedType || undefined,
                    maxPrice: priceRange[1],
                    expiresAt: formattedExpirationDate,
                    dietaryPreferences: selectedPreferences.length > 0 ? selectedPreferences : undefined
                }
            };

            Object.keys(filterData.filters).forEach(key => {
                if (filterData.filters[key] === undefined || 
                    (Array.isArray(filterData.filters[key]) && filterData.filters[key].length === 0)) {
                    delete filterData.filters[key];
                }
            });

            const response = await axiosConfig.post('/product/filter', filterData);
            
            onFiltersApplied(response.data || []);
            onClose();
        } catch (error) {
        }
    };

    const handleClearFilters = () => {
        setSelectedType('');
        setPriceRange([0, 100]);
        setExpirationDate('');
        setSelectedPreferences([]);
        onFiltersApplied([]);
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 bg-white z-[1001] overflow-y-auto"
                    initial={{y: '100%'}}
                    animate={{y: 0}}
                    exit={{y: '100%'}}
                    transition={{type: 'spring', stiffness: 300, damping: 30}}
                >
                    <div className="p-4 pb-24">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold">Filtres</h2>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-gray-100 rounded-full"
                            >
                                <IoMdClose className="h-6 w-6"/>
                            </button>
                        </div>

                        <div className="mb-6">
                            <h3 className="text-lg font-medium mb-3">Type de produit</h3>
                            <div className="grid grid-cols-2 gap-3">
                                {Object.entries(Types).map(([key, value]) => (
                                    <label
                                        key={key}
                                        className={`
                                            border rounded-lg p-3 flex items-center space-x-2 cursor-pointer transition-colors
                                            ${selectedType === key ? 'bg-green-100 border-green-500' : 'border-gray-300'}
                                        `}
                                    >
                                        <input
                                            type="radio"
                                            name="productType"
                                            value={key}
                                            checked={selectedType === key}
                                            onChange={handleTypeChange}
                                            className="sr-only"
                                        />
                                        <span className={selectedType === key ? 'text-green-800' : 'text-gray-700'}>
                                            {value}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="mb-6">
                            <h3 className="text-lg font-medium mb-3">Date d'expiration maximale</h3>
                            <p className="text-sm text-gray-600 mb-2">
                                Afficher les produits qui expirent jusqu'à cette date incluse
                            </p>
                            <div className="relative">
                                <input
                                    type="date"
                                    min={today}
                                    value={expirationDate}
                                    onChange={handleExpirationDateChange}
                                    className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                />
                            </div>
                        </div>

                        <div className="mb-6">
                            <h3 className="text-lg font-medium mb-3">Prix maximum</h3>
                            <div className="space-y-2">
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={priceRange[1]}
                                    onChange={handlePriceRangeChange}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-500"
                                />
                                <div className="flex justify-between text-sm text-gray-500">
                                    <span>0 €</span>
                                    <span>{priceRange[1]} €</span>
                                </div>
                            </div>
                        </div>

                        <div className="mb-8">
                            <h3 className="text-lg font-medium mb-3">Préférences alimentaires</h3>
                            <div className="grid grid-cols-2 gap-3">
                                {dietaryPreferences.map(pref => (
                                    <label
                                        key={pref.id}
                                        className={`
                                            border rounded-lg p-3 flex items-center space-x-2 cursor-pointer transition-colors
                                            ${selectedPreferences.includes(pref.id) ? 'bg-green-100 border-green-500' : 'border-gray-300'}
                                        `}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedPreferences.includes(pref.id)}
                                            onChange={() => handleDietaryPreferenceChange(pref.id)}
                                            className="sr-only"
                                        />
                                        <span
                                            className={selectedPreferences.includes(pref.id) ? 'text-green-800' : 'text-gray-700'}>
                                            {pref.name}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
                            <div className="flex gap-2">
                                <button
                                    onClick={handleClearFilters}
                                    className="flex-1 py-3 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
                                >
                                    Effacer
                                </button>
                                <button
                                    onClick={handleApplyFilters}
                                    className="flex-1 py-3 bg-button-green text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
                                >
                                    Appliquer
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

const Searchbar = ({onFiltersApplied, onClearFilters, hasActiveFilters, onLocationSelected}) => {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [googleMapsReady, setGoogleMapsReady] = useState(false);

    useEffect(() => {
        if (window.google && window.google.maps && window.google.maps.places) {
            setGoogleMapsReady(true);
            initializeAutocomplete();
            return;
        }

        window.initGooglePlacesAPISearchbar = () => {
            setGoogleMapsReady(true);
        };

        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places&callback=initGooglePlacesAPISearchbar`;
        script.async = true;
        script.defer = true;

        document.head.appendChild(script);

        return () => {
            if (document.head.contains(script)) {
                document.head.removeChild(script);
            }
            delete window.initGooglePlacesAPISearchbar;
        };
    }, []);

    useEffect(() => {
        if (googleMapsReady) {
            initializeAutocomplete();
        }
    }, [googleMapsReady]);

    const initializeAutocomplete = () => {
        const searchInput = document.getElementById('location-search-input');
        if (!searchInput) return;

        const autocomplete = new window.google.maps.places.Autocomplete(searchInput, {
            componentRestrictions: { country: 'fr' },
            fields: ['address_components', 'geometry', 'formatted_address', 'name'],
            types: ['establishment', 'geocode']
        });

        autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace();

            if (!place.geometry) {
                console.error("Aucune information sur ce lieu.");
                return;
            }

            const locationData = {
                name: place.name || place.formatted_address,
                formatted_address: place.formatted_address,
                coordinates: {
                    latitude: place.geometry.location.lat(),
                    longitude: place.geometry.location.lng()
                },
                address_components: place.address_components
            };

            if (onLocationSelected) {
                onLocationSelected(locationData);
            }

            setSearchValue(place.name || place.formatted_address);
        });
    };

    const handleSearchChange = (e) => {
        setSearchValue(e.target.value);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
    };

    const toggleFilter = () => {
        setIsFilterOpen(!isFilterOpen);
    };

    return (
        <>
            <div className="w-full max-w-md mx-auto px-4">
                <div className="relative w-full mb-4">
                    <form onSubmit={handleSearchSubmit} className="relative">
                        <div className="flex items-center bg-gray-100 rounded-xl">
                            <SearchIcon className="ml-4 text-gray-500" width={20} height={20}/>
                            <Input
                                id="location-search-input"
                                type="search"
                                placeholder="Rechercher un lieu..."
                                value={searchValue}
                                onChange={handleSearchChange}
                                className="border-0 bg-transparent px-2 py-3 focus:ring-0 focus:outline-none w-full"
                            />
                            <button
                                type="button"
                                onClick={toggleFilter}
                                className={`p-3 text-white rounded-r-xl flex items-center justify-center transition-colors relative ${
                                    hasActiveFilters ? 'bg-green-600' : 'bg-button-green'
                                }`}
                            >
                                <FiFilter size={20} />
                                {hasActiveFilters && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                                        !
                                    </span>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <FilterPanel 
                isOpen={isFilterOpen} 
                onClose={() => setIsFilterOpen(false)}
                onFiltersApplied={onFiltersApplied}
            />
        </>
    );
};

export default Searchbar;

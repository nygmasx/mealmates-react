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

const FilterPanel = ({isOpen, onClose}) => {
    const [selectedType, setSelectedType] = useState('');
    const [priceRange, setPriceRange] = useState([0, 100]);
    const [expirationDate, setExpirationDate] = useState('');
    const [dietaryPreferences, setDietaryPreferences] = useState([]);
    const [selectedPreferences, setSelectedPreferences] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);

    const Types = {
        fruits: 'Fruits',
        vegetables: 'Légumes',
        prepared_meal: 'Plats préparés',
        dairy_product: 'Produits laitiers',
        cake: 'Gâteaux',
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
            const response = await axiosConfig.get('/dietary-preferences');
            setDietaryPreferences(response.data);
        } catch (error) {
            console.error("Erreur lors de la récupération des préférences alimentaires:", error);
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
            if (prevSelected.includes(prefId)) {
                return prevSelected.filter(id => id !== prefId);
            } else {
                return [...prevSelected, prefId];
            }
        });
    };

    const handleApplyFilters = async () => {
        try {
            axiosConfig.defaults.headers.common["Authorization"] = `Bearer ${token}`;

            const filterData = {
                filters: {
                    type: selectedType || undefined,
                    maxPrice: priceRange[1],
                    expiresAt: expirationDate || undefined,
                    dietaryPreferences: selectedPreferences
                }
            };

            Object.keys(filterData.filters).forEach(key => {
                if (filterData.filters[key] === undefined) {
                    delete filterData.filters[key];
                }
            });

            console.log("Données de filtres envoyées:", filterData);

            const response = await axiosConfig.post('/product/filter', filterData);

            setFilteredProducts(response.data);
            console.log("Produits filtrés:", response.data);
            onClose();
        } catch (error) {
            console.error("Erreur lors de l'application des filtres:", error);
        }
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
                            <button
                                onClick={handleApplyFilters}
                                className="w-full py-3 bg-button-green text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
                            >
                                Appliquer les filtres
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

const Searchbar = ({onFiltersApplied}) => {
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const toggleFilter = () => {
        setIsFilterOpen(!isFilterOpen);
    };

    return (
        <>
            <div className="w-full max-w-md mx-auto px-4 flex gap-4 items-center">
                <div
                    className="w-5/6 flex items-center space-x-2 rounded-full border border-gray-300 bg-white shadow-lg px-4 py-2 focus-within:ring-2 focus-within:ring-green-500 focus-within:border-green-500 transition-all">
                    <SearchIcon className="h-5 w-5 text-gray-500"/>
                    <Input
                        type="search"
                        placeholder="Rechercher un lieu..."
                        className="w-full border-0 bg-transparent h-8 font-medium focus:outline-none focus:ring-0 placeholder:text-gray-400"
                    />
                </div>
                <div>
                    <button
                        type="button"
                        className="bg-button-green rounded-full p-4 transition-colors"
                        onClick={toggleFilter}
                    >
                        <FiFilter className="h-5 w-5 text-white"/>
                    </button>
                </div>
            </div>

            <FilterPanel isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)}
                         onFiltersApplied={onFiltersApplied}/>
        </>
    );
};

export default Searchbar;

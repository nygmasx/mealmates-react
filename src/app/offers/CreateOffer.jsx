import React, {useState, useEffect, useRef} from 'react';
import {useAuth} from "@/context/AuthContext.jsx";
import {useNavigate} from "react-router";
import axiosConfig from "@/context/axiosConfig.js";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {IoArrowBack, IoClose, IoCamera} from "react-icons/io5";
import {FiClock, FiCalendar} from "react-icons/fi";
import {SlLocationPin} from "react-icons/sl";
import Layout from "../Layout.jsx";

const CreateOffer = () => {
    const {user} = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [previewImages, setPreviewImages] = useState([]);
    const [imageFiles, setImageFiles] = useState([]);
    const [showImageFullscreen, setShowImageFullscreen] = useState(null);
    const [isRecurring, setIsRecurring] = useState(false);
    const [isDonation, setIsDonation] = useState(false);
    const [showPickupSchedule, setShowPickupSchedule] = useState(false);
    const [availableDietaryPreferences, setAvailableDietaryPreferences] = useState([]);
    const [googleMapsReady, setGoogleMapsReady] = useState(false);

    // Refs pour Google Places
    const autocompleteRef = useRef(null);
    const inputRef = useRef(null);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        quantity: 1,
        expirationDate: '',
        price: '',
        pickupAddress: '',
        type: 'food',
        pickupSchedule: [
            {day: 'Lundi', startTime: '09:00', endTime: '18:00', isEnabled: false},
            {day: 'Mardi', startTime: '09:00', endTime: '18:00', isEnabled: false},
            {day: 'Mercredi', startTime: '09:00', endTime: '18:00', isEnabled: false},
            {day: 'Jeudi', startTime: '09:00', endTime: '18:00', isEnabled: false},
            {day: 'Vendredi', startTime: '09:00', endTime: '18:00', isEnabled: false},
            {day: 'Samedi', startTime: '09:00', endTime: '18:00', isEnabled: false},
            {day: 'Dimanche', startTime: '09:00', endTime: '18:00', isEnabled: false}
        ],
        recurringFrequency: 'weekly',
        dietaryTags: []
    });

    const [errors, setErrors] = useState({});

    // Initialisation de Google Maps Places API
    useEffect(() => {
        if (window.google && window.google.maps && window.google.maps.places) {
            setGoogleMapsReady(true);
            return;
        }

        // Callback global pour l'initialisation
        window.initGooglePlacesAPI = () => {
            setGoogleMapsReady(true);
        };

        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places&callback=initGooglePlacesAPI`;
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);

        return () => {
            delete window.initGooglePlacesAPI;
        };
    }, []);

    // Initialisation de l'autocomplétion quand Google Maps est prêt
    useEffect(() => {
        if (googleMapsReady && inputRef.current) {
            initializeAutocomplete();
        }
    }, [googleMapsReady, currentStep]); // Réinitialiser quand on arrive à l'étape 3

    const initializeAutocomplete = () => {
        if (!inputRef.current || !window.google) return;

        // Détruire l'ancienne instance si elle existe
        if (autocompleteRef.current) {
            window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
        }

        // Créer une nouvelle instance d'autocomplétion
        autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
            componentRestrictions: {country: 'fr'},
            fields: ['address_components', 'formatted_address'],
            types: ['address']
        });

        // Écouter les changements de lieu
        autocompleteRef.current.addListener('place_changed', () => {
            const place = autocompleteRef.current.getPlace();

            if (!place.formatted_address) {
                setErrors(prev => ({
                    ...prev,
                    pickupAddress: "Aucune information sur cette adresse. Veuillez en sélectionner une dans la liste."
                }));
                return;
            }

            // Mettre à jour l'adresse avec l'adresse formatée par Google
            setFormData(prev => ({
                ...prev,
                pickupAddress: place.formatted_address
            }));

            // Effacer l'erreur d'adresse si elle existait
            if (errors.pickupAddress) {
                setErrors(prev => {
                    const {pickupAddress, ...rest} = prev;
                    return rest;
                });
            }
        });
    };

    useEffect(() => {
        const fetchDietaryPreferences = async () => {
            try {
                axiosConfig.defaults.headers.common["Authorization"];
                const response = await axiosConfig.get('/dietary-preferences/');
                setAvailableDietaryPreferences(response.data);
            } catch (error) {
                console.error('Erreur lors du chargement des préférences alimentaires:', error);
            }
        };

        fetchDietaryPreferences();
    }, []);

    useEffect(() => {
        return () => {
            previewImages.forEach(preview => URL.revokeObjectURL(preview));
        };
    }, [previewImages]);

    // Fonction pour utiliser la géolocalisation actuelle
    const handleUseCurrentLocation = () => {
        if (!navigator.geolocation) {
            setErrors(prev => ({
                ...prev,
                pickupAddress: "La géolocalisation n'est pas prise en charge par votre navigateur"
            }));
            return;
        }

        if (!googleMapsReady) {
            setErrors(prev => ({
                ...prev,
                pickupAddress: "Le service de géocodage n'est pas encore disponible"
            }));
            return;
        }

        setIsLoading(true);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const {latitude, longitude} = position.coords;

                try {
                    const geocoder = new window.google.maps.Geocoder();
                    const location = {lat: latitude, lng: longitude};

                    geocoder.geocode({location}, (results, status) => {
                        setIsLoading(false);

                        if (status === "OK" && results[0]) {
                            setFormData(prev => ({
                                ...prev,
                                pickupAddress: results[0].formatted_address
                            }));

                            // Effacer l'erreur d'adresse si elle existait
                            if (errors.pickupAddress) {
                                setErrors(prev => {
                                    const {pickupAddress, ...rest} = prev;
                                    return rest;
                                });
                            }
                        } else {
                            setErrors(prev => ({
                                ...prev,
                                pickupAddress: "Impossible de déterminer votre adresse actuelle"
                            }));
                        }
                    });
                } catch (error) {
                    setIsLoading(false);
                    console.error("Erreur de géocodage inverse:", error);
                    setErrors(prev => ({
                        ...prev,
                        pickupAddress: "Impossible de déterminer votre adresse actuelle"
                    }));
                }
            },
            (error) => {
                setIsLoading(false);
                console.error("Erreur de géolocalisation:", error);
                setErrors(prev => ({
                    ...prev,
                    pickupAddress: "Impossible d'obtenir votre position actuelle"
                }));
            },
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            }
        );
    };

    const validateStep = (step) => {
        const newErrors = {};

        if (step === 0) {
            if (!imageFiles.length) {
                newErrors.images = 'Au moins une photo est requise';
            }

            const totalSize = imageFiles.reduce((sum, file) => sum + file.size, 0);
            const maxTotalSize = 10 * 1024 * 1024;

            if (totalSize > maxTotalSize) {
                newErrors.images = 'La taille totale des images ne doit pas dépasser 10MB';
            }
        } else if (step === 1) {
            if (!formData.title.trim()) {
                newErrors.title = 'Le titre est requis';
            }
            if (!formData.description.trim()) {
                newErrors.description = 'La description est requise';
            }
            if (formData.quantity < 1) {
                newErrors.quantity = 'La quantité doit être au moins 1';
            }
            if (!formData.expirationDate) {
                newErrors.expirationDate = 'La date de péremption est requise';
            } else {
                const selectedDate = new Date(formData.expirationDate);
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                if (selectedDate < today) {
                    newErrors.expirationDate = 'La date de péremption doit être aujourd\'hui ou ultérieure';
                }
            }
        } else if (step === 2) {
            if (!isDonation && (!formData.price || formData.price <= 0)) {
                newErrors.price = 'Le prix doit être positif';
            }
        } else if (step === 3) {
            if (!formData.pickupAddress.trim()) {
                newErrors.pickupAddress = 'L\'adresse de retrait est requise';
            }
            if (!formData.pickupSchedule.some(schedule => schedule.isEnabled)) {
                newErrors.pickupSchedule = 'Au moins un créneau de retrait est requis';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleImageUpload = async (event) => {
        const files = Array.from(event.target.files);
        if (files.length === 0) return;

        const compressedFiles = [];
        const compressedPreviews = [];

        for (const file of files) {
            if (imageFiles.length + compressedFiles.length >= 5) break;

            try {
                const compressedFile = await compressImage(file);
                compressedFiles.push(compressedFile);
                compressedPreviews.push(URL.createObjectURL(compressedFile));
            } catch (error) {
                console.error('Erreur lors de la compression:', error);
                compressedFiles.push(file);
                compressedPreviews.push(URL.createObjectURL(file));
            }
        }

        const newFiles = [...imageFiles, ...compressedFiles];
        setImageFiles(newFiles);

        previewImages.forEach(preview => URL.revokeObjectURL(preview));
        const newPreviews = [...previewImages, ...compressedPreviews];
        setPreviewImages(newPreviews);
    };

    const compressImage = (file) => {
        return new Promise((resolve) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();

            img.onload = () => {
                const MAX_WIDTH = 1200;
                const MAX_HEIGHT = 1200;
                const QUALITY = 0.8;

                let {width, height} = img;

                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height = height * (MAX_WIDTH / width);
                        width = MAX_WIDTH;
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width = width * (MAX_HEIGHT / height);
                        height = MAX_HEIGHT;
                    }
                }

                canvas.width = width;
                canvas.height = height;

                ctx.drawImage(img, 0, 0, width, height);

                canvas.toBlob((blob) => {
                    const compressedFile = new File([blob], file.name, {
                        type: 'image/jpeg',
                        lastModified: Date.now(),
                    });
                    resolve(compressedFile);
                }, 'image/jpeg', QUALITY);
            };

            img.src = URL.createObjectURL(file);
        });
    };

    const removeImage = (index) => {
        const newFiles = [...imageFiles];
        const newPreviews = [...previewImages];

        URL.revokeObjectURL(newPreviews[index]);

        newFiles.splice(index, 1);
        newPreviews.splice(index, 1);

        setImageFiles(newFiles);
        setPreviewImages(newPreviews);
    };

    const handleChange = (e) => {
        const {name, value, type, checked} = e.target;
        if (type === 'checkbox') {
            setFormData({
                ...formData,
                [name]: checked
            });
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    const toggleDietaryTag = (tagId) => {
        setFormData({
            ...formData,
            dietaryTags: formData.dietaryTags.includes(tagId)
                ? formData.dietaryTags.filter(id => id !== tagId)
                : [...formData.dietaryTags, tagId]
        });
    };

    const togglePickupDay = (index) => {
        const updatedSchedule = [...formData.pickupSchedule];
        updatedSchedule[index] = {
            ...updatedSchedule[index],
            isEnabled: !updatedSchedule[index].isEnabled
        };

        setFormData({
            ...formData,
            pickupSchedule: updatedSchedule
        });
    };

    const updatePickupTime = (index, field, value) => {
        const updatedSchedule = [...formData.pickupSchedule];
        updatedSchedule[index] = {
            ...updatedSchedule[index],
            [field]: value
        };

        setFormData({
            ...formData,
            pickupSchedule: updatedSchedule
        });
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePrevious = () => {
        setCurrentStep(currentStep - 1);
    };

    const handleSubmit = async () => {
        if (!validateStep(currentStep)) {
            return;
        }

        setIsLoading(true);

        try {
            const offerData = new FormData();

            imageFiles.forEach((file) => {
                offerData.append('images[]', file);
            });

            offerData.append('title', formData.title);
            offerData.append('description', formData.description);
            offerData.append('quantity', formData.quantity.toString());
            offerData.append('expirationDate', formData.expirationDate);
            offerData.append('isDonation', isDonation.toString());

            if (isDonation) {
                offerData.append('price', '0');
            } else {
                offerData.append('price', formData.price.toString());
            }

            offerData.append('type', formData.type);
            offerData.append('pickupAddress', formData.pickupAddress);

            const enabledSchedule = formData.pickupSchedule.filter(schedule => schedule.isEnabled);
            if (enabledSchedule.length === 0) {
                setErrors({pickupSchedule: 'Au moins un créneau de retrait est requis'});
                setIsLoading(false);
                return;
            }

            offerData.append('availabilities', JSON.stringify(formData.pickupSchedule));

            offerData.append('isRecurring', isRecurring.toString());
            offerData.append('recurringFrequency', formData.recurringFrequency);

            if (formData.dietaryTags && formData.dietaryTags.length > 0) {
                formData.dietaryTags.forEach(tagId => {
                    offerData.append('dietaryPreferences[]', tagId);
                });
            }

            const response = await axiosConfig.post('/product', offerData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            navigate('/offers/success', {
                state: {
                    offerId: response.data.id,
                    message: response.data.message || 'Produit créé avec succès'
                }
            });

        } catch (error) {
            console.error('Erreur lors de la création de l\'offre:', error);
            console.error('Response data:', error.response?.data);
            console.error('Response errors:', error.response?.data?.errors);

            if (error.response?.status === 413) {
                setErrors({
                    form: 'Les images sont trop volumineuses. Veuillez réduire la taille ou le nombre d\'images et réessayer.'
                });
            } else if (error.response?.status === 400 && error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else if (error.response?.status === 401) {
                setErrors({
                    form: 'Vous devez être connecté pour créer une offre. Veuillez vous reconnecter.'
                });
            } else {
                setErrors({
                    form: error.response?.data?.message || 'Une erreur est survenue lors de la création de l\'offre. Veuillez réessayer.'
                });
            }
        } finally {
            setIsLoading(false);
        }
    };

    const renderStepIndicator = () => {
        return (
            <div className="flex justify-center mb-6">
                {[0, 1, 2, 3].map(step => (
                    <div key={step} className="flex items-center">
                        <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                currentStep === step
                                    ? 'bg-button-green text-white'
                                    : currentStep > step
                                        ? 'bg-green-100 border border-button-green text-button-green'
                                        : 'bg-gray-200 text-gray-500'
                            }`}
                        >
                            {step + 1}
                        </div>
                        {step < 3 && (
                            <div className={`w-10 h-1 ${currentStep > step ? 'bg-button-green' : 'bg-gray-200'}`}/>
                        )}
                    </div>
                ))}
            </div>
        );
    };

    const renderStep0 = () => {
        return (
            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4">Ajoutez des photos</h2>
                <p className="text-gray-500 mb-6">Ajoutez au moins une photo pour montrer clairement votre produit.</p>

                <div className="grid grid-cols-3 gap-3 mb-4">
                    {previewImages.map((preview, index) => (
                        <div key={index} className="relative aspect-square">
                            <img
                                src={preview}
                                alt={`Aperçu ${index + 1}`}
                                className="w-full h-full object-cover rounded-lg"
                                onClick={() => setShowImageFullscreen(preview)}
                            />
                            <button
                                type="button"
                                className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-1.5"
                                onClick={() => removeImage(index)}
                            >
                                <IoClose size={16}/>
                            </button>
                        </div>
                    ))}

                    {previewImages.length < 5 && (
                        <label
                            className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer bg-gray-50">
                            <IoCamera size={24} className="text-gray-400 mb-2"/>
                            <span className="text-sm text-gray-500">Ajouter</span>
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                className="hidden"
                                onChange={handleImageUpload}
                            />
                        </label>
                    )}
                </div>

                {errors.images && <p className="text-red-500 text-sm mt-1">{errors.images}</p>}

                {showImageFullscreen && (
                    <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
                         onClick={() => setShowImageFullscreen(null)}>
                        <div className="relative max-w-full max-h-full">
                            <img
                                src={showImageFullscreen}
                                alt="Aperçu en plein écran"
                                className="max-w-full max-h-[80vh] object-contain"
                            />
                            <button
                                type="button"
                                className="absolute top-4 right-4 bg-black bg-opacity-50 text-white rounded-full p-2"
                                onClick={() => setShowImageFullscreen(null)}
                            >
                                <IoClose size={24}/>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const renderStep1 = () => {
        return (
            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4">À propos de votre produit</h2>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Titre *
                    </label>
                    <Input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Ex: Pain au levain fait maison"
                        className={`w-full ${errors.title ? 'border-red-500' : ''}`}
                    />
                    {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description *
                    </label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Décrivez votre produit, son état, etc."
                        rows={3}
                        className={`w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-button-green ${errors.description ? 'border-red-500' : ''}`}
                    />
                    {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Quantité *
                    </label>
                    <Input
                        type="number"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        min={1}
                        className={`w-full ${errors.quantity ? 'border-red-500' : ''}`}
                    />
                    {errors.quantity && <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>}
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date de péremption *
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiCalendar className="text-gray-400"/>
                        </div>
                        <Input
                            type="date"
                            name="expirationDate"
                            value={formData.expirationDate}
                            onChange={handleChange}
                            min={new Date().toISOString().split('T')[0]}
                            className={`w-full pl-10 ${errors.expirationDate ? 'border-red-500' : ''}`}
                        />
                    </div>
                    {errors.expirationDate && <p className="text-red-500 text-sm mt-1">{errors.expirationDate}</p>}
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Type de produit
                    </label>
                    <select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-button-green focus:border-button-green rounded-md"
                    >
                        <option value="food">Alimentation</option>
                        <option value="beverage">Boisson</option>
                        <option value="bakery">Boulangerie</option>
                        <option value="dairy">Produits laitiers</option>
                        <option value="other">Autre</option>
                    </select>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Catégories alimentaires
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                        {availableDietaryPreferences.map((preference) => (
                            <label key={preference.id} className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={formData.dietaryTags.includes(preference.id)}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setFormData(prev => ({
                                                ...prev,
                                                dietaryTags: [...prev.dietaryTags, preference.id]
                                            }));
                                        } else {
                                            setFormData(prev => ({
                                                ...prev,
                                                dietaryTags: prev.dietaryTags.filter(id => id !== preference.id)
                                            }));
                                        }
                                    }}
                                    className="rounded border-gray-300 text-button-green focus:ring-button-green"
                                />
                                <span className="text-sm">{preference.name}</span>
                            </label>
                        ))}
                    </div>
                    {availableDietaryPreferences.length === 0 && (
                        <p className="text-gray-500 text-sm">Chargement des préférences alimentaires...</p>
                    )}
                </div>
            </div>
        );
    };

    const renderStep2 = () => {
        return (
            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4">Prix et disponibilité</h2>

                <div className="flex items-center mb-6">
                    <input
                        type="checkbox"
                        id="isDonation"
                        checked={isDonation}
                        onChange={() => setIsDonation(!isDonation)}
                        className="h-4 w-4 text-button-green focus:ring-button-green rounded"
                    />
                    <label htmlFor="isDonation" className="ml-2 block text-gray-700">
                        Je souhaite donner ce produit gratuitement
                    </label>
                </div>

                {!isDonation && (
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Prix (€) *
                        </label>
                        <div className="relative">
                            <Input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                min={0.01}
                                step={0.01}
                                placeholder="0.00"
                                className={`w-full pr-8 ${errors.price ? 'border-red-500' : ''}`}
                            />
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                <span className="text-gray-500">€</span>
                            </div>
                        </div>
                        {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                        <p className="text-sm text-gray-500 mt-2">
                            Prix suggéré pour ce type de produit: entre 3€ et 5€
                        </p>
                    </div>
                )}

                <div className="flex items-center mb-6">
                    <input
                        type="checkbox"
                        id="isRecurring"
                        checked={isRecurring}
                        onChange={() => setIsRecurring(!isRecurring)}
                        className="h-4 w-4 text-button-green focus:ring-button-green rounded"
                    />
                    <label htmlFor="isRecurring" className="ml-2 block text-gray-700">
                        C'est une offre récurrente
                    </label>
                </div>

                {isRecurring && (
                    <div className="mb-6 pl-6 border-l-2 border-gray-200">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Fréquence
                        </label>
                        <select
                            name="recurringFrequency"
                            value={formData.recurringFrequency}
                            onChange={handleChange}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-button-green focus:border-button-green rounded-md"
                        >
                            <option value="daily">Quotidienne</option>
                            <option value="weekly">Hebdomadaire</option>
                            <option value="monthly">Mensuelle</option>
                        </select>
                        <p className="text-sm text-gray-500 mt-2">
                            Votre offre sera automatiquement republiée selon cette fréquence
                        </p>
                    </div>
                )}
            </div>
        );
    };

    const renderStep3 = () => {
        return (
            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4">Récupération</h2>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Adresse de récupération *
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <SlLocationPin className="text-gray-400"/>
                        </div>
                        <Input
                            ref={inputRef}
                            type="text"
                            name="pickupAddress"
                            value={formData.pickupAddress}
                            onChange={handleChange}
                            placeholder="Adresse où récupérer le produit"
                            className={`w-full pl-10 ${errors.pickupAddress ? 'border-red-500' : ''}`}
                        />
                    </div>
                    {errors.pickupAddress && <p className="text-red-500 text-sm mt-1">{errors.pickupAddress}</p>}

                    {/* Bouton pour utiliser la position actuelle */}
                    <button
                        type="button"
                        onClick={handleUseCurrentLocation}
                        disabled={isLoading || !googleMapsReady}
                        className="mt-2 text-sm text-button-green border border-button-green bg-white px-3 py-1 rounded hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? "Détection en cours..." : "📍 Utiliser ma position actuelle"}
                    </button>
                </div>

                <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Disponibilités pour la récupération *
                        </label>
                        <button
                            type="button"
                            onClick={() => setShowPickupSchedule(!showPickupSchedule)}
                            className="text-button-green text-sm flex items-center"
                        >
                            {showPickupSchedule ? 'Masquer' : 'Voir'} les créneaux
                        </button>
                    </div>

                    {errors.pickupSchedule && <p className="text-red-500 text-sm mt-1">{errors.pickupSchedule}</p>}
                    {errors.availabilities && <p className="text-red-500 text-sm mt-1">{errors.availabilities}</p>}

                    {showPickupSchedule && (
                        <div className="border rounded-lg p-4 bg-gray-50">
                            {formData.pickupSchedule.map((schedule, index) => (
                                <div key={index}
                                     className="mb-3 pb-3 border-b border-gray-200 last:border-0 last:mb-0 last:pb-0">
                                    <div className="flex items-center mb-2">
                                        <input
                                            type="checkbox"
                                            id={`day-${index}`}
                                            checked={schedule.isEnabled}
                                            onChange={() => togglePickupDay(index)}
                                            className="h-4 w-4 text-button-green focus:ring-button-green rounded"
                                        />
                                        <label htmlFor={`day-${index}`} className="ml-2 block text-gray-700">
                                            {schedule.day}
                                        </label>
                                    </div>

                                    {schedule.isEnabled && (
                                        <div className="flex items-center gap-3 ml-6">
                                            <div className="flex items-center">
                                                <span className="text-sm text-gray-500 mr-2">De</span>
                                                <input
                                                    type="time"
                                                    value={schedule.startTime}
                                                    onChange={(e) => updatePickupTime(index, 'startTime', e.target.value)}
                                                    className="border border-gray-300 rounded p-1 text-sm"
                                                />
                                            </div>
                                            <div className="flex items-center">
                                                <span className="text-sm text-gray-500 mr-2">à</span>
                                                <input
                                                    type="time"
                                                    value={schedule.endTime}
                                                    onChange={(e) => updatePickupTime(index, 'endTime', e.target.value)}
                                                    className="border border-gray-300 rounded p-1 text-sm"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <Layout>
            <div className="min-h-screen bg-gray-50">
                <header className="bg-white shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 flex items-center justify-between">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center text-gray-600"
                        >
                            <IoArrowBack size={20} className="mr-1"/>
                            <span>Retour</span>
                        </button>
                        <h1 className="text-xl font-medium text-gray-900">Créer une offre</h1>
                        <div className="w-20"></div>
                    </div>
                </header>

                <main className="max-w-2xl mx-auto px-4 py-6 sm:px-6">
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        {renderStepIndicator()}

                        {currentStep === 0 && renderStep0()}
                        {currentStep === 1 && renderStep1()}
                        {currentStep === 2 && renderStep2()}
                        {currentStep === 3 && renderStep3()}

                        {errors.form && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                                {errors.form}
                            </div>
                        )}

                        <div className="flex justify-between mt-6">
                            {currentStep > 0 ? (
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handlePrevious}
                                    disabled={isLoading}
                                    className="px-4 py-2"
                                >
                                    Précédent
                                </Button>
                            ) : (
                                <div></div>
                            )}

                            {currentStep < 3 ? (
                                <Button
                                    type="button"
                                    onClick={handleNext}
                                    disabled={isLoading}
                                    className="bg-button-green text-white px-4 py-2"
                                >
                                    Suivant
                                </Button>
                            ) : (
                                <Button
                                    type="button"
                                    onClick={handleSubmit}
                                    disabled={isLoading}
                                    className="bg-button-green text-white px-4 py-2"
                                >
                                    {isLoading ? 'Publication...' : 'Publier mon offre'}
                                </Button>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </Layout>
    );
};

export default CreateOffer

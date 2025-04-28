import React, { useState } from 'react';
import { useAuth } from "@/context/AuthContext.jsx";
import { useNavigate } from "react-router";
import axiosConfig from "@/context/axiosConfig.js";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { IoArrowBack, IoClose, IoCamera } from "react-icons/io5";
import { FiClock, FiCalendar } from "react-icons/fi";
import { SlLocationPin } from "react-icons/sl";

const CreateOffer = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [previewImages, setPreviewImages] = useState([]);
    const [imageFiles, setImageFiles] = useState([]);
    const [showImageFullscreen, setShowImageFullscreen] = useState(null);
    const [isRecurring, setIsRecurring] = useState(false);
    const [isDonation, setIsDonation] = useState(false);
    const [showPickupSchedule, setShowPickupSchedule] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        quantity: 1,
        expirationDate: '',
        price: '',
        pickupAddress: '',
        pickupSchedule: [
            { day: 'Lundi', startTime: '09:00', endTime: '18:00', isEnabled: false },
            { day: 'Mardi', startTime: '09:00', endTime: '18:00', isEnabled: false },
            { day: 'Mercredi', startTime: '09:00', endTime: '18:00', isEnabled: false },
            { day: 'Jeudi', startTime: '09:00', endTime: '18:00', isEnabled: false },
            { day: 'Vendredi', startTime: '09:00', endTime: '18:00', isEnabled: false },
            { day: 'Samedi', startTime: '09:00', endTime: '18:00', isEnabled: false },
            { day: 'Dimanche', startTime: '09:00', endTime: '18:00', isEnabled: false }
        ],
        recurringFrequency: 'weekly',
        dietaryTags: []
    });

    const dietaryOptions = [
        { id: 1, name: 'Végétarien' },
        { id: 2, name: 'Vegan' },
        { id: 3, name: 'Sans gluten' },
        { id: 4, name: 'Sans lactose' },
        { id: 5, name: 'Halal' },
        { id: 6, name: 'Casher' }
    ];

    const [errors, setErrors] = useState({});

    const validateStep = (step) => {
        const newErrors = {};

        if (step === 0) {
            if (!imageFiles.length) {
                newErrors.images = 'Au moins une photo est requise';
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

    const handleImageUpload = (event) => {
        const files = Array.from(event.target.files);
        if (files.length === 0) return;

        const newFiles = [...imageFiles, ...files].slice(0, 5);
        setImageFiles(newFiles);

        const newPreviews = newFiles.map(file => URL.createObjectURL(file));

        previewImages.forEach(preview => URL.revokeObjectURL(preview));

        setPreviewImages(newPreviews);
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
        const { name, value, type, checked } = e.target;
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
            imageFiles.forEach((file, index) => {
                offerData.append(`images[]`, file);
            });

            offerData.append('title', formData.title);
            offerData.append('description', formData.description);
            offerData.append('quantity', formData.quantity);
            offerData.append('expirationDate', formData.expirationDate);
            offerData.append('isDonation', isDonation);
            offerData.append('price', isDonation ? 0 : formData.price);
            offerData.append('pickupAddress', formData.pickupAddress);
            offerData.append('pickupSchedule', JSON.stringify(formData.pickupSchedule));
            offerData.append('isRecurring', isRecurring);
            offerData.append('recurringFrequency', formData.recurringFrequency);
            offerData.append('dietaryTags', JSON.stringify(formData.dietaryTags));

            const response = await axiosConfig.post('/offers', offerData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            navigate('/offers/success', { state: { offerId: response.data.id } });

        } catch (error) {
            console.error('Erreur lors de la création de l\'offre:', error);
            setErrors({
                form: 'Une erreur est survenue lors de la création de l\'offre. Veuillez réessayer.'
            });
        } finally {
            setIsLoading(false);
        }
    };

    React.useEffect(() => {
        return () => {
            previewImages.forEach(preview => URL.revokeObjectURL(preview));
        };
    }, [previewImages]);

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
                            <div className={`w-10 h-1 ${currentStep > step ? 'bg-button-green' : 'bg-gray-200'}`} />
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
                                <IoClose size={16} />
                            </button>
                        </div>
                    ))}

                    {previewImages.length < 5 && (
                        <label className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer bg-gray-50">
                            <IoCamera size={24} className="text-gray-400 mb-2" />
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
                    <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4" onClick={() => setShowImageFullscreen(null)}>
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
                                <IoClose size={24} />
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
                            <FiCalendar className="text-gray-400" />
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Catégories alimentaires
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {dietaryOptions.map((option) => (
                            <button
                                key={option.id}
                                type="button"
                                onClick={() => toggleDietaryTag(option.id)}
                                className={`px-3 py-1.5 rounded-lg text-sm ${
                                    formData.dietaryTags.includes(option.id)
                                        ? 'bg-green-100 text-button-green border border-button-green'
                                        : 'bg-gray-100 text-gray-700 border border-gray-300'
                                }`}
                            >
                                {option.name}
                            </button>
                        ))}
                    </div>
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
                            <SlLocationPin className="text-gray-400" />
                        </div>
                        <Input
                            type="text"
                            name="pickupAddress"
                            value={formData.pickupAddress}
                            onChange={handleChange}
                            placeholder="Adresse où récupérer le produit"
                            className={`w-full pl-10 ${errors.pickupAddress ? 'border-red-500' : ''}`}
                        />
                    </div>
                    {errors.pickupAddress && <p className="text-red-500 text-sm mt-1">{errors.pickupAddress}</p>}
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

                    {showPickupSchedule && (
                        <div className="border rounded-lg p-4 bg-gray-50">
                            {formData.pickupSchedule.map((schedule, index) => (
                                <div key={index} className="mb-3 pb-3 border-b border-gray-200 last:border-0 last:mb-0 last:pb-0">
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
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 flex items-center justify-between">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center text-gray-600"
                    >
                        <IoArrowBack size={20} className="mr-1" />
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
    );
};

export default CreateOffer;

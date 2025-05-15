import React, { useState, useEffect } from "react";
import axiosConfig from "@/context/axiosConfig.js";
import { useNavigate } from "react-router";
import { useAuth } from "@/context/AuthContext.jsx";

export const Address = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [coordinates, setCoordinates] = useState(null);
    const [formData, setFormData] = useState({
        street: "",
        complement: "",
        postalCode: "",
        city: ""
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [googleMapsReady, setGoogleMapsReady] = useState(false);
    const [userProfile, setUserProfile] = useState(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await axiosConfig.get("/profile/me");
                if (response.data && response.data.length > 0) {
                    setUserProfile(response.data[0]);
                    setFormData({
                        street: response.data[0].address_line1 || "",
                        complement: response.data[0].address_line2 || "",
                        postalCode: response.data[0].zip_code || "",
                        city: response.data[0].city || ""
                    });

                    if (response.data[0].latitude && response.data[0].longitude) {
                        setCoordinates({
                            latitude: parseFloat(response.data[0].latitude),
                            longitude: parseFloat(response.data[0].longitude)
                        });
                    }
                }
            } catch (error) {
                console.error("Erreur lors de la récupération du profil:", error);
            }
        };

        fetchUserProfile();
    }, []);

    useEffect(() => {
        if (window.google && window.google.maps && window.google.maps.places) {
            setGoogleMapsReady(true);
            initializeAutocomplete();
            return;
        }

        window.initGooglePlacesAPI = () => {
            setGoogleMapsReady(true);
        };

        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyC-45f2IfwEkoDVOdITcUXdxZ6QiNk7dAw&libraries=places&callback=initGooglePlacesAPI`;
        script.async = true;
        script.defer = true;

        document.head.appendChild(script);

        return () => {
            if (document.head.contains(script)) {
                document.head.removeChild(script);
            }
            delete window.initGooglePlacesAPI;
        };
    }, []);

    useEffect(() => {
        if (googleMapsReady) {
            initializeAutocomplete();
        }
    }, [googleMapsReady]);

    const initializeAutocomplete = () => {
        const addressInput = document.getElementById('street-input');
        if (!addressInput) return;

        const autocomplete = new window.google.maps.places.Autocomplete(addressInput, {
            componentRestrictions: { country: 'fr' },
            fields: ['address_components', 'geometry', 'formatted_address']
        });

        autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace();

            if (!place.geometry) {
                setError("Aucune information sur cette adresse. Veuillez en sélectionner une dans la liste.");
                return;
            }

            const addressComponents = extractAddressComponents(place.address_components);

            setFormData({
                street: addressComponents.fullStreet || '',
                complement: formData.complement,
                postalCode: addressComponents.postalCode || '',
                city: addressComponents.city || ''
            });

            setCoordinates({
                latitude: place.geometry.location.lat(),
                longitude: place.geometry.location.lng()
            });
        });
    };

    const extractAddressComponents = (components) => {
        if (!components || !Array.isArray(components)) {
            return { fullStreet: '', postalCode: '', city: '' };
        }

        let streetNumber = '';
        let route = '';
        let postalCode = '';
        let city = '';

        for (const component of components) {
            const type = component.types[0];

            switch (type) {
                case "street_number":
                    streetNumber = component.long_name;
                    break;
                case "route":
                    route = component.long_name;
                    break;
                case "postal_code":
                    postalCode = component.long_name;
                    break;
                case "locality":
                    city = component.long_name;
                    break;
            }
        }

        const fullStreet = streetNumber ? `${streetNumber} ${route}` : route;

        return { fullStreet, postalCode, city };
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        setSuccess("");

        try {
            if (!formData.street || !formData.postalCode || !formData.city) {
                throw new Error("Veuillez remplir tous les champs obligatoires");
            }

            if (!coordinates && window.google) {
                const address = `${formData.street}, ${formData.postalCode} ${formData.city}, France`;
                try {
                    const geocoder = new window.google.maps.Geocoder();
                    const result = await geocodeAddress(geocoder, address);

                    setCoordinates({
                        latitude: result.geometry.location.lat(),
                        longitude: result.geometry.location.lng()
                    });
                } catch (geocodeError) {
                    throw new Error("Impossible de trouver les coordonnées de cette adresse");
                }
            }

            const profileData = {
                address_line1: formData.street,
                address_line2: formData.complement,
                zip_code: formData.postalCode,
                city: formData.city,
                latitude: coordinates?.latitude.toString(),
                longitude: coordinates?.longitude.toString()
            };

            let response;

            if (userProfile) {
                response = await axiosConfig.put(`/profile/${userProfile.id}`, profileData);
                setSuccess("Adresse mise à jour avec succès");
            } else {
                response = await axiosConfig.post("/profile", profileData);
                setSuccess("Adresse enregistrée avec succès");
            }

            setTimeout(() => {
                navigate("/profile");
            }, 2000);
        } catch (error) {
            console.error("Erreur d'enregistrement de l'adresse:", error);
            setError(error.response?.data?.message || error.message || "Une erreur est survenue lors de l'enregistrement de l'adresse");
        } finally {
            setIsLoading(false);
        }
    };

    const geocodeAddress = (geocoder, address) => {
        return new Promise((resolve, reject) => {
            geocoder.geocode({ address }, (results, status) => {
                if (status === "OK" && results[0]) {
                    resolve(results[0]);
                } else {
                    reject(new Error("Impossible de géocoder cette adresse"));
                }
            });
        });
    };

    const reverseGeocode = (geocoder, location) => {
        return new Promise((resolve, reject) => {
            geocoder.geocode({ location }, (results, status) => {
                if (status === "OK" && results[0]) {
                    resolve(results[0]);
                } else {
                    reject(new Error("Aucune adresse trouvée à cet emplacement"));
                }
            });
        });
    };

    const handleUseCurrentLocation = () => {
        if (!navigator.geolocation) {
            setError("La géolocalisation n'est pas prise en charge par votre navigateur");
            return;
        }

        if (!googleMapsReady) {
            setError("Le service de géocodage n'est pas encore disponible");
            return;
        }

        setIsLoading(true);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;

                try {
                    const geocoder = new window.google.maps.Geocoder();
                    const location = { lat: latitude, lng: longitude };

                    const result = await reverseGeocode(geocoder, location);
                    const addressComponents = extractAddressComponents(result.address_components);

                    setFormData({
                        street: addressComponents.fullStreet || '',
                        complement: formData.complement,
                        postalCode: addressComponents.postalCode || '',
                        city: addressComponents.city || ''
                    });

                    setCoordinates({ latitude, longitude });
                } catch (error) {
                    console.error("Erreur de géocodage inverse:", error);
                    setError("Impossible de déterminer votre adresse actuelle");
                } finally {
                    setIsLoading(false);
                }
            },
            (error) => {
                setIsLoading(false);
                console.error("Erreur de géolocalisation:", error);
                setError("Impossible d'obtenir votre position actuelle");
            },
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            }
        );
    };

    return (
        <div className="flex flex-col min-h-screen">
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto py-4 px-6">
                    <div className="flex flex-col items-center">
                        <a href="../profile" className="block w-full">
                            <div className="flex justify-center mb-4">
                                <svg width="19" height="24" viewBox="0 0 19 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M1 10.363C1.01577 5.68116 4.7917 1.89869 9.43376 1.9146C14.0758 1.93051 17.8262 5.73876 17.8104 10.4206V10.5166C17.7533 13.5599 16.0684 16.3728 14.0028 18.5713C12.8215 19.8086 11.5023 20.9039 10.0715 21.8355C9.68895 22.1693 9.12146 22.1693 8.73888 21.8355C6.60591 20.4353 4.73387 18.6674 3.20839 16.6129C1.84876 14.8212 1.07681 12.6466 1 10.3918L1 10.363Z"
                                        stroke="#181725"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M9.40523 12.8877C10.6984 12.8877 11.7467 11.8304 11.7467 10.5261C11.7467 9.22186 10.6984 8.16455 9.40523 8.16455C8.11205 8.16455 7.06372 9.22186 7.06372 10.5261C7.06372 11.8304 8.11205 12.8877 9.40523 12.8877Z"
                                        stroke="#181725"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </div>
                            <div className="flex items-center justify-center gap-2">
                                <svg width="10" height="15" viewBox="0 0 10 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="transform rotate-180">
                                    <g clipPath="url(#clip0_470_397)">
                                        <path
                                            d="M1.01006 2.09166C0.812929 1.89166 0.703411 1.6285 0.714363 1.35482C0.714363 1.08114 0.82388 0.828504 1.03196 0.628504C1.2291 0.43903 1.50289 0.323241 1.78764 0.323241C2.07238 0.323241 2.34618 0.417979 2.55426 0.607452L8.75296 6.56535C8.85152 6.66008 8.92818 6.77587 8.98294 6.90219C9.0377 7.0285 9.07056 7.16535 9.07056 7.30219C9.07056 7.43903 9.0377 7.57587 8.98294 7.71272C8.92818 7.83903 8.85152 7.95482 8.75296 8.04956L2.55426 14.0075C2.45569 14.1022 2.33522 14.1864 2.2038 14.239C2.06143 14.2917 1.91906 14.3232 1.77668 14.3232C1.63431 14.3232 1.48099 14.3022 1.34956 14.2496C1.21814 14.1969 1.09767 14.1127 0.988156 14.018C0.88959 13.9232 0.812928 13.7969 0.758169 13.6706C0.692458 13.5443 0.670555 13.4075 0.670555 13.2601C0.670555 13.1232 0.70341 12.9864 0.758169 12.8601C0.812928 12.7338 0.900542 12.618 1.01006 12.5127L6.43118 7.30219L5.40172 6.32324L1.01006 2.09166Z"
                                            fill="#181725"
                                        />
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_470_397">
                                            <rect width="8.4" height="14" fill="white" transform="translate(9.07056 14.3232) rotate(-180)" />
                                        </clipPath>
                                    </defs>
                                </svg>
                                <span className="text-xl font-medium">Adresse de livraison</span>
                            </div>
                        </a>
                    </div>
                </div>
            </header>

            <main className="flex-1 max-w-7xl mx-auto w-full">
                <form onSubmit={handleSubmit}>
                    {error && (
                        <div className="mx-6 mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="mx-6 mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                            {success}
                        </div>
                    )}

                    <div>
                        <div className="border-t border-gray-200">
                            <div className="px-6">
                                <label className="block text-gray-500 text-sm mt-4">Adresse</label>
                                <input
                                    id="street-input"
                                    type="text"
                                    name="street"
                                    value={formData.street}
                                    onChange={handleChange}
                                    placeholder="40 Avenue des champs elysees"
                                    className="w-full py-2 focus:outline-none text-[#181725]"
                                    required
                                />
                            </div>
                        </div>

                        <div className="border-t border-gray-200">
                            <div className="px-6">
                                <label className="block text-gray-500 text-sm mt-4">Complément d'adresse</label>
                                <input
                                    type="text"
                                    name="complement"
                                    value={formData.complement}
                                    onChange={handleChange}
                                    className="w-full py-2 focus:outline-none text-[#181725]"
                                />
                            </div>
                        </div>

                        <div className="border-t border-gray-200">
                            <div className="px-6">
                                <label className="block text-gray-500 text-sm mt-4">Code postal</label>
                                <input
                                    type="text"
                                    name="postalCode"
                                    value={formData.postalCode}
                                    onChange={handleChange}
                                    placeholder="75008"
                                    className="w-full py-2 focus:outline-none text-[#181725]"
                                    required
                                />
                            </div>
                        </div>

                        <div className="border-t border-gray-200">
                            <div className="px-6">
                                <label className="block text-gray-500 text-sm mt-4">Ville</label>
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    placeholder="Paris"
                                    className="w-full py-2 focus:outline-none text-[#181725]"
                                    required
                                />
                            </div>
                        </div>
                        <div className="border-t border-gray-200"></div>
                    </div>

                    <div className="px-6 mt-4">
                        <button
                            type="button"
                            onClick={handleUseCurrentLocation}
                            disabled={isLoading || !googleMapsReady}
                            className="w-full mb-4 bg-white text-[#53B175] border border-[#53B175] py-3 rounded-lg text-lg font-medium"
                        >
                            {isLoading ? "Détection en cours..." : "Utiliser ma position actuelle"}
                        </button>
                    </div>

                    <div className="px-6">
                        <button
                            type="submit"
                            className="w-full mt-2 bg-[#53B175] text-white py-3 rounded-lg text-lg font-medium"
                            disabled={isLoading}
                        >
                            {isLoading ? "Traitement en cours..." : userProfile ? "Mettre à jour l'adresse" : "Enregistrer l'adresse"}
                        </button>
                    </div>

                    {coordinates && (
                        <div className="px-6 mt-4 text-xs text-gray-500">
                            Position détectée: {coordinates.latitude.toFixed(6)}, {coordinates.longitude.toFixed(6)}
                        </div>
                    )}
                </form>
            </main>
        </div>
    );
};

export default Address;

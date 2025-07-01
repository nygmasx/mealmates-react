import React, {useState, useEffect} from 'react';
import {loadStripe} from '@stripe/stripe-js';
import {Elements} from '@stripe/react-stripe-js';
import {PaymentForm} from './PaymentForm';
import {X} from 'lucide-react';
import axiosConfig from '@/context/axiosConfig.js';
import {showToast} from '@/utils/toast.js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);


export const PaymentModal = ({isOpen, onClose, booking, onPaymentSuccess}) => {
    const [clientSecret, setClientSecret] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isOpen && booking && booking.total_price > 0) {
            createPaymentIntent();
        }
    }, [isOpen, booking]);

    const createPaymentIntent = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await axiosConfig.post(`/bookings/${booking.id}/create-payment-intent`);
            setClientSecret(response.data.client_secret);
        } catch (error) {
            console.error('Erreur création Payment Intent:', error);
            setError('Impossible de préparer le paiement');
            showToast.error('Erreur lors de la préparation du paiement');
        } finally {
            setIsLoading(false);
        }
    };

    const handlePaymentSuccess = (paymentIntent) => {
        onPaymentSuccess(paymentIntent);
        onClose();
    };

    const stripeOptions = {
        clientSecret,
        appearance: {
            theme: 'stripe',
            variables: {
                colorPrimary: '#53B175',
                colorBackground: '#ffffff',
                colorText: '#30313d',
                colorDanger: '#df1b41',
                fontFamily: 'Inter, system-ui, sans-serif',
                spacingUnit: '4px',
                borderRadius: '8px',
            },
        },
    };

    if (!isOpen) return null;

    // Vérifier que Stripe est configuré
    if (!import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                    <div className="flex items-center justify-between p-4 border-b">
                        <h2 className="text-xl font-bold">Configuration manquante</h2>
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                            <X size={20} />
                        </button>
                    </div>
                    <div className="p-6 text-center">
                        <p className="text-red-600 mb-4">
                            Stripe n'est pas configuré. Veuillez ajouter VITE_STRIPE_PUBLISHABLE_KEY dans votre fichier .env
                        </p>
                        <button
                            onClick={onClose}
                            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                        >
                            Fermer
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-xl font-bold">Paiement</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full"
                    >
                        <X size={20}/>
                    </button>
                </div>

                <div className="p-6">
                    {isLoading ? (
                        <div className="text-center py-8">
                            <div
                                className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#53B175] mx-auto mb-4"></div>
                            <p>Préparation du paiement...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center py-8">
                            <p className="text-red-600 mb-4">{error}</p>
                            <button
                                onClick={createPaymentIntent}
                                className="bg-[#53B175] text-white px-4 py-2 rounded hover:bg-[#53B175]/90"
                            >
                                Réessayer
                            </button>
                        </div>
                    ) : clientSecret ? (
                        <Elements stripe={stripePromise} options={stripeOptions}>
                            <PaymentForm
                                bookingId={booking.id}
                                amount={booking.total_price}
                                onSuccess={handlePaymentSuccess}
                                onCancel={onClose}
                            />
                        </Elements>
                    ) : (
                        <p>Chargement...</p>
                    )}
                </div>
            </div>
        </div>
    );
};

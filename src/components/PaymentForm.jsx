import React, {useState} from 'react';
import {useStripe, useElements, PaymentElement} from '@stripe/react-stripe-js';
import {Button} from '@/components/ui/button';
import {showToast} from '@/utils/toast.js';
import axiosConfig from '@/context/axiosConfig.js';

export const PaymentForm = ({bookingId, amount, onSuccess, onCancel}) => {
    const stripe = useStripe();
    const elements = useElements();
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsProcessing(true);
        setError(null);

        try {
            const result = await stripe.confirmPayment({
                elements,
                redirect: 'if_required',
            });

            if (result.error) {
                setError(result.error.message);
                showToast.error('Erreur de paiement: ' + result.error.message);
            } else {
                await axiosConfig.post(`/bookings/${bookingId}/confirm-payment`, {
                    payment_intent_id: result.paymentIntent.id
                });

                showToast.success('Paiement effectué avec succès !');
                onSuccess(result.paymentIntent);
            }
        } catch (error) {
            console.error('Erreur lors du paiement:', error);
            setError('Erreur lors du traitement du paiement');
            showToast.error('Erreur lors du paiement');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Paiement sécurisé</h2>
            <p className="text-gray-600 mb-4">Montant à payer: <strong>{amount}€</strong></p>

            <form onSubmit={handleSubmit} className="space-y-4">
                <PaymentElement/>

                {error && (
                    <div className="text-red-600 text-sm bg-red-50 p-3 rounded">
                        {error}
                    </div>
                )}

                <div className="flex gap-3">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onCancel}
                        disabled={isProcessing}
                        className="flex-1"
                    >
                        Annuler
                    </Button>
                    <Button
                        type="submit"
                        disabled={!stripe || isProcessing}
                        className="flex-1 bg-[#53B175] hover:bg-[#53B175]/90"
                    >
                        {isProcessing ? (
                            <div className="flex items-center">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Traitement...
                            </div>
                        ) : (
                            `Payer ${amount}€`
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
};

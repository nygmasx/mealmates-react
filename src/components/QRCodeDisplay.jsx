import React, { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';
import { X, RefreshCw, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import axiosConfig from '@/context/axiosConfig.js';
import { showToast } from '@/utils/toast.js';

export const QRCodeDisplay = ({ isOpen, onClose, booking, onTransactionComplete }) => {
    const [qrData, setQrData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [timeLeft, setTimeLeft] = useState(0);
    const [isExpired, setIsExpired] = useState(false);

    useEffect(() => {
        if (isOpen && booking && booking.is_confirmed && booking.is_paid) {
            generateQRCode();
        }
    }, [isOpen, booking]);

    useEffect(() => {
        let timer;
        if (timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        setIsExpired(true);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [timeLeft]);

    const generateQRCode = async () => {
        setLoading(true);
        setError(null);
        setIsExpired(false);

        try {
            const response = await axiosConfig.post(`/bookings/${booking.id}/generate-qr-code`);
            const { token, expires_at } = response.data;

            // Créer le payload QR avec les informations nécessaires
            const qrPayload = {
                type: 'transaction_validation',
                booking_id: booking.id,
                token: token,
                buyer_id: booking.buyer.id || 'unknown',
                product_title: booking.product.title,
                amount: booking.total_price,
                timestamp: Date.now(),
                expires_at: expires_at
            };

            setQrData(JSON.stringify(qrPayload));

            // Calculer le temps restant
            const expirationTime = new Date(expires_at).getTime();
            const currentTime = Date.now();
            const remainingSeconds = Math.max(0, Math.floor((expirationTime - currentTime) / 1000));
            setTimeLeft(remainingSeconds);

        } catch (error) {
            setError('Impossible de générer le QR code');
            showToast.error('Erreur lors de la génération du QR code');
        } finally {
            setLoading(false);
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-sm w-full">
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-xl font-bold">QR Code de validation</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 text-center">
                    {loading ? (
                        <div className="py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#53B175] mx-auto mb-4"></div>
                            <p>Génération du QR code...</p>
                        </div>
                    ) : error ? (
                        <div className="py-8">
                            <p className="text-red-600 mb-4">{error}</p>
                            <Button
                                onClick={generateQRCode}
                                className="bg-[#53B175] hover:bg-[#53B175]/90"
                            >
                                <RefreshCw size={16} className="mr-2" />
                                Réessayer
                            </Button>
                        </div>
                    ) : qrData ? (
                        <>
                            <div className="mb-4">
                                <h3 className="font-medium text-gray-900 mb-2">
                                    {booking.product?.title}
                                </h3>
                                <p className="text-sm text-gray-600 mb-4">
                                    Montant: {booking.total_price}€
                                </p>
                            </div>

                            {!isExpired ? (
                                <>
                                    <div className="bg-white p-4 rounded-lg border-2 border-gray-200 mb-4 inline-block">
                                        <QRCode
                                            value={qrData}
                                            size={200}
                                            level="M"
                                            className="max-w-full h-auto"
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <div className="flex items-center justify-center text-sm text-gray-600 mb-2">
                                            <Clock size={16} className="mr-1" />
                                            Expire dans: {formatTime(timeLeft)}
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-[#53B175] h-2 rounded-full transition-all duration-1000"
                                                style={{ width: `${(timeLeft / 300) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    <p className="text-xs text-gray-500 mb-4">
                                        Présentez ce QR code au vendeur pour finaliser la transaction
                                    </p>
                                </>
                            ) : (
                                <div className="py-8">
                                    <div className="text-red-500 mb-4">
                                        <Clock size={48} className="mx-auto mb-2" />
                                        <p className="font-medium">QR Code expiré</p>
                                        <p className="text-sm">Générez un nouveau code</p>
                                    </div>
                                    <Button
                                        onClick={generateQRCode}
                                        className="bg-[#53B175] hover:bg-[#53B175]/90"
                                    >
                                        <RefreshCw size={16} className="mr-2" />
                                        Générer un nouveau QR code
                                    </Button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="py-8">
                            <Button
                                onClick={generateQRCode}
                                className="bg-[#53B175] hover:bg-[#53B175]/90"
                            >
                                Générer le QR code
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

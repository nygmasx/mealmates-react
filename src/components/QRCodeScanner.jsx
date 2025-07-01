import React, { useState, useEffect, useRef } from 'react';
import QrScanner from 'qr-scanner';
import { X, Camera, CameraOff, CheckCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import axiosConfig from '@/context/axiosConfig.js';
import { showToast } from '@/utils/toast.js';

export const QRCodeScanner = ({ isOpen, onClose, onTransactionValidated }) => {
    const videoRef = useRef(null);
    const qrScannerRef = useRef(null);
    const [hasCamera, setHasCamera] = useState(true);
    const [isScanning, setIsScanning] = useState(false);
    const [error, setError] = useState(null);
    const [scannedData, setScannedData] = useState(null);
    const [validationResult, setValidationResult] = useState(null);
    const [isValidating, setIsValidating] = useState(false);

    useEffect(() => {
        if (isOpen && videoRef.current) {
            initializeScanner();
        }

        return () => {
            if (qrScannerRef.current) {
                qrScannerRef.current.stop();
                qrScannerRef.current.destroy();
                qrScannerRef.current = null;
            }
        };
    }, [isOpen]);

    const initializeScanner = async () => {
        try {
            // Vérifier si la caméra est disponible
            const hasCamera = await QrScanner.hasCamera();
            setHasCamera(hasCamera);

            if (!hasCamera) {
                setError('Aucune caméra détectée sur cet appareil');
                return;
            }

            // Initialiser le scanner
            qrScannerRef.current = new QrScanner(
                videoRef.current,
                result => handleScanResult(result.data),
                {
                    onDecodeError: error => {
                        // Ignorer les erreurs de décodage normales
                    },
                    highlightScanRegion: true,
                    highlightCodeOutline: true,
                    preferredCamera: 'environment', // Caméra arrière par défaut
                }
            );

            await qrScannerRef.current.start();
            setIsScanning(true);
            setError(null);

        } catch (error) {
            setError('Impossible d\'accéder à la caméra');
            setHasCamera(false);
        }
    };

    const handleScanResult = async (data) => {
        try {
            // Parser les données du QR code
            const qrData = JSON.parse(data);
            
            // Vérifier que c'est un QR code de validation de transaction
            if (qrData.type !== 'transaction_validation') {
                showToast.error('QR code non valide pour une transaction');
                return;
            }

            // Vérifier l'expiration
            if (qrData.expires_at && new Date(qrData.expires_at).getTime() < Date.now()) {
                showToast.error('QR code expiré');
                return;
            }

            setScannedData(qrData);
            
            // Arrêter le scanner
            if (qrScannerRef.current) {
                qrScannerRef.current.stop();
                setIsScanning(false);
            }

            // Valider la transaction
            await validateTransaction(qrData);

        } catch (error) {
            if (error instanceof SyntaxError) {
                showToast.error('Format de QR code invalide');
            } else {
                showToast.error('Erreur lors du scan du QR code');
            }
        }
    };

    const validateTransaction = async (qrData) => {
        setIsValidating(true);
        setError(null);

        try {
            const response = await axiosConfig.post(`/bookings/${qrData.booking_id}/validate-transaction`, {
                token: qrData.token,
                validation_data: {
                    buyer_id: qrData.buyer_id,
                    amount: qrData.amount,
                    timestamp: qrData.timestamp
                }
            });

            setValidationResult({
                success: true,
                message: 'Transaction validée avec succès !',
                booking: response.data.booking
            });

            showToast.success('Transaction finalisée avec succès !');
            
            // Notifier le parent component
            if (onTransactionValidated) {
                onTransactionValidated(response.data.booking);
            }

        } catch (error) {
            setValidationResult({
                success: false,
                message: error.response?.data?.message || 'Erreur lors de la validation',
                error: error.response?.data
            });

            showToast.error('Échec de la validation de la transaction');
        } finally {
            setIsValidating(false);
        }
    };

    const resetScanner = () => {
        setScannedData(null);
        setValidationResult(null);
        setError(null);
        
        if (qrScannerRef.current && hasCamera) {
            qrScannerRef.current.start();
            setIsScanning(true);
        }
    };

    const switchCamera = async () => {
        if (qrScannerRef.current) {
            try {
                const cameras = await QrScanner.listCameras(true);
                if (cameras.length > 1) {
                    // Changer de caméra
                    const currentCamera = await qrScannerRef.current.getCamera();
                    const otherCamera = cameras.find(cam => cam.id !== currentCamera?.id);
                    if (otherCamera) {
                        await qrScannerRef.current.setCamera(otherCamera.id);
                    }
                }
            } catch (error) {
                showToast.error('Impossible de changer de caméra');
            }
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-xl font-bold">Scanner QR Code</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full text-gray-600"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6">
                    {!hasCamera ? (
                        <div className="text-center py-8">
                            <CameraOff size={48} className="mx-auto text-gray-400 mb-4" />
                            <p className="text-gray-600 mb-4">Aucune caméra disponible</p>
                            <p className="text-sm text-gray-500">
                                Vérifiez que votre appareil dispose d'une caméra et que les permissions sont accordées.
                            </p>
                        </div>
                    ) : validationResult ? (
                        <div className="text-center py-8">
                            {validationResult.success ? (
                                <>
                                    <CheckCircle size={48} className="mx-auto text-green-500 mb-4" />
                                    <h3 className="text-lg font-medium text-green-800 mb-2">
                                        Transaction validée !
                                    </h3>
                                    <p className="text-green-600 mb-4">{validationResult.message}</p>
                                    {scannedData && (
                                        <div className="bg-green-50 p-3 rounded text-sm text-left">
                                            <p><strong>Produit:</strong> {scannedData.product_title}</p>
                                            <p><strong>Montant:</strong> {scannedData.amount}€</p>
                                            <p><strong>Acheteur ID:</strong> {scannedData.buyer_id}</p>
                                        </div>
                                    )}
                                    <div className="mt-4 space-y-2">
                                        <Button
                                            onClick={onClose}
                                            className="w-full bg-green-600 hover:bg-green-700"
                                        >
                                            Terminer
                                        </Button>
                                        <Button
                                            onClick={resetScanner}
                                            variant="outline"
                                            className="w-full"
                                        >
                                            Scanner un autre QR code
                                        </Button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <AlertTriangle size={48} className="mx-auto text-red-500 mb-4" />
                                    <h3 className="text-lg font-medium text-red-800 mb-2">
                                        Validation échouée
                                    </h3>
                                    <p className="text-red-600 mb-4">{validationResult.message}</p>
                                    <div className="mt-4 space-y-2">
                                        <Button
                                            onClick={resetScanner}
                                            className="w-full bg-[#53B175] hover:bg-[#53B175]/90"
                                        >
                                            Réessayer
                                        </Button>
                                        <Button
                                            onClick={onClose}
                                            variant="outline"
                                            className="w-full"
                                        >
                                            Annuler
                                        </Button>
                                    </div>
                                </>
                            )}
                        </div>
                    ) : isValidating ? (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#53B175] mx-auto mb-4"></div>
                            <p>Validation de la transaction...</p>
                            {scannedData && (
                                <div className="mt-4 bg-gray-50 p-3 rounded text-sm text-left">
                                    <p><strong>Produit:</strong> {scannedData.product_title}</p>
                                    <p><strong>Montant:</strong> {scannedData.amount}€</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            <div className="relative mb-4">
                                <video
                                    ref={videoRef}
                                    className="w-full h-64 bg-black rounded-lg object-cover"
                                    playsInline
                                    muted
                                />
                                {isScanning && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-48 h-48 border-2 border-[#53B175] rounded-lg">
                                            <div className="w-full h-full border-2 border-white border-dashed rounded-lg"></div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {error && (
                                <div className="bg-red-50 border border-red-200 rounded p-3 mb-4">
                                    <p className="text-red-600 text-sm">{error}</p>
                                </div>
                            )}

                            <div className="text-center text-sm text-gray-600 mb-4">
                                <Camera size={20} className="mx-auto mb-2" />
                                Pointez la caméra vers le QR code de l'acheteur
                            </div>

                            <div className="flex gap-2">
                                <Button
                                    onClick={switchCamera}
                                    variant="outline"
                                    className="flex-1"
                                    disabled={!isScanning}
                                >
                                    Changer caméra
                                </Button>
                                <Button
                                    onClick={resetScanner}
                                    variant="outline"
                                    className="flex-1"
                                >
                                    Redémarrer
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
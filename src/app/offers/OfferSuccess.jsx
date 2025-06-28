import React, { useEffect } from 'react';
import { useLocation, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { FiCheck, FiShare2 } from "react-icons/fi";
import { showToast } from "@/utils/toast.js";

const OfferSuccess = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const offerId = location.state?.offerId;

    useEffect(() => {
        if (!offerId) {
            navigate('/offers');
        }
    }, [offerId, navigate]);

    if (!offerId) {
        return null;
    }

    const handleShareOffer = () => {
        if (navigator.share) {
            navigator.share({
                title: 'Mon offre sur MealMates',
                text: 'J\'ai publié une nouvelle offre sur MealMates!',
                url: `${window.location.origin}/offers/${offerId}`,
            })
                .catch(error => {
                    console.error('Erreur de partage:', error);
                    showToast.error('Erreur lors du partage');
                });
        } else {
            const shareUrl = `${window.location.origin}/offers/${offerId}`;
            navigator.clipboard.writeText(shareUrl)
                .then(() => showToast.success('Lien copié dans le presse-papier!'))
                .catch(err => {
                    console.error('Erreur lors de la copie du lien:', err);
                    showToast.error('Erreur lors de la copie du lien');
                });
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <main className="flex-grow flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-sm p-8 max-w-md w-full text-center">
                    <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                            <FiCheck className="text-button-green" size={32} />
                        </div>
                    </div>

                    <h1 className="text-2xl font-bold mb-2">Offre publiée avec succès!</h1>
                    <p className="text-gray-600 mb-6">
                        Votre offre est maintenant visible par les utilisateurs proches de votre emplacement.
                    </p>

                    <div className="bg-green-50 border border-green-100 rounded-lg p-4 mb-6 text-left">
                        <h3 className="font-medium text-gray-900 mb-2">Ce qui se passe ensuite :</h3>
                        <ul className="text-gray-600 text-sm space-y-2">
                            <li className="flex items-start">
                                <span className="text-button-green mr-2">•</span>
                                Les utilisateurs peuvent voir votre offre et vous contacter
                            </li>
                            <li className="flex items-start">
                                <span className="text-button-green mr-2">•</span>
                                Vous recevrez des notifications lorsque quelqu'un est intéressé
                            </li>
                            <li className="flex items-start">
                                <span className="text-button-green mr-2">•</span>
                                Votre offre expirera automatiquement à la date de péremption indiquée
                            </li>
                        </ul>
                    </div>

                    <div className="flex flex-col space-y-4">
                        <Button
                            onClick={handleShareOffer}
                            className="w-full flex items-center justify-center bg-button-green text-white"
                        >
                            <FiShare2 className="mr-2" />
                            Partager mon offre
                        </Button>

                        <Button
                            onClick={() => navigate(`/offers/${offerId}`)}
                            variant="outline"
                            className="w-full border-button-green text-button-green"
                        >
                            Voir mon offre
                        </Button>

                        <Button
                            onClick={() => navigate('/offers')}
                            variant="outline"
                            className="w-full"
                        >
                            Retour à mes offres
                        </Button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default OfferSuccess;

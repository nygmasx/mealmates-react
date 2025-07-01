import React, { useState } from 'react';
import { Star, MessageSquare, Clock, Heart, MessageCircle, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import axiosConfig from '@/context/axiosConfig.js';
import { showToast } from '@/utils/toast.js';

const StarRating = ({ rating, onRatingChange, label, required = false }) => {
    const [hoverRating, setHoverRating] = useState(0);

    return (
        <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        className="p-1"
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => onRatingChange(star)}
                    >
                        <Star
                            size={24}
                            className={`transition-colors ${
                                star <= (hoverRating || rating)
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                            }`}
                        />
                    </button>
                ))}
            </div>
            <div className="text-xs text-gray-500">
                {rating > 0 && (
                    <span>
                        {rating === 1 && "Très insatisfait"}
                        {rating === 2 && "Insatisfait"}
                        {rating === 3 && "Correct"}
                        {rating === 4 && "Satisfait"}
                        {rating === 5 && "Très satisfait"}
                    </span>
                )}
            </div>
        </div>
    );
};

export const ReviewForm = ({ booking, reviewType, onClose, onReviewSubmitted }) => {
    const [formData, setFormData] = useState({
        overall_rating: 0,
        product_quality_rating: 0,
        punctuality_rating: 0,
        friendliness_rating: 0,
        communication_rating: 0,
        reliability_rating: 0,
        comment: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isBuyerReview = reviewType === 'buyer_to_seller';
    const reviewTarget = isBuyerReview ? 'vendeur' : 'acheteur';

    const handleRatingChange = (field, rating) => {
        setFormData(prev => ({
            ...prev,
            [field]: rating
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (formData.overall_rating === 0) {
            showToast.error('Veuillez donner une note générale');
            return;
        }

        setIsSubmitting(true);
        
        try {
            const response = await axiosConfig.post('/reviews', {
                booking_id: booking.id,
                review_type: reviewType,
                ...formData
            });

            showToast.success('Évaluation soumise avec succès !');
            
            if (onReviewSubmitted) {
                onReviewSubmitted(response.data);
            }
            
            onClose();
        } catch (error) {
            console.error('Error submitting review:', error);
            showToast.error(
                error.response?.data?.message || 
                'Erreur lors de la soumission de l\'évaluation'
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white p-6">
            <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                    Évaluer le {reviewTarget}
                </h2>
                <p className="text-sm text-gray-600">
                    Transaction: <span className="font-medium">{booking.product?.title}</span>
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Note générale */}
                <StarRating
                    label="Note générale"
                    rating={formData.overall_rating}
                    onRatingChange={(rating) => handleRatingChange('overall_rating', rating)}
                    required
                />

                {/* Critères spécifiques selon le type d'évaluation */}
                {isBuyerReview ? (
                    // Acheteur évalue le vendeur
                    <>
                        <StarRating
                            label={
                                <div className="flex items-center gap-2">
                                    <MessageSquare size={16} />
                                    Qualité de la marchandise
                                </div>
                            }
                            rating={formData.product_quality_rating}
                            onRatingChange={(rating) => handleRatingChange('product_quality_rating', rating)}
                        />
                        
                        <StarRating
                            label={
                                <div className="flex items-center gap-2">
                                    <Clock size={16} />
                                    Respect des délais
                                </div>
                            }
                            rating={formData.punctuality_rating}
                            onRatingChange={(rating) => handleRatingChange('punctuality_rating', rating)}
                        />
                        
                        <StarRating
                            label={
                                <div className="flex items-center gap-2">
                                    <Heart size={16} />
                                    Convivialité
                                </div>
                            }
                            rating={formData.friendliness_rating}
                            onRatingChange={(rating) => handleRatingChange('friendliness_rating', rating)}
                        />
                    </>
                ) : (
                    // Vendeur évalue l'acheteur
                    <>
                        <StarRating
                            label={
                                <div className="flex items-center gap-2">
                                    <MessageCircle size={16} />
                                    Qualité de l'interaction
                                </div>
                            }
                            rating={formData.communication_rating}
                            onRatingChange={(rating) => handleRatingChange('communication_rating', rating)}
                        />
                        
                        <StarRating
                            label={
                                <div className="flex items-center gap-2">
                                    <Clock size={16} />
                                    Respect du rendez-vous
                                </div>
                            }
                            rating={formData.punctuality_rating}
                            onRatingChange={(rating) => handleRatingChange('punctuality_rating', rating)}
                        />
                        
                        <StarRating
                            label={
                                <div className="flex items-center gap-2">
                                    <Shield size={16} />
                                    Fiabilité
                                </div>
                            }
                            rating={formData.reliability_rating}
                            onRatingChange={(rating) => handleRatingChange('reliability_rating', rating)}
                        />
                    </>
                )}

                {/* Commentaire */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                        Commentaire (optionnel)
                    </label>
                    <textarea
                        className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-[#53B175] focus:border-transparent"
                        rows={4}
                        placeholder={`Partagez votre expérience avec ce ${reviewTarget}...`}
                        value={formData.comment}
                        onChange={(e) => setFormData(prev => ({
                            ...prev,
                            comment: e.target.value
                        }))}
                        maxLength={1000}
                    />
                    <div className="text-xs text-gray-500 text-right">
                        {formData.comment.length}/1000
                    </div>
                </div>

                {/* Boutons */}
                <div className="flex gap-3 pt-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        className="flex-1"
                        disabled={isSubmitting}
                    >
                        Annuler
                    </Button>
                    <Button
                        type="submit"
                        className="flex-1 bg-[#53B175] hover:bg-[#53B175]/90"
                        disabled={isSubmitting || formData.overall_rating === 0}
                    >
                        {isSubmitting ? (
                            <div className="flex items-center gap-2">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                Envoi...
                            </div>
                        ) : (
                            'Publier l\'évaluation'
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
};
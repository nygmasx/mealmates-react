import React from 'react';
import { Star, MessageSquare, Clock, Heart, MessageCircle, Shield, User } from 'lucide-react';

const StarDisplay = ({ rating, className = "" }) => {
    if (!rating) return null;
    
    return (
        <div className={`flex items-center gap-1 ${className}`}>
            {[1, 2, 3, 4, 5].map((star) => (
                <Star
                    key={star}
                    size={16}
                    className={`${
                        star <= rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                    }`}
                />
            ))}
            <span className="text-sm text-gray-600 ml-1">({rating}/5)</span>
        </div>
    );
};

const RatingCriterion = ({ icon: Icon, label, rating }) => {
    if (!rating) return null;
    
    return (
        <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
                {Icon && <Icon size={16} />}
                {label}
            </div>
            <StarDisplay rating={rating} />
        </div>
    );
};

export const ReviewCard = ({ review, showBookingInfo = false }) => {
    const isBuyerReview = review.review_type === 'buyer_to_seller';
    
    return (
        <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
            {/* En-tête */}
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <User size={20} className="text-gray-600" />
                    </div>
                    <div>
                        <h4 className="font-medium text-gray-900">
                            {review.author?.name || 'Utilisateur'}
                        </h4>
                        <p className="text-sm text-gray-500">
                            {isBuyerReview ? 'Acheteur' : 'Vendeur'}
                        </p>
                        {showBookingInfo && review.booking && (
                            <p className="text-xs text-gray-400">
                                {review.booking.product_title}
                            </p>
                        )}
                    </div>
                </div>
                <div className="text-right">
                    <StarDisplay rating={review.overall_rating} className="justify-end" />
                    <p className="text-xs text-gray-500 mt-1">
                        {new Date(review.created_at).toLocaleDateString('fr-FR')}
                    </p>
                </div>
            </div>

            {/* Critères détaillés */}
            <div className="space-y-1 border-t pt-3">
                {isBuyerReview ? (
                    // Évaluation du vendeur par l'acheteur
                    <>
                        <RatingCriterion
                            icon={MessageSquare}
                            label="Qualité de la marchandise"
                            rating={review.product_quality_rating}
                        />
                        <RatingCriterion
                            icon={Clock}
                            label="Respect des délais"
                            rating={review.punctuality_rating}
                        />
                        <RatingCriterion
                            icon={Heart}
                            label="Convivialité"
                            rating={review.friendliness_rating}
                        />
                    </>
                ) : (
                    // Évaluation de l'acheteur par le vendeur
                    <>
                        <RatingCriterion
                            icon={MessageCircle}
                            label="Qualité de l'interaction"
                            rating={review.communication_rating}
                        />
                        <RatingCriterion
                            icon={Clock}
                            label="Respect du rendez-vous"
                            rating={review.punctuality_rating}
                        />
                        <RatingCriterion
                            icon={Shield}
                            label="Fiabilité"
                            rating={review.reliability_rating}
                        />
                    </>
                )}
            </div>

            {/* Commentaire */}
            {review.comment && (
                <div className="bg-gray-50 rounded-lg p-3 border-t">
                    <p className="text-sm text-gray-700 italic">
                        "{review.comment}"
                    </p>
                </div>
            )}
        </div>
    );
};

export const ReviewSummary = ({ stats }) => {
    if (!stats || stats.totalReviews === 0) {
        return (
            <div className="bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-gray-500">Aucune évaluation disponible</p>
            </div>
        );
    }

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                    Évaluations
                </h3>
                <div className="text-right">
                    <StarDisplay rating={Math.round(stats.averageOverallRating * 10) / 10} />
                    <p className="text-xs text-gray-500 mt-1">
                        {stats.totalReviews} avis
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
                {stats.averageProductQuality && (
                    <div className="flex items-center justify-between">
                        <span className="text-gray-600">Qualité</span>
                        <StarDisplay rating={Math.round(stats.averageProductQuality * 10) / 10} />
                    </div>
                )}
                {stats.averagePunctuality && (
                    <div className="flex items-center justify-between">
                        <span className="text-gray-600">Ponctualité</span>
                        <StarDisplay rating={Math.round(stats.averagePunctuality * 10) / 10} />
                    </div>
                )}
                {stats.averageFriendliness && (
                    <div className="flex items-center justify-between">
                        <span className="text-gray-600">Convivialité</span>
                        <StarDisplay rating={Math.round(stats.averageFriendliness * 10) / 10} />
                    </div>
                )}
                {stats.averageCommunication && (
                    <div className="flex items-center justify-between">
                        <span className="text-gray-600">Communication</span>
                        <StarDisplay rating={Math.round(stats.averageCommunication * 10) / 10} />
                    </div>
                )}
                {stats.averageReliability && (
                    <div className="flex items-center justify-between">
                        <span className="text-gray-600">Fiabilité</span>
                        <StarDisplay rating={Math.round(stats.averageReliability * 10) / 10} />
                    </div>
                )}
            </div>
        </div>
    );
};

export const ReviewList = ({ reviews, loading = false, emptyMessage = "Aucune évaluation disponible" }) => {
    if (loading) {
        return (
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse bg-gray-100 rounded-lg p-4 h-32"></div>
                ))}
            </div>
        );
    }

    if (!reviews || reviews.length === 0) {
        return (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
                <p className="text-gray-500">{emptyMessage}</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} showBookingInfo />
            ))}
        </div>
    );
};
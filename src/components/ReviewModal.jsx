import React from 'react';
import { X } from 'lucide-react';
import { ReviewForm } from './ReviewForm';

export const ReviewModal = ({ isOpen, onClose, booking, reviewType, onReviewSubmitted }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-xl font-bold">Évaluer la transaction</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        aria-label="Fermer"
                    >
                        <X size={20} className="text-gray-600" />
                    </button>
                </div>
                
                <ReviewForm
                    booking={booking}
                    reviewType={reviewType}
                    onClose={onClose}
                    onReviewSubmitted={onReviewSubmitted}
                />
            </div>
        </div>
    );
};
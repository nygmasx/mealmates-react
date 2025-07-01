import React, { useEffect } from "react";
import { ArrowLeft } from 'lucide-react';
import { useAuth } from "@/context/AuthContext.jsx";
import { useReviews } from "@/hooks/useReviews.js";
import { ReviewSummary, ReviewList } from "@/components/ReviewDisplay.jsx";
import Layout from "../Layout";

export const Review = () => {
    const { user } = useAuth();
    const { reviews, stats, loading, error, fetchUserReviews, fetchUserStats } = useReviews();

    useEffect(() => {
        if (user?.id) {
            fetchUserReviews(user.id);
            fetchUserStats(user.id);
        }
    }, [user?.id, fetchUserReviews, fetchUserStats]);

    return (
        <Layout>
            <div className="flex flex-col min-h-screen">
                <header className="bg-white shadow">
                    <div className="max-w-7xl mx-auto py-4 px-6">
                        <div className="relative flex flex-col items-center">
                            <a href="../profile" className="w-full">
                                <div className="relative">
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2">
                                        <ArrowLeft size={20} className="text-gray-800" />
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <div className="mb-4">
                                            <img src="/assets/star.svg" alt="Etoile" />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xl font-medium">Mes Évaluations</span>
                                        </div>
                                    </div>
                                </div>
                            </a>
                        </div>
                    </div>
                </header>

                <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
                    <div className="space-y-6">
                        {/* Résumé des statistiques */}
                        <div className="bg-white rounded-lg p-6">
                            <h2 className="text-lg font-semibold mb-4">Mon profil d'évaluations</h2>
                            {user && (
                                <div className="flex items-center space-x-4 mb-6">
                                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M20 21V19C20 16.7909 18.2091 15 16 15H8C5.79086 15 4 16.7909 4 19V21" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            <path fillRule="evenodd" clipRule="evenodd" d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium">{user.firstName} {user.lastName}</p>
                                        <p className="text-sm text-gray-600">{user.email}</p>
                                    </div>
                                </div>
                            )}
                            
                            {loading ? (
                                <div className="animate-pulse bg-gray-100 rounded-lg p-4 h-32"></div>
                            ) : error ? (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                    <p className="text-red-600">{error}</p>
                                </div>
                            ) : (
                                <ReviewSummary stats={stats} />
                            )}
                        </div>

                        {/* Liste des évaluations reçues */}
                        <div className="bg-white rounded-lg p-6">
                            <h3 className="text-lg font-semibold mb-4">Évaluations reçues</h3>
                            <ReviewList 
                                reviews={reviews} 
                                loading={loading}
                                emptyMessage="Vous n'avez pas encore reçu d'évaluations"
                            />
                        </div>

                        {/* Conseils pour améliorer sa réputation */}
                        {stats && stats.totalReviews === 0 && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                                <h3 className="text-lg font-semibold text-blue-900 mb-2">
                                    Commencez à construire votre réputation
                                </h3>
                                <p className="text-blue-700 mb-4">
                                    Les évaluations vous aident à établir la confiance avec d'autres utilisateurs.
                                </p>
                                <ul className="text-sm text-blue-600 space-y-2">
                                    <li>• Complétez vos premières transactions</li>
                                    <li>• Soyez ponctuel et communicatif</li>
                                    <li>• Offrez des produits de qualité</li>
                                    <li>• Respectez vos engagements</li>
                                </ul>
                            </div>
                        )}

                        {/* Conseils pour maintenir une bonne réputation */}
                        {stats && stats.averageOverallRating >= 4 && (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                                <h3 className="text-lg font-semibold text-green-900 mb-2">
                                    Excellente réputation !
                                </h3>
                                <p className="text-green-700">
                                    Continuez sur cette lancée pour maintenir la confiance de la communauté.
                                </p>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </Layout>
    );
};

export default Review;
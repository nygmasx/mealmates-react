import { useState, useEffect, useCallback } from 'react';
import axiosConfig from '@/context/axiosConfig.js';

export const useReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchUserReviews = useCallback(async (userId) => {
        setLoading(true);
        setError(null);

        try {
            const response = await axiosConfig.get(`/reviews/user/${userId}`);
            console.log(response)
            console.log(userId)
            setReviews(response.data);
        } catch (error) {
            console.error('Error fetching user reviews:', error);
            setError('Impossible de charger les évaluations');
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchUserStats = useCallback(async (userId) => {
        setLoading(true);
        setError(null);

        try {
            const response = await axiosConfig.get(`/reviews/user/${userId}/stats`);
            setStats(response.data);
        } catch (error) {
            console.error('Error fetching user stats:', error);
            setError('Impossible de charger les statistiques');
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchBookingReviewStatus = useCallback(async (bookingId) => {
        try {
            const response = await axiosConfig.get(`/reviews/booking/${bookingId}/status`);
            return response.data;
        } catch (error) {
            console.error('Error fetching booking review status:', error);
            throw error;
        }
    }, []);

    const createReview = useCallback(async (reviewData) => {
        try {
            const response = await axiosConfig.post('/reviews', reviewData);
            return response.data;
        } catch (error) {
            console.error('Error creating review:', error);
            throw error;
        }
    }, []);

    return {
        reviews,
        stats,
        loading,
        error,
        fetchUserReviews,
        fetchUserStats,
        fetchBookingReviewStatus,
        createReview,
        setReviews,
        setStats
    };
};

export const useBookingReviewStatus = (bookingId) => {
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchStatus = useCallback(async () => {
        if (!bookingId) return;

        setLoading(true);
        setError(null);

        try {
            const response = await axiosConfig.get(`/reviews/booking/${bookingId}/status`);
            setStatus(response.data);
        } catch (error) {
            console.error('Error fetching booking review status:', error);
            setError('Impossible de charger le statut des évaluations');
        } finally {
            setLoading(false);
        }
    }, [bookingId]);

    useEffect(() => {
        fetchStatus();
    }, [fetchStatus]);

    return {
        status,
        loading,
        error,
        refetch: fetchStatus
    };
};

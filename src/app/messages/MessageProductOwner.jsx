import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { ArrowLeft, Send, User, Package } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Layout from '../Layout';
import axiosConfig from "@/context/axiosConfig.js";
import { useAuth } from "@/context/AuthContext.jsx";

const MessageProductOwner = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const { product, seller } = location.state || {};

    useEffect(() => {
        console.log(product)
    }, [product, seller, navigate]);

    const getImageUrl = (product) => {
        if (product?.images && product.images.length > 0) {
            return `https://apimates.testingtest.fr/${product.images[0]}`;
        }
        const productName = product?.title || product?.name || 'Produit';
        return `https://placehold.co/300x200/e2e8f0/ffffff?text=${encodeURIComponent(productName.split(' ')[0])}`;
    };

    const formatPrice = (price) => {
        if (!price && price !== 0) return '0.00';
        if (typeof price === 'string') {
            return parseFloat(price).toFixed(2);
        }
        return price.toFixed(2);
    };

    const handleSendMessage = async () => {
        if (!message.trim() || !seller?.id) return;

        setLoading(true);
        setError(null);

        try {
            const response = await axiosConfig.post('/chat/create', {
                userId: seller.id,
                message: message.trim()
            });

            if (response.status === 201) {
                navigate('/messages');
            }
        } catch (error) {
            console.error('Error sending message:', error);
            setError('Impossible d\'envoyer le message. Veuillez réessayer.');
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    if (!product || !seller) {
        return (
            <Layout>
                <div className="flex items-center justify-center h-screen">
                    <div className="text-center">
                        <p className="text-gray-500 mb-4">Informations du produit manquantes</p>
                        <Button onClick={() => navigate('/products')}>
                            Retour aux produits
                        </Button>
                    </div>
                </div>
            </Layout>
        );
    }

    const isFree = product.isDonation || product.price === '0' || product.price === 0;

    return (
        <Layout>
            <div className="flex flex-col h-screen">
                <div className="flex items-center p-4 border-b bg-white">
                    <button
                        onClick={() => navigate(-1)}
                        className="mr-3 p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-lg font-semibold">Contacter le vendeur</h1>
                </div>

                <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
                    <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
                        <h2 className="text-sm font-medium text-gray-500 mb-3 flex items-center">
                            <Package size={16} className="mr-1" />
                            Produit concerné
                        </h2>
                        <div className="flex items-center space-x-3">
                            <img
                                src={getImageUrl(product)}
                                alt={product.title || product.name}
                                className="w-16 h-16 object-cover rounded-lg"
                                onError={(e) => {
                                    e.target.src = `https://placehold.co/300x200/e2e8f0/ffffff?text=${encodeURIComponent((product.title || product.name || 'Produit').split(' ')[0])}`;
                                }}
                            />
                            <div className="flex-1">
                                <h3 className="font-medium text-gray-900 line-clamp-1">
                                    {product.title || product.name}
                                </h3>
                                <p className="text-sm text-gray-600">
                                    {isFree ? 'Gratuit' : `${formatPrice(product.price)}€`}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
                        <h2 className="text-sm font-medium text-gray-500 mb-3 flex items-center">
                            <User size={16} className="mr-1" />
                            Vendeur
                        </h2>
                        <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 rounded-full bg-[#53B175]/10 flex items-center justify-center">
                                <User className="text-[#53B175]" size={20} />
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">
                                    {seller.name || seller.username || seller.firstName}
                                </p>
                                {seller.email && (
                                    <p className="text-sm text-gray-600">{seller.email}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                            <p className="text-red-800 text-sm">{error}</p>
                        </div>
                    )}
                </div>

                <div className="">

                </div>

                <div className="bg-white border-t p-4">
                    <div className="flex items-end space-x-3">
                        <div className="flex-1">
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onSubmit={handleKeyPress}
                                placeholder="Écrivez votre message..."
                                className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:border-[#53B175] focus:ring-1 focus:ring-[#53B175] transition-colors"
                                rows={3}
                                disabled={loading}
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Appuyez sur Entrée pour envoyer
                            </p>
                        </div>
                        <Button
                            onClick={handleSendMessage}
                            disabled={!message.trim() || loading}
                            className="bg-[#53B175] hover:bg-[#53B175]/90 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors"
                        >
                            {loading ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                            ) : (
                                <>
                                    <Send size={16} />
                                    <span>Envoyer</span>
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default MessageProductOwner;

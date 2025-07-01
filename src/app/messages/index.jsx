import {useState, useEffect, useRef, useCallback, useMemo, memo} from "react";
import {Search, Send, MoreVertical, ArrowLeft, AlertCircle, Check, CheckCheck, Plus, X, UserPlus, QrCode, Scan} from "lucide-react";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import Layout from "../Layout";
import axiosConfig from "@/context/axiosConfig.js";
import {useAuth} from "@/context/AuthContext.jsx";
import {showToast} from "@/utils/toast.js";
import {useLocation, useParams, useNavigate} from "react-router";
import {PaymentModal} from "@/components/PaymentModal.jsx";
import {QRCodeDisplay} from "@/components/QRCodeDisplay.jsx";
import {QRCodeScanner} from "@/components/QRCodeScanner.jsx";
const usePolling = (callback, interval = 2000, enabled = true) => {
    const intervalRef = useRef(null);
    const callbackRef = useRef(callback);

    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    useEffect(() => {
        if (!enabled) {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
            return;
        }

        intervalRef.current = setInterval(() => {
            callbackRef.current();
        }, interval);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [interval, enabled]);
};

const useChat = (user) => {
    const [conversations, setConversations] = useState([]);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [, setLastMessageId] = useState(null);
    const [unreadCounts, setUnreadCounts] = useState({});
    const [error, setError] = useState(null);
    const [sendingMessage, setSendingMessage] = useState(false);
    const [typingUsers, setTypingUsers] = useState({});
    const [allUsers, setAllUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [pendingBooking, setPendingBooking] = useState(null);

    const loadConversations = useCallback(async () => {
        try {
            setError(null);
            const response = await axiosConfig.get('/chat/list');


            const transformedConversations = response.data.map(chat => {
                const lastMessage = chat.messages && chat.messages.length > 0
                    ? chat.messages[chat.messages.length - 1]
                    : null;

                return {
                    id: chat.id,
                    name: `${chat.relatedProduct.title} - ${chat.relatedProduct.user.email}`,
                    productTitle: chat.relatedProduct.title,
                    userEmail: chat.relatedProduct.user.email,
                    lastMessage: lastMessage ? lastMessage.content : 'Aucun message',
                    time: lastMessage
                        ? new Date(lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        : new Date(chat.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    relatedProduct: chat.relatedProduct,
                    messages: chat.messages || [],
                    booking: chat.booking
                };
            });

            setConversations(transformedConversations);
        } catch (error) {
            console.error('Error loading conversations:', error);
            setError('Impossible de charger les conversations');
        }
    }, []);


    const loadMessages = useCallback(async (chatId) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axiosConfig.get(`/chat/${chatId}/messages`);
            setMessages(response.data);

            if (response.data.length > 0) {
                setLastMessageId(response.data[response.data.length - 1].id);
            }
        } catch (error) {
            console.error('Error loading messages:', error);
            setError('Impossible de charger les messages');
        } finally {
            setLoading(false);
        }
    }, []);

    const pollNewMessages = useCallback(async (chatId) => {

        if (!chatId) {
            return;
        }

        try {
            const response = await axiosConfig.get(`/chat/${chatId}/messages`);
            const allMessages = response.data;

            setMessages(prevMessages => {
                const prevIds = new Set(prevMessages.map(msg => msg.id));
                const newMessages = allMessages.filter(msg => !prevIds.has(msg.id));

                if (newMessages.length > 0) {
                    return allMessages;
                } else {
                    return prevMessages;
                }
            });

            if (allMessages.length > 0) {
                setLastMessageId(allMessages[allMessages.length - 1].id);
            }
        } catch (error) {
            showToast.error('Error polling messages:', error);
        }
    }, []);

    const pollUnreadCounts = useCallback(async () => {
        try {
            const response = await axiosConfig.get('/chat/unread-counts');
            setUnreadCounts(response.data);
        } catch (error) {
            console.error('Error polling unread counts:', error);
        }
    }, []);

    const sendMessage = useCallback(async (chatId, content) => {
        const payload = {content, type: 'text'};

        setSendingMessage(true);
        setError(null);
        try {
            const response = await axiosConfig.post(`/chat/${chatId}/messages`, payload);

            if (response.status === 201) {
                const newMessage = response.data;

                if ((!newMessage.sender || Array.isArray(newMessage.sender) || !newMessage.sender.id) && user) {
                    newMessage.sender = {
                        id: user.id,
                        email: user.email
                    };
                }

                setMessages(prev => [...prev, newMessage]);
                setLastMessageId(newMessage.id);
            }
        } catch (error) {
            console.error('Error sending message:', error);
            setError('Impossible d\'envoyer le message');
            throw error;
        } finally {
            setSendingMessage(false);
        }
    }, [user]);

    const markAsRead = useCallback(async (chatId) => {
        try {
            await axiosConfig.post(`/chat/${chatId}/mark-read`);
            setUnreadCounts(prev => ({...prev, [chatId]: 0}));
        } catch (error) {
            console.error('Error marking as read:', error);
        }
    }, []);

    const loadAllUsers = useCallback(async () => {
        setLoadingUsers(true);
        try {
            const response = await axiosConfig.get('/user');
            setAllUsers(response.data);
        } catch (error) {
            console.error('Error loading users:', error);
            setError('Impossible de charger les utilisateurs');
        } finally {
            setLoadingUsers(false);
        }
    }, []);

    const searchUsers = useCallback((query) => {
        if (!query.trim()) {
            setFilteredUsers([]);
            return;
        }

        const filtered = allUsers.filter(user =>
            user.name?.toLowerCase().includes(query.toLowerCase()) ||
            user.email?.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredUsers(filtered);
    }, [allUsers]);

    const createConversation = useCallback(async (userId, initialMessage = '') => {
        try {
            setError(null);
            const response = await axiosConfig.post('/chat/create', {
                userId,
                message: initialMessage
            });

            await loadConversations();

            return response.data;
        } catch (error) {
            console.error('Error creating conversation:', error);
            setError('Impossible de créer la conversation');
            throw error;
        }
    }, [loadConversations]);

    const loadPendingBooking = useCallback((chatId) => {

        const conversation = conversations.find(conv => conv.id === chatId);

        if (conversation && conversation.booking) {

            // The buyer is the one who is NOT the product owner
            // If current user is the product owner, they should see booking acceptance
            const isCurrentUserProductOwner = user?.id === conversation.relatedProduct.user.id;

            if (isCurrentUserProductOwner) {
                // Transform the booking data for sellers
                const transformedBooking = {
                    id: conversation.booking.id,
                    is_confirmed: conversation.booking.isConfirmed,
                    total_price: conversation.booking.totalPrice,
                    created_at: conversation.booking.createdAt,
                    is_paid: conversation.booking.isPaid || conversation.booking.is_paid || false,
                    user_role: 'seller',
                    buyer: {
                        firstName: "Client", // Generic name since we don't have buyer details
                        name: "Client",
                        email: conversation.userEmail
                    },
                    product: {
                        id: conversation.relatedProduct.id,
                        title: conversation.relatedProduct.title,
                        user: conversation.relatedProduct.user
                    }
                };
                setPendingBooking(transformedBooking);
            } else {
                const transformedBooking = {
                    id: conversation.booking.id,
                    is_confirmed: conversation.booking.isConfirmed,
                    total_price: conversation.booking.totalPrice,
                    created_at: conversation.booking.createdAt,
                    is_paid: conversation.booking.isPaid || conversation.booking.is_paid || false,
                    user_role: 'buyer',
                    buyer: {
                        firstName: user?.firstName || user?.name || "Vous",
                        name: user?.name || "Vous",
                        email: user?.email
                    },
                    product: {
                        id: conversation.relatedProduct.id,
                        title: conversation.relatedProduct.title,
                        user: conversation.relatedProduct.user
                    }
                };
                setPendingBooking(transformedBooking);
            }
        } else {
            setPendingBooking(null);
        }
    }, [conversations, user]);

    const acceptBooking = useCallback(async (bookingId) => {
        try {
            setError(null);
            await axiosConfig.patch(`/bookings/${bookingId}/respond`, {
                action: "confirm"
            });


            setPendingBooking(prev => prev ? { ...prev, is_confirmed: true } : null);

            showToast.success('Réservation acceptée avec succès !');
            return true;
        } catch (error) {
            console.error('Error accepting booking:', error);
            setError('Impossible d\'accepter la réservation');
            showToast.error('Erreur lors de l\'acceptation de la réservation');
            return false;
        }
    }, []);

    return {
        conversations,
        setConversations,
        messages,
        loading,
        unreadCounts,
        error,
        sendingMessage,
        loadConversations,
        loadMessages,
        sendMessage,
        markAsRead,
        pollNewMessages,
        pollUnreadCounts,
        setMessages,
        setUnreadCounts,
        typingUsers,
        setTypingUsers,
        allUsers,
        filteredUsers,
        loadingUsers,
        loadAllUsers,
        searchUsers,
        createConversation,
        pendingBooking,
        setPendingBooking,
        loadPendingBooking,
        acceptBooking
    };
};

const ConversationItem = memo(({conversation, isActive, onClick, unreadCount}) => (
    <div
        className={`flex items-center p-3 cursor-pointer hover:bg-gray-50 ${isActive ? 'bg-[#53B175]/10' : ''}`}
        onClick={onClick}
    >
        <div className="relative">
            <div className="w-12 h-12 rounded-full bg-[#53B175]/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-[#53B175]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                </svg>
            </div>
            {unreadCount > 0 && (
                <span
                    className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 bg-[#53B175] text-white text-xs rounded-full">
                    {unreadCount}
                </span>
            )}
        </div>
        <div className="ml-3 flex-1 overflow-hidden">
            <div className="flex justify-between items-center">
                <h3 className="font-medium text-gray-900 truncate">{conversation.productTitle}</h3>
                <span className="text-xs text-gray-500">{conversation.time}</span>
            </div>
            <p className="text-sm text-gray-600 truncate">{conversation.userEmail}</p>
            <p className="text-xs text-gray-500 truncate">{conversation.lastMessage}</p>
        </div>
    </div>
));

const Message = memo(({message, currentUser}) => {
    const isMine = useMemo(() => message.sender?.id === currentUser?.id, [message.sender?.id, currentUser?.id]);

    const getStatusIcon = () => {
        if (!isMine) return null;
        switch (message.status) {
            case 'sent':
                return <Check size={12} className="inline ml-1" />;
            case 'delivered':
                return <CheckCheck size={12} className="inline ml-1" />;
            case 'read':
                return <CheckCheck size={12} className="inline ml-1 text-blue-400" />;
            default:
                return null;
        }
    };

    return (
        <div className={`flex mb-4 ${isMine ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs md:max-w-md rounded-lg px-4 py-2 ${
                isMine
                    ? 'bg-[#53B175] text-white rounded-br-none'
                    : 'bg-gray-100 text-gray-800 rounded-bl-none'
            }`}>
                <p>{message.content}</p>
                <div className={`text-xs mt-1 flex items-center justify-end ${
                    isMine ? 'text-white' : 'text-gray-500'
                }`}>
                    <span>
                        {new Date(message.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </span>
                    {getStatusIcon()}
                </div>
            </div>
        </div>
    );
});

const DateSeparator = memo(({ date }) => {
    const formatDate = (date) => {
        const today = new Date();
        const messageDate = new Date(date);
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (messageDate.toDateString() === today.toDateString()) {
            return "Aujourd'hui";
        } else if (messageDate.toDateString() === yesterday.toDateString()) {
            return "Hier";
        } else {
            return messageDate.toLocaleDateString('fr-FR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        }
    };

    return (
        <div className="flex items-center justify-center my-4">
            <div className="px-3 py-1 bg-gray-200 rounded-full text-xs text-gray-600">
                {formatDate(date)}
            </div>
        </div>
    );
});

const TypingIndicator = memo(({ typingUsers }) => {
    if (!typingUsers || typingUsers.length === 0) return null;

    return (
        <div className="flex items-center space-x-1 px-4 py-2 text-gray-500">
            <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
            <span className="text-sm ml-2">
                {typingUsers.length === 1
                    ? `${typingUsers[0]} écrit...`
                    : `${typingUsers.length} personnes écrivent...`}
            </span>
        </div>
    );
});

const BookingAcceptanceBanner = memo(({ booking, onAccept, isAccepting, onPayment, onShowQRCode, onShowQRScanner }) => {
    if (!booking) return null;

    const isConfirmed = booking.is_confirmed;
    const isFreeProduct = booking.total_price === 0;
    const isPaid = booking.is_paid;
    const userRole = booking.user_role;
    const buyerName = booking.buyer?.firstName || booking.buyer?.name || "le client";

    // SELLER VIEW - Confirmed booking
    if (userRole === 'seller' && isConfirmed) {
        let bannerColor, iconColor, textColor, descColor, message;
        const canScanQR = (isFreeProduct || isPaid) && !booking.is_completed;

        if (booking.is_completed) {
            bannerColor = "bg-gray-50 border-gray-400";
            iconColor = "text-gray-400";
            textColor = "text-gray-800";
            descColor = "text-gray-700";
            message = `Transaction finalisée avec ${buyerName}`;
        } else if (isFreeProduct) {
            bannerColor = "bg-blue-50 border-blue-400";
            iconColor = "text-blue-400";
            textColor = "text-blue-800";
            descColor = "text-blue-700";
            message = `Fixez une date et un lieu de récupération avec ${buyerName}`;
        } else if (isPaid) {
            bannerColor = "bg-green-50 border-green-400";
            iconColor = "text-green-400";
            textColor = "text-green-800";
            descColor = "text-green-700";
            message = `Paiement reçu ! Fixez une date et un lieu de récupération avec ${buyerName}`;
        } else {
            bannerColor = "bg-orange-50 border-orange-400";
            iconColor = "text-orange-400";
            textColor = "text-orange-800";
            descColor = "text-orange-700";
            message = `En attente du paiement de ${buyerName}`;
        }

        return (
            <div className={`${bannerColor} border-l-4 p-4 mb-4`}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <Check className={`h-5 w-5 ${iconColor}`} />
                        </div>
                        <div className="ml-3">
                            <h3 className={`text-sm font-medium ${textColor}`}>
                                {booking.is_completed ? 'Transaction finalisée' : 'Réservation confirmée'}
                            </h3>
                            <div className={`mt-1 text-sm ${descColor}`}>
                                <p>{message}</p>
                                {booking.is_completed && booking.completed_at && (
                                    <p className="text-xs mt-1">
                                        Finalisée le {new Date(booking.completed_at).toLocaleDateString('fr-FR')}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                    {canScanQR && (
                        <div className="flex-shrink-0">
                            <Button
                                onClick={() => onShowQRScanner && onShowQRScanner()}
                                className="bg-[#53B175] hover:bg-[#53B175]/90 text-white text-sm px-3 py-2 flex items-center gap-2"
                            >
                                <Scan size={16} />
                                Scanner QR
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // BUYER VIEW - Confirmed booking
    if (userRole === 'buyer' && isConfirmed) {
        let bannerColor, iconColor, textColor, descColor, message;
        const canShowQR = (isFreeProduct || isPaid) && !booking.is_completed;

        if (booking.is_completed) {
            bannerColor = "bg-gray-50 border-gray-400";
            iconColor = "text-gray-400";
            textColor = "text-gray-800";
            descColor = "text-gray-700";
            message = "Transaction finalisée ! Merci pour votre achat.";
        } else if (isFreeProduct) {
            bannerColor = "bg-blue-50 border-blue-400";
            iconColor = "text-blue-400";
            textColor = "text-blue-800";
            descColor = "text-blue-700";
            message = "Votre réservation est confirmée ! Contactez le vendeur pour organiser la récupération.";
        } else if (isPaid) {
            bannerColor = "bg-green-50 border-green-400";
            iconColor = "text-green-400";
            textColor = "text-green-800";
            descColor = "text-green-700";
            message = "Paiement effectué ! Contactez le vendeur pour organiser la récupération.";
        } else {
            bannerColor = "bg-yellow-50 border-yellow-400";
            iconColor = "text-yellow-400";
            textColor = "text-yellow-800";
            descColor = "text-yellow-700";
            message = "Votre réservation est confirmée. Procédez au paiement pour finaliser.";
        }

        return (
            <div className={`${bannerColor} border-l-4 p-4 mb-4`}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            {booking.is_completed ? (
                                <Check className={`h-5 w-5 ${iconColor}`} />
                            ) : isPaid || isFreeProduct ? (
                                <Check className={`h-5 w-5 ${iconColor}`} />
                            ) : (
                                <AlertCircle className={`h-5 w-5 ${iconColor}`} />
                            )}
                        </div>
                        <div className="ml-3">
                            <h3 className={`text-sm font-medium ${textColor}`}>
                                {booking.is_completed ? 'Transaction finalisée' : isPaid || isFreeProduct ? 'Prêt pour récupération' : 'Paiement requis'}
                            </h3>
                            <div className={`mt-1 text-sm ${descColor}`}>
                                <p>{message}</p>
                                {!isFreeProduct && !isPaid && (
                                    <p className="text-xs mt-1">Montant: {booking.total_price}€</p>
                                )}
                                {booking.is_completed && booking.completed_at && (
                                    <p className="text-xs mt-1">
                                        Finalisée le {new Date(booking.completed_at).toLocaleDateString('fr-FR')}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="flex-shrink-0 flex gap-2">
                        {!isFreeProduct && !isPaid && (
                            <Button
                                onClick={() => onPayment(booking)}
                                className="bg-[#53B175] hover:bg-[#53B175]/90 text-white text-sm px-4 py-2"
                            >
                                Payer {booking.total_price}€
                            </Button>
                        )}
                        {canShowQR && (
                            <Button
                                onClick={() => onShowQRCode && onShowQRCode(booking)}
                                className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-2 flex items-center gap-2"
                            >
                                <QrCode size={16} />
                                QR Code
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // SELLER VIEW - Pending booking (original acceptance banner)
    if (userRole === 'seller' && !isConfirmed) {
        return (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <AlertCircle className="h-5 w-5 text-yellow-400" />
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-yellow-800">
                                Nouvelle réservation en attente
                            </h3>
                            <div className="mt-1 text-sm text-yellow-700">
                                <p><strong>{buyerName}</strong> souhaite réserver <strong>{booking.product?.title}</strong></p>
                                <p className="text-xs mt-1">Prix: {booking.total_price}€</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex-shrink-0">
                        <Button
                            onClick={() => onAccept(booking.id)}
                            disabled={isAccepting}
                            className="bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2"
                        >
                            {isAccepting ? (
                                <div className="flex items-center">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Acceptation...
                                </div>
                            ) : (
                                'Accepter la réservation'
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    // BUYER VIEW - Pending booking
    if (userRole === 'buyer' && !isConfirmed) {
        return (
            <div className="bg-gray-50 border-l-4 border-gray-400 p-4 mb-4">
                <div className="flex items-center">
                    <div className="flex-shrink-0">
                        <AlertCircle className="h-5 w-5 text-gray-400" />
                    </div>
                    <div className="ml-3">
                        <h3 className="text-sm font-medium text-gray-800">
                            Réservation en attente
                        </h3>
                        <div className="mt-1 text-sm text-gray-700">
                            <p>Votre demande de réservation est en attente de confirmation par le vendeur.</p>
                            <p className="text-xs mt-1">Montant: {booking.total_price}€</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return null;
});

export default function MessagerieApp() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { chatId } = useParams();
    const location = useLocation();
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [newMessage, setNewMessage] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [isPollingEnabled, setIsPollingEnabled] = useState(true);
    const messagesEndRef = useRef(null);
    const typingTimeoutRef = useRef(null);
    const searchDebounceRef = useRef(null);
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
    const [isAcceptingBooking, setIsAcceptingBooking] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [bookingToPay, setBookingToPay] = useState(null);
    const [showQRDisplay, setShowQRDisplay] = useState(false);
    const [showQRScanner, setShowQRScanner] = useState(false);
    const [bookingForQR, setBookingForQR] = useState(null);

    const {
        conversations,
        setConversations,
        messages,
        loading,
        unreadCounts,
        error,
        sendingMessage,
        loadConversations,
        loadMessages,
        sendMessage,
        markAsRead,
        pollNewMessages,
        pollUnreadCounts,
        typingUsers,
        pendingBooking,
        setPendingBooking,
        loadPendingBooking,
        acceptBooking
    } = useChat(user);

    usePolling(
        () => {
            pollNewMessages(selectedConversation?.id);
        },
        2000,
        isPollingEnabled && selectedConversation !== null
    );

    usePolling(
        () => {
            pollUnreadCounts();
        },
        5000,
        isPollingEnabled
    );

    useEffect(() => {
        const handleVisibilityChange = () => {
            setIsPollingEnabled(!document.hidden);
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);

    const handleSelectConversation = useCallback(async (conversation) => {
        setSelectedConversation(conversation);
        await loadMessages(conversation.id);
        await markAsRead(conversation.id);
        loadPendingBooking(conversation.id);

        navigate(`/messages/${conversation.id}`, { replace: true });
    }, [loadMessages, markAsRead, loadPendingBooking, navigate]);

    useEffect(() => {
        loadConversations();
    }, [loadConversations]);

    useEffect(() => {
        if (chatId && conversations.length > 0 && !selectedConversation) {
            const conversation = conversations.find(conv => conv.id === chatId);
            if (conversation) {
                handleSelectConversation(conversation);
                loadPendingBooking(chatId);
            }
        }
    }, [chatId, conversations, selectedConversation, handleSelectConversation, loadPendingBooking]);

    useEffect(() => {
        if (location.state?.fromBooking && location.state?.productId && conversations.length > 0) {
            const productId = location.state.productId;
            const relatedConversation = conversations.find(conv =>
                conv.relatedProduct?.id === productId
            );
            if (relatedConversation && !selectedConversation) {
                handleSelectConversation(relatedConversation);
            }
        }
    }, [conversations, location.state, selectedConversation, handleSelectConversation]);


    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleTyping = useCallback(() => {
        if (!selectedConversation) return;

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }
        typingTimeoutRef.current = setTimeout(() => {
        }, 3000);
    }, [selectedConversation]);

    const handleMessageChange = useCallback((e) => {
        setNewMessage(e.target.value);
        handleTyping();
    }, [handleTyping]);

    useEffect(() => {
        if (searchDebounceRef.current) {
            clearTimeout(searchDebounceRef.current);
        }

        searchDebounceRef.current = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery);
        }, 300);

        return () => {
            if (searchDebounceRef.current) {
                clearTimeout(searchDebounceRef.current);
            }
        };
    }, [searchQuery]);



    const groupedMessages = useMemo(() => {
        const groups = [];
        let currentDate = null;

        messages.forEach((message) => {
            const messageDate = new Date(message.createdAt).toDateString();

            if (messageDate !== currentDate) {
                groups.push({ type: 'date', date: message.createdAt });
                currentDate = messageDate;
            }

            groups.push({ type: 'message', data: message });
        });

        return groups;
    }, [messages]);

    const handleSendMessage = useCallback(async () => {
        if (!newMessage.trim() || !selectedConversation || sendingMessage) return;

        try {
            await sendMessage(selectedConversation.id, newMessage);
            setNewMessage("");
        } catch (error) {
            showToast.error(error)
        }
    }, [newMessage, selectedConversation, sendMessage, sendingMessage]);

    const handleAcceptBooking = useCallback(async (bookingId) => {
        setIsAcceptingBooking(true);
        try {
            const success = await acceptBooking(bookingId);
            if (success) {
                // Mettre à jour immédiatement l'état local
                setPendingBooking(prev => {
                    if (prev && prev.id === bookingId) {
                        return { ...prev, is_confirmed: true };
                    }
                    return prev;
                });

                // Mettre à jour immédiatement les conversations
                setConversations(prev => prev.map(conv => {
                    if (conv.id === selectedConversation?.id && conv.booking && conv.booking.id === bookingId) {
                        return {
                            ...conv,
                            booking: { 
                                ...conv.booking, 
                                isConfirmed: true 
                            }
                        };
                    }
                    return conv;
                }));

                // Recharger après 3 secondes pour assurer la cohérence
                setTimeout(() => {
                    loadConversations();
                }, 3000);
            }
        } catch (error) {
            console.error('Error accepting booking:', error);
        } finally {
            setIsAcceptingBooking(false);
        }
    }, [acceptBooking, selectedConversation?.id, setConversations, loadConversations, setPendingBooking]);

    const handlePayment = useCallback((booking) => {
        setBookingToPay(booking);
        setShowPaymentModal(true);
    }, []);

    const handlePaymentSuccess = useCallback(() => {
        showToast.success('Paiement effectué avec succès !');

        // Mettre à jour immédiatement l'état local du booking
        setPendingBooking(prev => {
            if (prev && prev.id === bookingToPay?.id) {
                return { ...prev, is_paid: true };
            }
            return prev;
        });

        // Mettre à jour immédiatement les conversations pour éviter le retour en arrière
        setConversations(prev => prev.map(conv => {
            if (conv.id === selectedConversation?.id && conv.booking && conv.booking.id === bookingToPay?.id) {
                return {
                    ...conv,
                    booking: { 
                        ...conv.booking, 
                        isPaid: true, 
                        is_paid: true 
                    }
                };
            }
            return conv;
        }));

        setShowPaymentModal(false);
        setBookingToPay(null);

        // Pas besoin de recharger immédiatement, on a déjà mis à jour l'état
        // Recharger après 3 secondes pour s'assurer de la cohérence avec le serveur
        setTimeout(() => {
            loadConversations();
        }, 3000);
    }, [selectedConversation?.id, bookingToPay?.id, setConversations, loadConversations, setPendingBooking]);

    const handleClosePaymentModal = useCallback(() => {
        setShowPaymentModal(false);
        setBookingToPay(null);
    }, []);

    const handleShowQRCode = useCallback((booking) => {
        setBookingForQR(booking);
        setShowQRDisplay(true);
    }, []);

    const handleShowQRScanner = useCallback(() => {
        setShowQRScanner(true);
    }, []);

    const handleCloseQRDisplay = useCallback(() => {
        setShowQRDisplay(false);
        setBookingForQR(null);
    }, []);

    const handleCloseQRScanner = useCallback(() => {
        setShowQRScanner(false);
    }, []);

    const handleTransactionValidated = useCallback((booking) => {
        showToast.success('Transaction finalisée avec succès !');
        
        // Mettre à jour l'état local
        setPendingBooking(prev => {
            if (prev && prev.id === booking.id) {
                return { ...prev, is_completed: true, completed_at: booking.completed_at };
            }
            return prev;
        });

        // Mettre à jour les conversations
        setConversations(prev => prev.map(conv => {
            if (conv.id === selectedConversation?.id && conv.booking && conv.booking.id === booking.id) {
                return {
                    ...conv,
                    booking: { 
                        ...conv.booking, 
                        isCompleted: true,
                        is_completed: true,
                        completed_at: booking.completed_at
                    }
                };
            }
            return conv;
        }));

        setShowQRScanner(false);

        // Recharger les données après 2 secondes
        setTimeout(() => {
            loadConversations();
        }, 2000);
    }, [selectedConversation?.id, setConversations, loadConversations, setPendingBooking]);

    const filteredConversations = useMemo(() =>
        conversations.filter(conv =>
            conv.name?.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
        ), [conversations, debouncedSearchQuery]
    );

    return (
        <Layout>
            <div className="flex flex-col h-screen">
                <div className="flex flex-1 overflow-hidden">
                    <div className={`w-full md:w-80 border-r ${selectedConversation && 'hidden md:block'}`}>
                        <div className="p-4 border-b">
                            <div className="flex items-center justify-between mb-3">
                                <h1 className="text-xl font-bold text-gray-800">Messages</h1>
                            </div>
                            <div className="relative">
                                <Input
                                    type="text"
                                    placeholder="Rechercher"
                                    className="w-full pl-10"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <Search className="absolute left-3 top-2.5 text-gray-400" size={18}/>
                            </div>
                        </div>

                        <div className="overflow-y-auto h-[calc(100vh-180px)]">
                            {filteredConversations.map(conversation => (
                                <ConversationItem
                                    key={conversation.id}
                                    conversation={conversation}
                                    isActive={selectedConversation?.id === conversation.id}
                                    onClick={() => handleSelectConversation(conversation)}
                                    unreadCount={unreadCounts[conversation.id] || 0}
                                />
                            ))}
                        </div>
                    </div>

                    <div className={`flex-1 flex flex-col ${!selectedConversation && 'hidden md:flex'}`}>
                        {selectedConversation ? (
                            <>
                                <div className="flex items-center p-4 border-b">
                                    <button
                                        className="md:hidden mr-2"
                                        onClick={() => {
                                            setSelectedConversation(null);
                                            navigate('/messages', { replace: true });
                                        }}
                                    >
                                        <ArrowLeft size={20}/>
                                    </button>
                                    <div
                                        className="w-10 h-10 rounded-full bg-[#53B175]/10 flex items-center justify-center">
                                        <svg className="w-5 h-5 text-[#53B175]" fill="none" stroke="currentColor"
                                             viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                                        </svg>
                                    </div>
                                    <div className="ml-3 flex-1">
                                        <h2 className="font-medium text-gray-900">{selectedConversation.productTitle}</h2>
                                        <p className="text-xs text-gray-500">{selectedConversation.userEmail}</p>
                                        <p className="text-xs text-gray-400">
                                            {isPollingEnabled ? 'En ligne' : 'Hors ligne'}
                                        </p>
                                    </div>
                                    <button className="p-2 hover:bg-gray-100 rounded-full">
                                        <MoreVertical size={20} className="text-gray-500"/>
                                    </button>
                                </div>

                                <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                                    <BookingAcceptanceBanner
                                        booking={pendingBooking}
                                        onAccept={handleAcceptBooking}
                                        isAccepting={isAcceptingBooking}
                                        onPayment={handlePayment}
                                        onShowQRCode={handleShowQRCode}
                                        onShowQRScanner={handleShowQRScanner}
                                    />
                                    {loading ? (
                                        <div className="flex justify-center items-center h-full">
                                            <div
                                                className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#53B175]"></div>
                                        </div>
                                    ) : error ? (
                                        <div className="flex flex-col items-center justify-center h-full text-center">
                                            <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">Erreur</h3>
                                            <p className="text-gray-500 mb-4">{error}</p>
                                            <Button
                                                onClick={() => selectedConversation && loadMessages(selectedConversation.id)}
                                                variant="outline"
                                            >
                                                Réessayer
                                            </Button>
                                        </div>
                                    ) : (
                                        <>
                                            {groupedMessages.map((item, index) =>
                                                item.type === 'date' ? (
                                                    <DateSeparator key={`date-${index}`} date={item.date} />
                                                ) : (
                                                    <Message
                                                        key={item.data.id}
                                                        message={item.data}
                                                        currentUser={user}
                                                    />
                                                )
                                            )}
                                            <TypingIndicator typingUsers={typingUsers[selectedConversation?.id]} />
                                            <div ref={messagesEndRef} />
                                        </>
                                    )}
                                </div>

                                <div className="mb-8 h-12 bg-white flex items-center justify-center">
                                    <div className="relative flex-1 mx-2">
                                        <Input
                                            type="text"
                                            placeholder="Écrivez un message..."
                                            className="w-full rounded-full border-gray-200 focus:border-[#53B175] focus:ring-1 focus:ring-[#53B175] transition-all duration-200 shadow-sm hover:border-gray-300"
                                            value={newMessage}
                                            onChange={handleMessageChange}
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter') handleSendMessage();
                                            }}
                                        />
                                    </div>
                                    <div className="flex gap-1">
                                        <Button
                                            variant="default"
                                            size="icon"
                                            className="bg-[#53B175] text-white hover:bg-[#53B175]/90 transition-colors duration-200 rounded-full"
                                            onClick={handleSendMessage}
                                            disabled={sendingMessage || !newMessage.trim()}
                                        >
                                            {sendingMessage ? (
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            ) : (
                                                <Send size={20}/>
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="flex-1 flex items-center justify-center bg-gray-50">
                                <div className="text-center p-8">
                                    <h2 className="text-xl font-medium text-gray-900 mb-2">Sélectionnez une
                                        conversation</h2>
                                    <p className="text-gray-500">Choisissez une conversation dans la liste</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <PaymentModal
                isOpen={showPaymentModal}
                onClose={handleClosePaymentModal}
                booking={bookingToPay}
                onPaymentSuccess={handlePaymentSuccess}
            />

            <QRCodeDisplay
                isOpen={showQRDisplay}
                onClose={handleCloseQRDisplay}
                booking={bookingForQR}
                onTransactionComplete={handleTransactionValidated}
            />

            <QRCodeScanner
                isOpen={showQRScanner}
                onClose={handleCloseQRScanner}
                onTransactionValidated={handleTransactionValidated}
            />
        </Layout>
    );
}

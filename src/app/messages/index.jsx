import {useState, useEffect, useRef, useCallback, useMemo, memo} from "react";
import {Search, Send, Paperclip, MoreVertical, ArrowLeft, Image, AlertCircle, Check, CheckCheck, Plus, X, UserPlus} from "lucide-react";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import Layout from "../Layout";
import axiosConfig from "@/context/axiosConfig.js";
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

const useChat = () => {
    const [conversations, setConversations] = useState([]);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [lastMessageId, setLastMessageId] = useState(null);
    const [unreadCounts, setUnreadCounts] = useState({});
    const [error, setError] = useState(null);
    const [sendingMessage, setSendingMessage] = useState(false);
    const [typingUsers, setTypingUsers] = useState({});
    const [allUsers, setAllUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(false);

    const loadConversations = useCallback(async () => {
        try {
            setError(null);
            const response = await axiosConfig.get('/chat/list');
            console.log(response)

            // Transform API response to expected format
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
                    messages: chat.messages || []
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

            // Set the last message ID for polling
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
        if (!chatId || !lastMessageId) return;

        try {
            const response = await axiosConfig.get(`/chat/${chatId}/messages`, {
                params: { after: lastMessageId }
            });
            const newMessages = response.data;

            if (newMessages.length > 0) {
                setMessages(prev => [...prev, ...newMessages]);
                setLastMessageId(newMessages[newMessages.length - 1].id);
            }
        } catch (error) {
            console.error('Error polling messages:', error);
        }
    }, [lastMessageId]);

    const pollUnreadCounts = useCallback(async () => {
        try {
            const response = await axiosConfig.get('/chat/unread-counts');
            setUnreadCounts(response.data);
        } catch (error) {
            console.error('Error polling unread counts:', error);
        }
    }, []);

    const sendMessage = useCallback(async (chatId, content, type = 'text', attachments = null) => {
        const payload = {content, type};
        if (attachments) payload.attachments = attachments;

        setSendingMessage(true);
        setError(null);
        try {
            const response = await axiosConfig.post(`/chat/${chatId}/messages`, payload);

            if (response.status === 201) {
                const newMessage = response.data;
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
    }, []);

    const markAsRead = useCallback(async (chatId) => {
        try {
            await axiosConfig.post(`/chat/${chatId}/mark-read`);
            // Update unread count locally
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

    return {
        conversations,
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
        createConversation
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
                {message.attachments && message.attachments.length > 0 && (
                    <div className="mt-2">
                        {message.attachments.map((attachment, index) => (
                            <div key={index} className="text-sm opacity-80">
                                📎 {attachment.name}
                            </div>
                        ))}
                    </div>
                )}
                <div className={`text-xs mt-1 flex items-center justify-end ${
                    isMine ? 'text-[#53B175]/80' : 'text-gray-500'
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

const NewConversationModal = memo(({ isOpen, onClose, onCreateConversation, users, loadingUsers, onSearchUsers, onLoadUsers }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [initialMessage, setInitialMessage] = useState('');
    const [creating, setCreating] = useState(false);
    const searchTimeoutRef = useRef(null);

    const handleSearchChange = useCallback((e) => {
        const query = e.target.value;
        setSearchQuery(query);

        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        searchTimeoutRef.current = setTimeout(() => {
            onSearchUsers(query);
        }, 300);
    }, [onSearchUsers]);

    // Load all users when modal opens
    useEffect(() => {
        if (isOpen && onLoadUsers) {
            onLoadUsers();
        }
    }, [isOpen, onLoadUsers]);

    const handleCreateConversation = useCallback(async () => {
        if (!selectedUser) return;

        setCreating(true);
        try {
            const conversation = await onCreateConversation(selectedUser.id, initialMessage);
            onClose();
            // Reset form
            setSearchQuery('');
            setSelectedUser(null);
            setInitialMessage('');
        } catch (error) {
            // Error handled in parent component
        } finally {
            setCreating(false);
        }
    }, [selectedUser, initialMessage, onCreateConversation, onClose]);

    const handleClose = useCallback(() => {
        setSearchQuery('');
        setSelectedUser(null);
        setInitialMessage('');
        onClose();
    }, [onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">Nouvelle conversation</h2>
                    <Button variant="ghost" size="icon" onClick={handleClose}>
                        <X size={20} />
                    </Button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">
                            Rechercher un utilisateur
                        </label>
                        <div className="relative">
                            <Input
                                type="text"
                                placeholder="Nom d'utilisateur ou email..."
                                value={searchQuery}
                                onChange={handleSearchChange}
                                className="pl-10"
                            />
                            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                        </div>
                    </div>

                    {loadingUsers && (
                        <div className="flex justify-center py-2">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#53B175]"></div>
                        </div>
                    )}

                    {users.length > 0 && (
                        <div className="max-h-40 overflow-y-auto border rounded-md">
                            {users.map(user => (
                                <div
                                    key={user.id}
                                    className={`p-3 cursor-pointer hover:bg-gray-50 flex items-center space-x-3 ${
                                        selectedUser?.id === user.id ? 'bg-[#53B175]/10' : ''
                                    }`}
                                    onClick={() => setSelectedUser(user)}
                                >
                                    <div className="w-8 h-8 rounded-full bg-[#53B175]/10 flex items-center justify-center">
                                        <UserPlus size={16} className="text-[#53B175]" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm">{user.name}</p>
                                        <p className="text-xs text-gray-500">{user.email}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {selectedUser && (
                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-2 block">
                                Message initial (optionnel)
                            </label>
                            <textarea
                                placeholder="Écrivez votre premier message..."
                                value={initialMessage}
                                onChange={(e) => setInitialMessage(e.target.value)}
                                className="w-full p-3 border rounded-md resize-none focus:border-[#53B175] focus:ring-1 focus:ring-[#53B175]"
                                rows={3}
                            />
                        </div>
                    )}

                    <div className="flex space-x-3 pt-4">
                        <Button
                            variant="outline"
                            onClick={handleClose}
                            className="flex-1"
                        >
                            Annuler
                        </Button>
                        <Button
                            onClick={handleCreateConversation}
                            disabled={!selectedUser || creating}
                            className="flex-1 bg-[#53B175] hover:bg-[#53B175]/90"
                        >
                            {creating ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            ) : null}
                            Créer
                        </Button>
                    </div>
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

export default function MessagerieApp() {
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [newMessage, setNewMessage] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [currentUser, setCurrentUser] = useState(null);
    const [isPollingEnabled, setIsPollingEnabled] = useState(true);
    const messagesEndRef = useRef(null);
    const typingTimeoutRef = useRef(null);
    const fileInputRef = useRef(null);
    const [uploadingFile, setUploadingFile] = useState(false);
    const searchDebounceRef = useRef(null);
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
    const [showNewConversationModal, setShowNewConversationModal] = useState(false);

    const {
        conversations,
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
        setUnreadCounts,
        typingUsers,
        setTypingUsers,
        allUsers,
        filteredUsers,
        loadingUsers,
        loadAllUsers,
        searchUsers,
        createConversation
    } = useChat();

    usePolling(
        () => pollNewMessages(selectedConversation?.id),
        2000,
        isPollingEnabled && selectedConversation !== null
    );

    usePolling(
        pollUnreadCounts,
        5000,
        isPollingEnabled
    );

    // Stop polling when page is not visible
    useEffect(() => {
        const handleVisibilityChange = () => {
            setIsPollingEnabled(!document.hidden);
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);

    useEffect(() => {
        loadConversations();
    }, [loadConversations]);

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

    // Handle file upload
    const handleFileUpload = useCallback(async (file) => {
        if (!selectedConversation || !file) return;

        setUploadingFile(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('type', 'file');

            // In a real app, you'd upload the file first and get a URL
            // For now, we'll simulate with the file name
            await sendMessage(selectedConversation.id, `Fichier: ${file.name}`, 'file', [{
                name: file.name,
                size: file.size,
                type: file.type
            }]);
        } catch (error) {
            console.error('Error uploading file:', error);
        } finally {
            setUploadingFile(false);
        }
    }, [selectedConversation, sendMessage]);

    const handleFileSelect = useCallback(() => {
        fileInputRef.current?.click();
    }, []);

    const handleFileChange = useCallback((e) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFileUpload(file);
        }
    }, [handleFileUpload]);

    const handleCreateConversation = useCallback(async (userId, initialMessage) => {
        const conversation = await createConversation(userId, initialMessage);
        if (conversation) {
            setSelectedConversation(conversation);
            if (conversation.id) {
                await loadMessages(conversation.id);
            }
        }
        return conversation;
    }, [createConversation, loadMessages]);

    // Group messages by date
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

    const handleSelectConversation = async (conversation) => {
        setSelectedConversation(conversation);
        await loadMessages(conversation.id);
        await markAsRead(conversation.id);
    };

    const handleSendMessage = useCallback(async () => {
        if (!newMessage.trim() || !selectedConversation || sendingMessage) return;

        try {
            await sendMessage(selectedConversation.id, newMessage);
            setNewMessage("");
        } catch (error) {
            // Error is already handled in sendMessage
        }
    }, [newMessage, selectedConversation, sendMessage, sendingMessage]);

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
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setShowNewConversationModal(true)}
                                    className="text-[#53B175] hover:bg-[#53B175]/10"
                                >
                                    <Plus size={20} />
                                </Button>
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
                                        onClick={() => setSelectedConversation(null)}
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
                                                        currentUser={currentUser}
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
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        className="hidden"
                                        accept="*/*"
                                    />
                                    <div className="flex gap-1">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-gray-500 hover:text-[#53B175] hover:bg-[#53B175]/10 transition-colors duration-200"
                                            onClick={handleFileSelect}
                                            disabled={uploadingFile}
                                        >
                                            {uploadingFile ? (
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500"></div>
                                            ) : (
                                                <Paperclip size={20}/>
                                            )}
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-gray-500 hover:text-[#53B175] hover:bg-[#53B175]/10 transition-colors duration-200"
                                            onClick={handleFileSelect}
                                        >
                                            <Image size={20}/>
                                        </Button>
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

            <NewConversationModal
                isOpen={showNewConversationModal}
                onClose={() => setShowNewConversationModal(false)}
                onCreateConversation={handleCreateConversation}
                users={filteredUsers}
                loadingUsers={loadingUsers}
                onSearchUsers={searchUsers}
                onLoadUsers={loadAllUsers}
            />
        </Layout>
    );
}

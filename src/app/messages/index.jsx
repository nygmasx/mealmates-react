import {useState, useEffect, useRef} from "react";
import {Search, Send, Paperclip, MoreVertical, ArrowLeft, Image} from "lucide-react";
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

    const loadConversations = async () => {
        try {
            const response = await axiosConfig.get('/chat/list');
            setConversations(response.data);
        } catch (error) {
            console.error('Error loading conversations:', error);
        }
    };

    const loadMessages = async (chatId) => {
        setLoading(true);
        try {
            const response = await axiosConfig.get(`/chat/${chatId}/messages`);
            setMessages(response.data);

            // Set the last message ID for polling
            if (response.data.length > 0) {
                setLastMessageId(response.data[response.data.length - 1].id);
            }
        } catch (error) {
            console.error('Error loading messages:', error);
        } finally {
            setLoading(false);
        }
    };

    const pollNewMessages = async (chatId) => {
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
    };

    const pollUnreadCounts = async () => {
        try {
            const response = await axiosConfig.get('/chat/unread-counts');
            setUnreadCounts(response.data);
        } catch (error) {
            console.error('Error polling unread counts:', error);
        }
    };

    const sendMessage = async (chatId, content, type = 'text', attachments = null) => {
        const payload = {content, type};
        if (attachments) payload.attachments = attachments;

        try {
            const response = await axiosConfig.post(`/chat/${chatId}/messages`, payload);

            if (response.status === 201) {
                const newMessage = response.data;
                setMessages(prev => [...prev, newMessage]);
                setLastMessageId(newMessage.id);
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const markAsRead = async (chatId) => {
        try {
            await axiosConfig.post(`/chat/${chatId}/mark-read`);
            // Update unread count locally
            setUnreadCounts(prev => ({...prev, [chatId]: 0}));
        } catch (error) {
            console.error('Error marking as read:', error);
        }
    };

    return {
        conversations,
        messages,
        loading,
        unreadCounts,
        loadConversations,
        loadMessages,
        sendMessage,
        markAsRead,
        pollNewMessages,
        pollUnreadCounts,
        setMessages,
        setUnreadCounts
    };
};

const ConversationItem = ({conversation, isActive, onClick, unreadCount}) => (
    <div
        className={`flex items-center p-3 cursor-pointer hover:bg-gray-50 ${isActive ? 'bg-[#53B175]/10' : ''}`}
        onClick={onClick}
    >
        <div className="relative">
            <div className="w-12 h-12 rounded-full bg-[#53B175]/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-[#53B175]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
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
                <h3 className="font-medium text-gray-900">{conversation.name}</h3>
                <span className="text-xs text-gray-500">{conversation.time}</span>
            </div>
            <p className="text-sm text-gray-500 truncate">{conversation.lastMessage}</p>
        </div>
    </div>
);

const Message = ({message, currentUser}) => {
    const isMine = message.sender?.id === currentUser?.id;

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
                <span className={`text-xs block mt-1 ${
                    isMine ? 'text-[#53B175]/80' : 'text-gray-500'
                }`}>
                    {new Date(message.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                    })}
                </span>
            </div>
        </div>
    );
};

export default function MessagerieApp() {
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [newMessage, setNewMessage] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [currentUser, setCurrentUser] = useState(null);
    const [isPollingEnabled, setIsPollingEnabled] = useState(true);

    const {
        conversations,
        messages,
        loading,
        unreadCounts,
        loadConversations,
        loadMessages,
        sendMessage,
        markAsRead,
        pollNewMessages,
        pollUnreadCounts,
        setUnreadCounts
    } = useChat();

    // Poll for new messages in the selected conversation
    usePolling(
        () => pollNewMessages(selectedConversation?.id),
        2000, // Poll every 2 seconds
        isPollingEnabled && selectedConversation !== null
    );

    // Poll for unread counts
    usePolling(
        pollUnreadCounts,
        5000, // Poll every 5 seconds
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
    }, []);

    const handleSelectConversation = async (conversation) => {
        setSelectedConversation(conversation);
        await loadMessages(conversation.id);
        await markAsRead(conversation.id);
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !selectedConversation) return;

        await sendMessage(selectedConversation.id, newMessage);
        setNewMessage("");
    };

    const filteredConversations = conversations.filter(conv =>
        conv.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Layout>
            <div className="flex flex-col h-screen">
                <div className="flex flex-1 overflow-hidden">
                    <div className={`w-full md:w-80 border-r ${selectedConversation && 'hidden md:block'}`}>
                        <div className="p-4 border-b">
                            <h1 className="text-xl font-bold text-gray-800">Messages</h1>
                            <div className="mt-3 relative">
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
                                        <h2 className="font-medium text-gray-900">{selectedConversation.name}</h2>
                                        <p className="text-xs text-gray-500">
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
                                    ) : (
                                        messages.map(message => (
                                            <Message
                                                key={message.id}
                                                message={message}
                                                currentUser={currentUser}
                                            />
                                        ))
                                    )}
                                </div>

                                <div className="mb-8 h-12 bg-white flex items-center justify-center">
                                    <div className="relative flex-1 mx-2">
                                        <Input
                                            type="text"
                                            placeholder="Écrivez un message..."
                                            className="w-full rounded-full border-gray-200 focus:border-[#53B175] focus:ring-1 focus:ring-[#53B175] transition-all duration-200 shadow-sm hover:border-gray-300"
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter') handleSendMessage();
                                            }}
                                        />
                                    </div>
                                    <div className="flex gap-1">
                                        <Button variant="ghost" size="icon"
                                                className="text-gray-500 hover:text-[#53B175] hover:bg-[#53B175]/10 transition-colors duration-200">
                                            <Paperclip size={20}/>
                                        </Button>
                                        <Button variant="ghost" size="icon"
                                                className="text-gray-500 hover:text-[#53B175] hover:bg-[#53B175]/10 transition-colors duration-200">
                                            <Image size={20}/>
                                        </Button>
                                        <Button
                                            variant="default"
                                            size="icon"
                                            className="bg-[#53B175] text-white hover:bg-[#53B175]/90 transition-colors duration-200 rounded-full"
                                            onClick={handleSendMessage}
                                        >
                                            <Send size={20}/>
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
        </Layout>
    );
}

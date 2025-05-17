import { useState } from "react";
import { Search, Send, Paperclip, MoreVertical, ArrowLeft, Image } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Layout from "../Layout";

const conversationsData = [
  {
    id: 1,
    name: "Marché Bio Local",
    lastMessage: "Votre commande de fruits et légumes est prête à être récupérée",
    time: "14:30",
    unread: 2
  },
  {
    id: 2,
    name: "Boulangerie du Centre",
    lastMessage: "Nous avons des invendus disponibles pour ce soir",
    time: "12:15",
    unread: 0
  },
  {
    id: 3,
    name: "Groupe Anti-Gaspillage",
    lastMessage: "Sophie: Nouvelle collecte prévue demain matin",
    time: "Hier",
    unread: 5
  },
  {
    id: 4,
    name: "Supermarché Éco",
    lastMessage: "Merci pour votre participation à notre programme anti-gaspillage !",
    time: "Mer",
    unread: 0
  },
  {
    id: 5,
    name: "Restaurant Le Vert",
    lastMessage: "Vos paniers repas sont prêts pour la collecte",
    time: "Lun",
    unread: 0
  }
];

const messagesData = [
  { id: 1, sender: "Marché Bio Local", content: "Bonjour ! Nous avons des fruits et légumes disponibles à prix réduit.", time: "14:10", isMine: false },
  { id: 2, sender: "Moi", content: "Bonjour ! Quels produits avez-vous encore ?", time: "14:12", isMine: true },
  { id: 3, sender: "Marché Bio Local", content: "Nous avons des pommes, des poires et des légumes de saison. Voulez-vous venir les récupérer aujourd'hui ?", time: "14:20", isMine: false },
  { id: 4, sender: "Moi", content: "Oui, je peux passer vers 18h. Combien de paniers reste-t-il ?", time: "14:25", isMine: true },
  { id: 5, sender: "Marché Bio Local", content: "Votre commande de fruits et légumes est prête à être récupérée", time: "14:30", isMine: false }
];

const ConversationItem = ({ conversation, isActive, onClick }) => {
  return (
    <div 
      className={`flex items-center p-3 cursor-pointer hover:bg-gray-50 ${isActive ? 'bg-[#53B175]/10' : ''}`}
      onClick={onClick}
    >
      <div className="relative">
        <div className="w-12 h-12 rounded-full bg-[#53B175]/10 flex items-center justify-center">
          <svg className="w-6 h-6 text-[#53B175]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        {conversation.unread > 0 && (
          <span className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 bg-[#53B175] text-white text-xs rounded-full">
            {conversation.unread}
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
};

const Message = ({ message }) => {
  return (
    <div className={`flex mb-4 ${message.isMine ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-xs md:max-w-md rounded-lg px-4 py-2 ${message.isMine ? 'bg-[#53B175] text-white rounded-br-none' : 'bg-gray-100 text-gray-800 rounded-bl-none'}`}>
        <p>{message.content}</p>
        <span className={`text-xs block mt-1 ${message.isMine ? 'text-[#53B175]/80' : 'text-gray-500'}`}>{message.time}</span>
      </div>
    </div>
  );
};

export default function MessagerieApp() {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [conversations, setConversations] = useState(conversationsData);
  const [messages, setMessages] = useState(messagesData);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
    const updatedConversations = conversations.map(conv => 
      conv.id === conversation.id ? { ...conv, unread: 0 } : conv
    );
    setConversations(updatedConversations);
  };

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;
    
    const newMsg = {
      id: messages.length + 1,
      sender: "Moi",
      content: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMine: true
    };
    
    setMessages([...messages, newMsg]);
    setNewMessage("");
  };

  const filteredConversations = conversations.filter(conv => 
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
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
                <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
              </div>
            </div>
            
            <div className="overflow-y-auto h-[calc(100vh-180px)]">
              {filteredConversations.map(conversation => (
                <ConversationItem 
                  key={conversation.id} 
                  conversation={conversation}
                  isActive={selectedConversation?.id === conversation.id}
                  onClick={() => handleSelectConversation(conversation)}
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
                    <ArrowLeft size={20} />
                  </button>
                  <div className="w-10 h-10 rounded-full bg-[#53B175]/10 flex items-center justify-center">
                    <svg className="w-5 h-5 text-[#53B175]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div className="ml-3 flex-1">
                    <h2 className="font-medium text-gray-900">{selectedConversation.name}</h2>
                    <p className="text-xs text-gray-500">En ligne</p>
                  </div>
                  <button className="p-2 hover:bg-gray-100 rounded-full">
                    <MoreVertical size={20} className="text-gray-500" />
                  </button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                  {messages.map(message => (
                    <Message key={message.id} message={message} />
                  ))}
                </div>

                <div className="mb-8 h-12 bg-white flex items-center justify-center">
                  <div className="relative flex-1 mx-2">
                    <Input
                      type="text"
                      placeholder="Écrivez un message..."
                      className="w-full rounded-full border-gray-200 focus:border-[#53B175] focus:ring-1 focus:ring-[#53B175] transition-all duration-200 ease-in-out shadow-sm hover:border-gray-300"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') handleSendMessage();
                      }}
                    />
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="text-gray-500 hover:text-[#53B175] hover:bg-[#53B175]/10 transition-colors duration-200">
                      <Paperclip size={20} />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-gray-500 hover:text-[#53B175] hover:bg-[#53B175]/10 transition-colors duration-200">
                      <Image size={20} />
                    </Button>
                    <Button 
                      variant="default"
                      size="icon"
                      className="bg-[#53B175] text-white hover:bg-[#53B175]/90 transition-colors duration-200 rounded-full"
                      onClick={handleSendMessage}
                    >
                      <Send size={20} />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center bg-gray-50">
                <div className="text-center p-8">
                  <h2 className="text-xl font-medium text-gray-900 mb-2">Sélectionnez une conversation</h2>
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

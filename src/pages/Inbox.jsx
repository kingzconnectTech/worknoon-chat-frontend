import { useEffect, useState } from 'react';
import { Search, Plus, MessageSquare, X, User, Shield, Briefcase, Loader2, Sun, Moon } from 'lucide-react';
import useChatStore from '../store/useChatStore';
import useAuthStore from '../store/useAuthStore';
import useThemeStore from '../store/useThemeStore';
import socketService from '../socket/socketService';
import api from '../services/api';
import ChatCard from '../components/ChatCard';
import ChatWindow from '../components/ChatWindow';
import clsx from 'clsx';

const recipientOptions = [
  { type: 'agent', icon: Shield, title: 'Customer Service Agent', description: 'Get help from an available agent', color: 'blue' },
  { type: 'merchant', icon: Briefcase, title: 'Merchant', description: 'Chat with your preferred merchant', color: 'amber' },
  { type: 'designer', icon: User, title: 'Designer', description: 'Chat with your preferred designer', color: 'pink' }
];

const Inbox = () => {
  const { 
    conversations, 
    fetchConversations, 
    activeConversation, 
    setActiveConversation,
    onlineUsers
  } = useChatStore();
  
  const { user, isAuthenticated } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [showRecipientModal, setShowRecipientModal] = useState(false);
  const [routing, setRouting] = useState(false);
  const [routingError, setRoutingError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      fetchConversations();
    }
  }, [isAuthenticated]);

  const filteredConversations = conversations.filter(conv => {
    const otherParticipant = conv.participants?.find(p => p._id !== user._id);
    if (!otherParticipant) return false;
    return otherParticipant.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleStartNewChat = async (recipientType) => {
    setRouting(true);
    setRoutingError('');
    try {
      const res = await api.post('/routing/chat', { recipientType });
      setActiveConversation(res.data.data.conversation);
      setShowRecipientModal(false);
      fetchConversations();
    } catch (err) {
      setRoutingError(err.response?.data?.message || 'Failed to start chat');
    } finally {
      setRouting(false);
    }
  };

  return (
    <div className="flex h-full w-full">
      {/* Conversations Sidebar */}
      <div className={clsx(
        "w-full md:w-80 lg:w-96 flex flex-col border-r",
        theme === "dark" 
          ? "border-white/5 bg-card/50" 
          : "border-slate-100 bg-slate-50/30",
        activeConversation ? 'hidden md:flex' : 'flex'
      )}>
        
        {/* Header */}
        <div className={clsx(
          "p-6 border-b",
          theme === "dark" ? "border-white/5" : "border-slate-100"
        )}>
          <div className="flex items-center justify-between mb-6">
            <h1 className={clsx("text-2xl font-bold", theme === "dark" ? "text-text" : "text-slate-900")}>Messages</h1>
            <div className="flex items-center gap-2">
              <button 
                onClick={toggleTheme}
                className={clsx(
                  "p-2 rounded-xl transition-colors",
                  theme === "dark"
                    ? "text-muted hover:bg-white/5 hover:text-white"
                    : "text-muted-light hover:bg-slate-100 hover:text-slate-900"
                )}
              >
                {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button 
                onClick={() => setShowRecipientModal(true)}
                className="p-2 rounded-xl bg-accent/20 text-accent hover:bg-accent/30 transition-colors"
              >
                <Plus size={20} />
              </button>
            </div>
          </div>
          
          <div className="relative">
            <Search className={clsx("absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5", theme === "dark" ? "text-muted" : "text-muted-light")} />
            <input 
              type="text" 
              placeholder="Search messages..." 
              className={clsx(
                "w-full pl-10 pr-4 py-2.5 rounded-xl border focus:outline-none focus:border-accent transition-colors",
                theme === "dark" 
                  ? "bg-background border-white/5 text-text" 
                  : "bg-white border-slate-200 text-slate-900"
              )}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto scrollbar-custom p-4 space-y-2">
          {filteredConversations.length === 0 ? (
            <div className={clsx("text-center mt-10", theme === "dark" ? "text-muted" : "text-muted-light")}>No conversations found.</div>
          ) : (
            filteredConversations.map(conv => {
              const otherParticipant = conv.participants?.find(p => p._id !== user._id);
              const isOnline = onlineUsers.includes(otherParticipant?._id);
              
              return (
                <ChatCard 
                  key={conv._id}
                  conversation={conv}
                  otherParticipant={otherParticipant}
                  isActive={activeConversation?._id === conv._id}
                  isOnline={isOnline}
                  onClick={() => {
                    setActiveConversation(conv);
                    socketService.joinConversation(conv._id);
                  }}
                />
              );
            })
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className={`flex-1 flex flex-col ${!activeConversation ? 'hidden md:flex' : 'flex'}`}>
        {activeConversation ? (
          <ChatWindow />
        ) : (
          <div className={clsx(
            "flex-1 flex flex-col items-center justify-center",
            theme === "dark" ? "bg-background/50" : "bg-slate-50/30"
          )}>
            <div className={clsx(
              "w-24 h-24 mb-6 rounded-full flex items-center justify-center shadow-lg border",
              theme === "dark" 
                ? "bg-card border-white/5" 
                : "bg-white border-slate-200"
            )}>
              <MessageSquare className={clsx("h-10 w-10", theme === "dark" ? "text-muted" : "text-muted-light")} />
            </div>
            <h3 className={clsx("text-2xl font-semibold mb-2", theme === "dark" ? "text-text" : "text-slate-900")}>Your Messages</h3>
            <p className={clsx("mb-6", theme === "dark" ? "text-muted" : "text-muted-light")}>Select a conversation or start a new one</p>
            <button
              onClick={() => setShowRecipientModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-accent to-purple-500 text-white rounded-xl font-semibold hover:opacity-90 transition-all shadow-lg shadow-accent/20"
            >
              <Plus size={20} />
              Start New Chat
            </button>
          </div>
        )}
      </div>

      {/* Recipient Selection Modal */}
      {showRecipientModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className={clsx(
            "rounded-3xl p-8 w-full max-w-lg relative",
            theme === "dark" ? "glass-card" : "glass-card-light"
          )}>
            <button
              onClick={() => { setShowRecipientModal(false); setRoutingError(''); }}
              className={clsx(
                "absolute top-5 right-5 p-2 rounded-xl transition-colors",
                theme === "dark" 
                  ? "text-muted hover:text-white hover:bg-white/10" 
                  : "text-muted-light hover:text-slate-700 hover:bg-slate-100"
              )}
            >
              <X size={20} />
            </button>

            <div className="mb-6">
              <h3 className={clsx("text-2xl font-bold mb-1", theme === "dark" ? "text-text" : "text-slate-900")}>Start New Chat</h3>
              <p className={clsx("text-sm", theme === "dark" ? "text-muted" : "text-muted-light")}>Select who you'd like to chat with</p>
            </div>

            {routingError && (
              <p className={clsx(
                "text-sm rounded-xl px-4 py-3 mb-4 border",
                theme === "dark" 
                  ? "text-red-400 bg-red-500/10 border-red-500/20" 
                  : "text-red-600 bg-red-50 border-red-200"
              )}>{routingError}</p>
            )}

            <div className="space-y-4">
              {recipientOptions.map(({ type, icon: Icon, title, description, color }) => (
                <button
                  key={type}
                  onClick={() => handleStartNewChat(type)}
                  disabled={routing}
                  className={clsx(
                    "w-full flex items-center gap-4 p-4 rounded-2xl transition-all disabled:opacity-70",
                    theme === "dark" 
                      ? "bg-card border border-white/10 hover:bg-white/5" 
                      : "bg-white border border-slate-200 hover:bg-slate-50"
                  )}
                >
                  <div className={clsx("p-3 rounded-xl", {
                    "bg-blue-500/15 text-blue-400": color === "blue",
                    "bg-amber-500/15 text-amber-400": color === "amber",
                    "bg-pink-500/15 text-pink-400": color === "pink"
                  })}>
                    <Icon size={24} />
                  </div>
                  <div className="flex-1 text-left">
                    <h4 className={clsx("font-semibold", theme === "dark" ? "text-text" : "text-slate-900")}>{title}</h4>
                    <p className={clsx("text-sm", theme === "dark" ? "text-muted" : "text-muted-light")}>{description}</p>
                  </div>
                  {routing && <Loader2 size={20} className={clsx("animate-spin", theme === "dark" ? "text-muted" : "text-muted-light")} />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inbox;

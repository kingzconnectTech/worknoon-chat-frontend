import { useEffect, useRef } from 'react';
import useChatStore from '../store/useChatStore';
import useAuthStore from '../store/useAuthStore';
import useThemeStore from '../store/useThemeStore';
import { MoreVertical } from 'lucide-react';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import clsx from 'clsx';

const ChatWindow = () => {
  const { activeConversation, messages, onlineUsers, typingUsers } = useChatStore();
  const { user } = useAuthStore();
  const { theme } = useThemeStore();
  const messagesEndRef = useRef(null);

  const userIdStr = user?._id?.toString() || '';
  const otherParticipant = activeConversation?.participants?.find(p => p._id.toString() !== userIdStr);
  const otherParticipantId = otherParticipant?._id?.toString() || '';
  const isOnline = otherParticipant && onlineUsers.some(id => id.toString() === otherParticipantId);
  const isTypingSet = typingUsers[activeConversation?._id];
  const isTyping = isTypingSet && Array.from(isTypingSet).some(id => id.toString() === otherParticipantId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  if (!activeConversation) return null;

  return (
    <div className={clsx(
      "flex-1 flex flex-col h-full relative",
      theme === "dark" ? "bg-background" : "bg-white"
    )}>
      {/* Header */}
      <div className={clsx(
        "h-20 px-6 flex items-center justify-between border-b z-10",
        theme === "dark" ? "border-white/5 glass" : "border-slate-100 glass-light"
      )}>
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className={clsx(
              "w-10 h-10 rounded-full overflow-hidden flex items-center justify-center",
              theme === "dark" ? "bg-slate-700" : "bg-slate-100"
            )}>
              {otherParticipant?.avatar ? (
                <img src={otherParticipant.avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className={clsx("font-medium", theme === "dark" ? "text-white" : "text-slate-700")}>{otherParticipant?.name?.charAt(0) || '?'}</span>
              )}
            </div>
            {isOnline && (
              <div className={clsx(
                "absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2",
                theme === "dark" ? "border-card" : "border-white"
              )} />
            )}
          </div>
          <div>
            <h3 className={clsx("font-semibold text-lg", theme === "dark" ? "text-white" : "text-slate-900")}>{otherParticipant?.name || 'Unknown User'}</h3>
            <p className={clsx("text-xs", theme === "dark" ? "text-muted" : "text-muted-light")}>
              {isTyping ? <span className="text-accent animate-pulse">Typing...</span> : (isOnline ? 'Online' : 'Offline')}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button className={clsx(
            "p-2.5 rounded-xl transition-colors",
            theme === "dark" 
              ? "text-muted hover:text-white hover:bg-white/5" 
              : "text-muted-light hover:text-slate-700 hover:bg-slate-50"
          )}>
            <MoreVertical size={20} />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto scrollbar-custom p-6 space-y-6">
        {messages.map((msg, index) => {
          const userIdStr = user?._id?.toString() || '';
          let isOwn = false;
          if (msg.sender && typeof msg.sender === 'object' && msg.sender._id) {
            isOwn = msg.sender._id.toString() === userIdStr;
          } else if (typeof msg.sender === 'string') {
            isOwn = msg.sender.toString() === userIdStr;
          } else if (msg.senderId) {
            isOwn = msg.senderId.toString() === userIdStr;
          }
          return (
            <MessageBubble 
              key={msg._id || index} 
              message={msg} 
              isOwn={isOwn} 
            />
          );
        })}
        
        {isTyping && (
          <div className={clsx("flex items-end gap-2", theme === "dark" ? "text-muted" : "text-muted-light")}>
            <div className={clsx(
              "w-8 h-8 rounded-full overflow-hidden flex-shrink-0",
              theme === "dark" ? "bg-slate-700" : "bg-slate-100"
            )}>
               {otherParticipant?.avatar ? (
                  <img src={otherParticipant.avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className={clsx("font-medium text-xs flex h-full items-center justify-center", theme === "dark" ? "text-white" : "text-slate-700")}>{otherParticipant?.name?.charAt(0) || '?'}</span>
                )}
            </div>
            <div className={clsx(
              "px-4 py-3 rounded-2xl flex items-center gap-1",
              theme === "dark" 
                ? "bg-card rounded-bl-sm" 
                : "bg-slate-100 rounded-bl-sm border border-slate-200"
            )}>
              <div className={clsx("w-1.5 h-1.5 rounded-full animate-bounce", theme === "dark" ? "bg-muted" : "bg-muted-light")} style={{ animationDelay: '0ms' }} />
              <div className={clsx("w-1.5 h-1.5 rounded-full animate-bounce", theme === "dark" ? "bg-muted" : "bg-muted-light")} style={{ animationDelay: '150ms' }} />
              <div className={clsx("w-1.5 h-1.5 rounded-full animate-bounce", theme === "dark" ? "bg-muted" : "bg-muted-light")} style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <MessageInput />
    </div>
  );
};

export default ChatWindow;

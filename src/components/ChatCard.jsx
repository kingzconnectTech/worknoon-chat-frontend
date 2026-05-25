import { formatDistanceToNow } from 'date-fns';
import clsx from 'clsx';
import useThemeStore from '../store/useThemeStore';

const ChatCard = ({ conversation, otherParticipant, isActive, isOnline, onClick }) => {
  const lastMessage = conversation.lastMessage;
  const { theme } = useThemeStore();
  const timeString = lastMessage?.createdAt 
    ? formatDistanceToNow(new Date(lastMessage.createdAt), { addSuffix: true }) 
    : '';

  return (
    <div 
      onClick={onClick}
      className={clsx(
        'relative p-4 rounded-2xl cursor-pointer transition-all duration-200 group',
        isActive 
          ? 'bg-accent shadow-lg shadow-accent/20' 
          : theme === "dark" 
            ? 'hover:bg-white/5' 
            : 'hover:bg-slate-50'
      )}
    >
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <div className={clsx(
            "w-12 h-12 rounded-full overflow-hidden flex items-center justify-center border-2 border-transparent group-hover:transition-colors",
            theme === "dark" 
              ? "bg-slate-700 group-hover:border-white/10" 
              : "bg-slate-100 group-hover:border-slate-200"
          )}>
            {otherParticipant?.avatar ? (
              <img src={otherParticipant.avatar} alt={otherParticipant.name} className="w-full h-full object-cover" />
            ) : (
              <span className={clsx(
                "text-lg font-medium",
                theme === "dark" ? "text-white" : "text-slate-700"
              )}>
                {otherParticipant?.name?.charAt(0) || '?'}
              </span>
            )}
          </div>
          {isOnline && (
            <div className={clsx(
              "absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2",
              theme === "dark" ? "border-card" : "border-white"
            )} />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-baseline mb-1">
            <h4 className={clsx("font-semibold truncate pr-2", 
              isActive 
                ? "text-white" 
                : theme === "dark" 
                  ? "text-slate-200" 
                  : "text-slate-800"
            )}>
              {otherParticipant?.name || 'Unknown User'}
            </h4>
            <span className={clsx("text-xs whitespace-nowrap", 
              isActive 
                ? "text-white/80" 
                : theme === "dark" 
                  ? "text-muted" 
                  : "text-muted-light"
            )}>
              {timeString}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <p className={clsx("text-sm truncate", 
              isActive 
                ? "text-white/90" 
                : theme === "dark" 
                  ? "text-muted" 
                  : "text-muted-light"
            )}>
              {lastMessage?.content || 'Started a conversation'}
            </p>
            {/* Unread Badge (Mocked for now) */}
            {conversation.unreadCount > 0 && (
              <span className="ml-2 flex-shrink-0 inline-flex items-center justify-center h-5 min-w-[20px] px-1.5 rounded-full text-xs font-bold"
                style={{ 
                  background: theme === "dark" ? 'white' : '#7C3AED', 
                  color: theme === "dark" ? '#7C3AED' : 'white' 
                }}
              >
                {conversation.unreadCount}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatCard;

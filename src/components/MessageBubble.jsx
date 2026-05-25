import { format } from 'date-fns';
import clsx from 'clsx';
import useThemeStore from '../store/useThemeStore';
import { Check, CheckCheck, FileText, Download } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const MessageBubble = ({ message, isOwn }) => {
  const { theme } = useThemeStore();
  const timeString = message.createdAt ? format(new Date(message.createdAt), 'HH:mm') : '';

  return (
    <div className={clsx(
      "flex w-full mb-6 md:mb-8",
      isOwn ? "justify-end pr-3 md:pr-6" : "justify-start pl-3 md:pl-6"
    )}>
      <div className={clsx(
        "max-w-[85%] sm:max-w-[75%] md:max-w-[65%] lg:max-w-[55%] flex flex-col group relative",
        isOwn ? "items-end" : "items-start"
      )}>
        
        {/* Message Content */}
        <div className={clsx(
          "px-5 sm:px-6 py-3 sm:py-3.5 rounded-2xl shadow-md text-[15px] leading-relaxed break-words",
          isOwn 
            ? "bg-accent text-white rounded-br-none shadow-accent/30" 
            : theme === "dark" 
              ? "bg-card text-slate-100 rounded-bl-none border border-white/10 shadow-black/20"
              : "bg-slate-100 text-slate-800 rounded-bl-none border border-slate-200 shadow-slate-200/50"
        )}>
          {message.text}
          
          {/* Attachments */}
          {message.attachments && message.attachments.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {message.attachments.map((attach, idx) => {
                const isImage = attach.match(/\.(jpeg|jpg|gif|png|webp)$/i);
                const fileUrl = attach.startsWith('http') ? attach : `${API_URL}/${attach}`;
                const fileName = attach.split('/').pop();

                if (isImage) {
                  return (
                    <a key={idx} href={fileUrl} target="_blank" rel="noreferrer" className="block w-full max-w-sm rounded-xl overflow-hidden border hover:opacity-90 transition-opacity"
                      style={{ borderColor: isOwn ? 'transparent' : theme === 'dark' ? 'rgb(255 255 255 / 0.1)' : 'rgb(148 163 184 / 0.2)' }}
                    >
                      <img src={fileUrl} alt="attachment" className="w-full h-auto object-cover" loading="lazy" />
                    </a>
                  );
                }

                return (
                  <a 
                    key={idx} 
                    href={fileUrl} 
                    target="_blank" 
                    rel="noreferrer" 
                    className={clsx(
                      "flex items-center gap-3 p-3 rounded-xl border w-full transition-colors",
                      isOwn 
                        ? "bg-white/10 hover:bg-white/20 border-white/10" 
                        : theme === "dark" 
                          ? "bg-black/20 hover:bg-black/30 border-white/10"
                          : "bg-slate-50 hover:bg-slate-200 border-slate-200"
                    )}
                  >
                    <div className={clsx(
                      "p-2 rounded-lg",
                      isOwn 
                        ? "bg-white/10 text-white" 
                        : theme === "dark" 
                          ? "bg-white/10 text-white"
                          : "bg-slate-200 text-slate-700"
                    )}>
                      <FileText size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={clsx("text-sm font-medium truncate", isOwn ? "text-white" : theme === "dark" ? "text-white" : "text-slate-800")}>{fileName}</p>
                      <p className={clsx("text-[10px] uppercase mt-0.5", isOwn ? "text-white/70" : theme === "dark" ? "text-slate-300" : "text-slate-500")}>Attachment</p>
                    </div>
                    <Download size={16} className={clsx(isOwn ? "text-white/60" : theme === "dark" ? "text-white/60" : "text-slate-400")} />
                  </a>
                );
              })}
            </div>
          )}
        </div>
        
        {/* Timestamp and Status */}
        <div className="flex items-center gap-1 mt-1 px-1">
          <span className={clsx("text-[11px]", theme === "dark" ? "text-muted" : "text-muted-light")}>
            {timeString}
          </span>
          {isOwn && (
            <span className="text-accent/80 ml-1">
              {message.read ? <CheckCheck size={14} /> : <Check size={14} />}
            </span>
          )}
        </div>
        
      </div>
    </div>
  );
};

export default MessageBubble;

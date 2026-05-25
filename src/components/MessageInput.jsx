import { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Smile, Image as ImageIcon, X, Loader2 } from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';
import useChatStore from '../store/useChatStore';
import useThemeStore from '../store/useThemeStore';
import socketService from '../socket/socketService';
import api from '../services/api';
import clsx from 'clsx';

const MessageInput = () => {
  const [content, setContent] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const { activeConversation } = useChatStore();
  const { theme } = useThemeStore();
  const typingTimeoutRef = useRef(null);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const pickerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleTyping = (e) => {
    setContent(e.target.value);

    if (activeConversation) {
      socketService.emitTyping(activeConversation._id);
      
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      typingTimeoutRef.current = setTimeout(() => {
        socketService.emitStopTyping(activeConversation._id);
      }, 2000);
    }
  };

  const handleEmojiClick = (emojiObject) => {
    setContent(prev => prev + emojiObject.emoji);
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      if (attachments.length + filesArray.length > 5) {
        alert("Maximum 5 attachments allowed");
        return;
      }
      setAttachments(prev => [...prev, ...filesArray]);
    }
  };

  const removeAttachment = (index) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if ((!content.trim() && attachments.length === 0) || !activeConversation || isSending) return;

    setIsSending(true);

    try {
      if (attachments.length > 0) {
        const formData = new FormData();
        formData.append('conversationId', activeConversation._id);
        formData.append('text', content.trim());
        
        attachments.forEach(file => {
          formData.append('attachments', file);
        });

        await api.post('/messages', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        socketService.sendMessage({
          conversationId: activeConversation._id,
          text: content.trim(),
        });
      }

      socketService.emitStopTyping(activeConversation._id);
      setContent('');
      setAttachments([]);
      setShowEmojiPicker(false);
    } catch (err) {
      console.error('Failed to send message:', err);
      alert('Failed to send message. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className={clsx(
      "p-4 border-t z-10 relative",
      theme === "dark" ? "border-white/5 glass" : "border-slate-100 glass-light"
    )}>
      {/* Attachments Preview */}
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3 max-w-4xl mx-auto">
          {attachments.map((file, index) => (
            <div key={index} className={clsx(
              "relative group rounded-xl p-2 flex items-center gap-2 border",
              theme === "dark" 
                ? "bg-white/10 border-white/10" 
                : "bg-slate-50 border-slate-200"
            )}>
              {file.type.startsWith('image/') ? (
                <div className="w-10 h-10 rounded overflow-hidden">
                  <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className={clsx(
                  "w-10 h-10 rounded flex items-center justify-center text-xs font-bold uppercase",
                  theme === "dark" ? "bg-white/5 text-accent" : "bg-slate-200 text-accent"
                )}>
                  {file.name.split('.').pop()}
                </div>
              )}
              <div className="flex flex-col min-w-0 max-w-[120px]">
                <span className={clsx("text-xs truncate", theme === "dark" ? "text-white" : "text-slate-800")}>{file.name}</span>
                <span className={clsx("text-[10px]", theme === "dark" ? "text-muted" : "text-muted-light")}>{(file.size / 1024).toFixed(1)} KB</span>
              </div>
              <button 
                type="button"
                onClick={() => removeAttachment(index)}
                className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Emoji Picker Popover */}
      {showEmojiPicker && (
        <div ref={pickerRef} className={clsx(
          "absolute bottom-full mb-2 right-12 z-50 shadow-2xl rounded-2xl overflow-hidden border",
          theme === "dark" ? "border-white/10" : "border-slate-200"
        )}>
          <EmojiPicker 
            onEmojiClick={handleEmojiClick}
            theme={theme === "dark" ? "dark" : "light"}
            previewConfig={{ showPreview: false }}
          />
        </div>
      )}

      <form 
        onSubmit={handleSubmit}
        className={clsx(
          "flex items-center gap-2 max-w-4xl mx-auto w-full p-2 rounded-2xl border shadow-inner relative",
          theme === "dark" ? "bg-card/80 border-white/5" : "bg-white border-slate-200"
        )}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          className="hidden" 
          multiple 
        />
        <input 
          type="file" 
          ref={imageInputRef} 
          onChange={handleFileChange} 
          accept="image/*" 
          className="hidden" 
          multiple 
        />

        <button 
          type="button" 
          onClick={() => fileInputRef.current?.click()}
          className={clsx(
            "p-2 rounded-xl transition-colors",
            theme === "dark" 
              ? "text-muted hover:text-white hover:bg-white/5" 
              : "text-muted-light hover:text-slate-700 hover:bg-slate-50"
          )}
          title="Attach file"
        >
          <Paperclip size={20} />
        </button>
        <button 
          type="button" 
          onClick={() => imageInputRef.current?.click()}
          className={clsx(
            "p-2 rounded-xl transition-colors hidden sm:block",
            theme === "dark" 
              ? "text-muted hover:text-white hover:bg-white/5" 
              : "text-muted-light hover:text-slate-700 hover:bg-slate-50"
          )}
          title="Attach image"
        >
          <ImageIcon size={20} />
        </button>
        
        <input
          type="text"
          value={content}
          onChange={handleTyping}
          placeholder="Type your message..."
          className={clsx(
            "flex-1 bg-transparent border-none focus:outline-none px-2 py-2",
            theme === "dark" 
              ? "text-white placeholder-muted/80" 
              : "text-slate-900 placeholder-muted-light/80"
          )}
          disabled={isSending}
        />
        
        <button 
          type="button" 
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className={clsx(
            "p-2 transition-colors rounded-xl",
            showEmojiPicker 
              ? "text-accent bg-accent/10" 
              : theme === "dark" 
                ? "text-muted hover:text-accent hover:bg-white/5" 
                : "text-muted-light hover:text-accent hover:bg-slate-50"
          )}
        >
          <Smile size={20} />
        </button>
        
        <button 
          type="submit" 
          disabled={(!content.trim() && attachments.length === 0) || isSending}
          className="p-3 bg-accent text-white rounded-xl hover:bg-accent/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-accent/20"
        >
          {isSending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} className="transform translate-x-px -translate-y-px" />}
        </button>
      </form>
    </div>
  );
};

export default MessageInput;

import { create } from 'zustand';
import api from '../services/api';

const useChatStore = create((set, get) => ({
  conversations: [],
  activeConversation: null,
  messages: [],
  onlineUsers: [],
  typingUsers: {},
  loading: false,
  error: null,

  setOnlineUsers: (users) => set({ onlineUsers: users }),
  
  setTypingStatus: (conversationId, userId, isTyping) => set((state) => {
    const typingUsers = { ...state.typingUsers };
    if (!typingUsers[conversationId]) typingUsers[conversationId] = new Set();
    
    if (isTyping) {
      typingUsers[conversationId].add(userId);
    } else {
      typingUsers[conversationId].delete(userId);
    }
    return { typingUsers };
  }),

  addMessage: (message) => set((state) => ({
    messages: [...state.messages, message],
    // Update the last message in the conversation list
    conversations: state.conversations.map(conv => 
      conv._id === message.conversationId 
        ? { ...conv, lastMessage: message, updatedAt: message.createdAt } 
        : conv
    ).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
  })),

  fetchConversations: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get('/conversations');
      set({ conversations: response.data.data.conversations || [], loading: false });
    } catch (error) {
      set({ error: error.response?.data?.error || 'Failed to load conversations', loading: false });
    }
  },

  setActiveConversation: async (conversation) => {
    set({ activeConversation: conversation, loading: true });
    try {
      // Assuming message fetching route is /messages/:conversationId
      const response = await api.get(`/messages/${conversation._id}`);
      set({ messages: response.data.data.messages || [], loading: false });
    } catch (error) {
      set({ error: error.response?.data?.error || 'Failed to load messages', loading: false });
    }
  },

  clearActiveConversation: () => set({ activeConversation: null, messages: [] }),
}));

export default useChatStore;

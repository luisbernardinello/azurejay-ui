// src/constants/api.ts
export const API_CONFIG = {
  // Substitua YOUR_IP pelo IP real do seu servidor
  BASE_URL: 'http://localhost:8000',
  
  ENDPOINTS: {
    // Audio endpoints
    AUDIO_NEW: '/audio/new',
    AUDIO_CHAT: (conversationId: string) => `/audio/chat/${conversationId}`,
    AUDIO_RESET: '/audio/reset',
    
    // Conversation endpoints
    CONVERSATIONS_LIST: '/conversations/',
    CONVERSATION_DETAIL: (conversationId: string) => `/conversations/${conversationId}`,
  },
  
  HEADERS: {
    'Content-Type': 'multipart/form-data',
  },
  
  TIMEOUT: 30000, // 30 segundos
};
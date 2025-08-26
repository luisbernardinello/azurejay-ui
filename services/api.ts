// src/services/api.ts
import { API_CONFIG } from '../constants/api';
import { Conversation, ConversationDetail } from '../types/conversation';

class ApiService {
  public baseURL: string;

  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
  }

  // Criar nova conversa com áudio
  async createAudioConversation(audioUri: string): Promise<{
    conversationId: string;
    title: string;
  }> {
    try {
      console.log('🎤 Criando nova conversa com áudio...');
      
      const formData = new FormData();
      formData.append('file', {
        uri: audioUri,
        type: 'audio/m4a',
        name: 'recording.m4a',
      } as any);

      const response = await fetch(`${this.baseURL}${API_CONFIG.ENDPOINTS.AUDIO_NEW}`, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Extrair dados dos headers
      const conversationId = response.headers.get('X-Conversation-ID');
      const title = response.headers.get('X-Conversation-Title');

      if (!conversationId || !title) {
        throw new Error('Conversation ID or title not found in response headers');
      }

      console.log('✅ Nova conversa criada:', { conversationId, title });

      return {
        conversationId,
        title,
      };
    } catch (error) {
      console.error('❌ Erro ao criar conversa:', error);
      throw error;
    }
  }

  // Continuar conversa existente com áudio
  async continueAudioConversation(conversationId: string, audioUri: string): Promise<void> {
    try {
      console.log('🎤 Continuando conversa:', conversationId);
      
      const formData = new FormData();
      formData.append('file', {
        uri: audioUri,
        type: 'audio/m4a',
        name: 'recording.m4a',
      } as any);

      const response = await fetch(`${this.baseURL}${API_CONFIG.ENDPOINTS.AUDIO_CHAT(conversationId)}`, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log('✅ Mensagem enviada para conversa existente');
    } catch (error) {
      console.error('❌ Erro ao continuar conversa:', error);
      throw error;
    }
  }

  // Listar conversas do usuário
  async getConversations(): Promise<Conversation[]> {
    try {
      console.log('📋 Buscando lista de conversas...');
      
      const response = await fetch(`${this.baseURL}${API_CONFIG.ENDPOINTS.CONVERSATIONS_LIST}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const conversations: Conversation[] = await response.json();
      console.log('✅ Conversas carregadas:', conversations.length);
      
      return conversations;
    } catch (error) {
      console.error('❌ Erro ao buscar conversas:', error);
      throw error;
    }
  }

  // Obter detalhes de uma conversa específica
  async getConversationDetail(conversationId: string): Promise<ConversationDetail> {
    try {
      console.log('📄 Buscando detalhes da conversa:', conversationId);
      
      const response = await fetch(`${this.baseURL}${API_CONFIG.ENDPOINTS.CONVERSATION_DETAIL(conversationId)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const conversation: ConversationDetail = await response.json();
      console.log('✅ Detalhes da conversa carregados:', conversation.title);
      
      return conversation;
    } catch (error) {
      console.error('❌ Erro ao buscar detalhes da conversa:', error);
      throw error;
    }
  }

  // Reset conversa (compatibilidade)
  async resetConversation(): Promise<void> {
    try {
      const response = await fetch(`${this.baseURL}${API_CONFIG.ENDPOINTS.AUDIO_RESET}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log('✅ Conversa resetada');
    } catch (error) {
      console.error('❌ Erro ao resetar conversa:', error);
      throw error;
    }
  }
}

export const apiService = new ApiService();
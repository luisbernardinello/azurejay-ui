// src/hooks/useConversations.ts
import { useEffect, useState } from 'react';
import { apiService } from '../services/api';
import { Conversation, ConversationDetail } from '../types/conversation';

export const useConversations = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getConversations();
      setConversations(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar conversas');
      console.error('Error fetching conversations:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshConversations = () => {
    fetchConversations();
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  return {
    conversations,
    loading,
    error,
    refreshConversations,
  };
};

export const useConversationDetail = (conversationId: string | null) => {
  const [conversation, setConversation] = useState<ConversationDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchConversationDetail = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getConversationDetail(id);
      setConversation(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar conversa');
      console.error('Error fetching conversation detail:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (conversationId) {
      fetchConversationDetail(conversationId);
    }
  }, [conversationId]);

  const refreshConversation = () => {
    if (conversationId) {
      fetchConversationDetail(conversationId);
    }
  };

  return {
    conversation,
    loading,
    error,
    refreshConversation,
  };
};
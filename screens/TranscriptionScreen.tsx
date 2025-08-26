// src/screens/TranscriptionScreen.tsx
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useConversationDetail } from '../hooks/useConversations';
import { Message } from '../types/conversation';

interface TranscriptionScreenProps {
  conversationId: string;
  onClose: () => void;
  onBackToChat: () => void;
}

const TranscriptionScreen: React.FC<TranscriptionScreenProps> = ({
  conversationId,
  onClose,
  onBackToChat,
}) => {
  const insets = useSafeAreaInsets();
  const { conversation, loading, error } = useConversationDetail(conversationId);

  const renderMessage = (message: Message, index: number) => {
    const isHuman = message.role === 'human';
    
    return (
      <View key={index} style={styles.messageContainer}>
        {/* Message Header */}
        <View style={styles.messageHeader}>
          <View style={[
            styles.roleIndicator,
            { backgroundColor: isHuman ? '#4A90E2' : '#4CAF50' }
          ]}>
            <Ionicons
              name={isHuman ? 'person' : 'chatbubble'}
              size={16}
              color="#ffffff"
            />
          </View>
          <Text style={styles.roleText}>
            {isHuman ? 'Você' : 'Rachel AI'}
          </Text>
        </View>

        {/* Message Content */}
        <View style={[
          styles.messageBubble,
          { backgroundColor: isHuman ? 'rgba(74, 144, 226, 0.1)' : 'rgba(76, 175, 80, 0.1)' }
        ]}>
          <Text style={styles.messageText}>{message.content}</Text>
        </View>

        {/* Grammar Analysis */}
        {message.analysis?.improvement && (
          <View style={styles.analysisContainer}>
            <View style={styles.analysisHeader}>
              <Ionicons name="school-outline" size={16} color="#FFB74D" />
              <Text style={styles.analysisTitle}>Sugestão de Melhoria</Text>
            </View>
            <Text style={styles.analysisText}>
              {message.analysis.improvement}
            </Text>
          </View>
        )}
      </View>
    );
  };

  const handleShare = () => {
    if (!conversation) return;
    
    // Implementar compartilhamento da conversa
    Alert.alert(
      'Compartilhar Conversa',
      'Funcionalidade de compartilhamento será implementada em breve.',
      [{ text: 'OK' }]
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4A90E2" />
          <Text style={styles.loadingText}>Carregando transcrição...</Text>
        </View>
      </View>
    );
  }

  if (error || !conversation) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color="#FF4444" />
          <Text style={styles.errorText}>
            {error || 'Não foi possível carregar a conversa'}
          </Text>
          <TouchableOpacity style={styles.backButton} onPress={onClose}>
            <Text style={styles.backButtonText}>Voltar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={onClose}
          activeOpacity={0.7}
        >
          <Ionicons name="close" size={24} color="#ffffff" />
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Transcrição</Text>
          <Text style={styles.headerSubtitle} numberOfLines={1}>
            {conversation.title}
          </Text>
        </View>
        
        <TouchableOpacity
          style={styles.headerButton}
          onPress={handleShare}
          activeOpacity={0.7}
        >
          <Ionicons name="share-outline" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <ScrollView
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      >
        {conversation.messages.map(renderMessage)}
        
        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Ionicons name="chatbubbles-outline" size={20} color="#4A90E2" />
            <Text style={styles.statText}>
              {conversation.messages.length} mensagens
            </Text>
          </View>
          
          <View style={styles.statItem}>
            <Ionicons name="school-outline" size={20} color="#4CAF50" />
            <Text style={styles.statText}>
              {conversation.messages.filter(m => m.analysis?.improvement).length} correções
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={onBackToChat}
          activeOpacity={0.7}
        >
          <Ionicons name="mic" size={20} color="#ffffff" />
          <Text style={styles.actionButtonText}>Continuar Conversa</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 16,
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  errorText: {
    color: '#FF4444',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: 'rgba(74, 144, 226, 0.2)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#4A90E2',
    fontSize: 16,
    fontWeight: '500',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#1a1a1a',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    marginTop: 2,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    paddingVertical: 20,
  },
  messageContainer: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  roleIndicator: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  roleText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  messageBubble: {
    padding: 16,
    borderRadius: 12,
    marginLeft: 36,
  },
  messageText: {
    color: '#ffffff',
    fontSize: 16,
    lineHeight: 24,
  },
  analysisContainer: {
    marginTop: 12,
    marginLeft: 36,
    padding: 12,
    backgroundColor: 'rgba(255, 183, 77, 0.1)',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#FFB74D',
  },
  analysisHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  analysisTitle: {
    color: '#FFB74D',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  analysisText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    marginHorizontal: 20,
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    marginLeft: 8,
    fontWeight: '500',
  },
  bottomActions: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#1a1a1a',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4A90E2',
    paddingVertical: 16,
    borderRadius: 12,
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default TranscriptionScreen;
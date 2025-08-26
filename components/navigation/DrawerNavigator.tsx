// src/components/navigation/DrawerNavigator.tsx
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useConversations } from '../../hooks/useConversations';
import { Conversation } from '../../types/conversation';

interface DrawerContentProps {
  onConversationPress: (conversationId: string) => void;
  onNewConversation: () => void;
  currentConversationId?: string;
}

export const DrawerContent: React.FC<DrawerContentProps> = ({
  onConversationPress,
  onNewConversation,
  currentConversationId,
}) => {
  const { conversations, loading, error, refreshConversations } = useConversations();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return 'Hoje';
    } else if (diffDays === 2) {
      return 'Ontem';
    } else if (diffDays <= 7) {
      return `${diffDays - 1} dias atrás`;
    } else {
      return date.toLocaleDateString('pt-BR');
    }
  };

  const renderConversationItem = ({ item }: { item: Conversation }) => (
    <TouchableOpacity
      style={[
        styles.conversationItem,
        currentConversationId === item.id && styles.activeConversation,
      ]}
      onPress={() => onConversationPress(item.id)}
      activeOpacity={0.7}
    >
      <View style={styles.conversationContent}>
        <Text
          style={[
            styles.conversationTitle,
            currentConversationId === item.id && styles.activeText,
          ]}
          numberOfLines={2}
        >
          {item.title}
        </Text>
        <Text
          style={[
            styles.conversationDate,
            currentConversationId === item.id && styles.activeDateText,
          ]}
        >
          {formatDate(item.updated_at)}
        </Text>
      </View>
      <Ionicons
        name="chatbubble-outline"
        size={16}
        color={currentConversationId === item.id ? '#4A90E2' : 'rgba(255, 255, 255, 0.5)'}
      />
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="chatbubbles-outline" size={48} color="rgba(255, 255, 255, 0.3)" />
      <Text style={styles.emptyStateText}>Nenhuma conversa ainda</Text>
      <Text style={styles.emptyStateSubtext}>
        Inicie sua primeira conversa com Rachel!
      </Text>
    </View>
  );

  const renderError = () => (
    <View style={styles.errorState}>
      <Ionicons name="alert-circle-outline" size={48} color="#FF4444" />
      <Text style={styles.errorText}>Erro ao carregar conversas</Text>
      <TouchableOpacity style={styles.retryButton} onPress={refreshConversations}>
        <Text style={styles.retryButtonText}>Tentar novamente</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Conversas</Text>
        <TouchableOpacity
          style={styles.newChatButton}
          onPress={onNewConversation}
          activeOpacity={0.7}
        >
          <Ionicons name="add" size={24} color="#4A90E2" />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {loading ? (
          <View style={styles.loadingState}>
            <ActivityIndicator size="large" color="#4A90E2" />
            <Text style={styles.loadingText}>Carregando conversas...</Text>
          </View>
        ) : error ? (
          renderError()
        ) : conversations.length === 0 ? (
          renderEmptyState()
        ) : (
          <FlatList
            data={conversations}
            renderItem={renderConversationItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
            refreshing={loading}
            onRefresh={refreshConversations}
          />
        )}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.footerContent}>
          <Ionicons name="person-circle-outline" size={20} color="rgba(255, 255, 255, 0.7)" />
          <Text style={styles.footerText}>AzureJay AI Tutor</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingTop: 60, // Account for status bar
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  newChatButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(74, 144, 226, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  listContainer: {
    paddingVertical: 10,
  },
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  activeConversation: {
    backgroundColor: 'rgba(74, 144, 226, 0.15)',
    borderRightWidth: 3,
    borderRightColor: '#4A90E2',
  },
  conversationContent: {
    flex: 1,
    marginRight: 12,
  },
  conversationTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
    lineHeight: 22,
  },
  activeText: {
    color: '#4A90E2',
  },
  conversationDate: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    fontWeight: '400',
  },
  activeDateText: {
    color: 'rgba(74, 144, 226, 0.8)',
  },
  loadingState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  loadingText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 16,
    marginTop: 16,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyStateText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 18,
    fontWeight: '500',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  errorState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  errorText: {
    color: '#FF4444',
    fontSize: 18,
    fontWeight: '500',
    marginTop: 16,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: 'rgba(74, 144, 226, 0.2)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#4A90E2',
    fontSize: 16,
    fontWeight: '500',
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  footerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    marginLeft: 8,
    fontWeight: '500',
  },
});
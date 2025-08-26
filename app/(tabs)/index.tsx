// app/(tabs)/index.tsx
import AudioController from '@/components/audio/AudioController';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Modal,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

export default function HomeScreen() {
  // Theme hooks
  const backgroundColor = useThemeColor({}, 'background');
  const surfaceColor = useThemeColor({}, 'surface');
  const textColor = useThemeColor({}, 'text');
  const textSecondaryColor = useThemeColor({}, 'textSecondary');
  const primaryColor = useThemeColor({}, 'primary');
  const borderColor = useThemeColor({}, 'border');
  const overlayColor = useThemeColor({}, 'overlay');
  const colorScheme = useColorScheme();

  // States
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [isTranscriptionOpen, setIsTranscriptionOpen] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState<string | undefined>(undefined);

  // Animations
  const drawerTranslateX = useRef(new Animated.Value(-screenWidth)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  // Drawer animation
  useEffect(() => {
    if (isDrawerOpen) {
      setIsDrawerVisible(true);
      Animated.parallel([
        Animated.timing(drawerTranslateX, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(drawerTranslateX, {
          toValue: -screenWidth,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setIsDrawerVisible(false);
      });
    }
  }, [isDrawerOpen]);

  // Event handlers
  const handleConversationCreated = (conversationId: string, title: string) => {
    console.log('📝 Nova conversa criada:', { conversationId, title });
    setCurrentConversationId(conversationId);
    handleCloseDrawer();
  };

  const handleOpenDrawer = () => {
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
  };

  const handleNewConversation = () => {
    console.log('🆕 Iniciando nova conversa...');
    setCurrentConversationId(undefined);
    handleCloseDrawer();
  };

  const handleOpenTranscription = () => {
    if (currentConversationId) {
      console.log('📄 Abrindo transcrição para:', currentConversationId);
      setIsTranscriptionOpen(true);
    }
  };

  const handleCloseTranscription = () => {
    setIsTranscriptionOpen(false);
  };

  return (
    <ThemedView style={styles.container}>
      {/* Main Content */}
      <AudioController
        onConversationCreated={handleConversationCreated}
        onOpenDrawer={handleOpenDrawer}
        onOpenTranscription={handleOpenTranscription}
        currentConversationId={currentConversationId}
      />

      {/* Drawer Modal */}
      {isDrawerVisible && (
        <Modal
          visible={true}
          animationType="none"
          transparent={true}
          onRequestClose={handleCloseDrawer}
          statusBarTranslucent={true}
        >
          <Animated.View 
            style={[
              styles.drawerOverlay,
              { 
                opacity: overlayOpacity,
                backgroundColor: overlayColor
              }
            ]}
          >
            <Animated.View 
              style={[
                styles.drawerPanel,
                {
                  backgroundColor: surfaceColor,
                  transform: [{ translateX: drawerTranslateX }]
                }
              ]}
            >
              <SafeAreaView style={[styles.drawerContainer, { backgroundColor: surfaceColor }]}>
                <ThemedView style={[styles.drawerHeader, { 
                  backgroundColor: surfaceColor,
                  borderBottomColor: borderColor 
                }]}>
                  <ThemedText style={styles.drawerTitle}>Conversas</ThemedText>
                </ThemedView>
                
                <ThemedView style={[styles.drawerContent, { backgroundColor: surfaceColor }]}>
                  <ThemedText style={[styles.drawerText, { color: textSecondaryColor }]}>
                    Nenhuma conversa a ser exibida.
                  </ThemedText>
                  
                  <TouchableOpacity 
                    style={[styles.newButton, { 
                      backgroundColor: `${primaryColor}20`,
                      borderColor: `${primaryColor}30`
                    }]}
                    onPress={handleNewConversation}
                  >
                    <Ionicons name="add" size={20} color={primaryColor} />
                    <ThemedText style={[styles.newButtonText, { color: primaryColor }]}>
                      Nova Conversa
                    </ThemedText>
                  </TouchableOpacity>
                </ThemedView>
              </SafeAreaView>
            </Animated.View>

            <TouchableOpacity 
              style={styles.drawerCloseArea}
              activeOpacity={1}
              onPress={handleCloseDrawer}
            />
          </Animated.View>
        </Modal>
      )}

      {/* Transcription Modal */}
      <Modal
        visible={isTranscriptionOpen}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={handleCloseTranscription}
        statusBarTranslucent={true}
      >
        <ThemedView style={styles.transcriptionContainer}>
          <SafeAreaView style={[styles.transcriptionSafeArea, { backgroundColor }]}>
            <ThemedView style={[styles.transcriptionHeader, { 
              backgroundColor: surfaceColor,
              borderBottomColor: borderColor 
            }]}>
              <ThemedText style={styles.transcriptionTitle}>Transcrição</ThemedText>
              <TouchableOpacity 
                onPress={handleCloseTranscription} 
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color={textColor} />
              </TouchableOpacity>
            </ThemedView>
            
            <ThemedView style={styles.transcriptionContent}>
              <ThemedText style={[styles.transcriptionText, { color: textSecondaryColor }]}>
                {currentConversationId ? 
                  `Transcrição da conversa ${currentConversationId} aparecerá aqui` :
                  'Nenhuma conversa selecionada'
                }
              </ThemedText>
            </ThemedView>
          </SafeAreaView>
        </ThemedView>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  
  // Drawer styles
  drawerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
  },
  drawerPanel: {
    width: screenWidth * 0.85,
    height: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 16,
  },
  drawerCloseArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  drawerContainer: {
    flex: 1,
  },
  drawerHeader: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
  },
  drawerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  drawerContent: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  drawerText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
  },
  newButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  newButtonText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  
  // Transcription styles
  transcriptionContainer: {
    flex: 1,
  },
  transcriptionSafeArea: {
    flex: 1,
  },
  transcriptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
  },
  transcriptionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  transcriptionContent: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  transcriptionText: {
    fontSize: 16,
    textAlign: 'center',
  },
});
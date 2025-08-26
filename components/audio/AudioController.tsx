// components/audio/AudioController.tsx
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';
import {
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioPlayer,
  useAudioRecorder,
  useAudioRecorderState
} from 'expo-audio';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import AudioVisualizer from './AudioVisualizer';

interface AudioControllerProps {
  onConversationCreated?: (conversationId: string, title: string) => void;
  onOpenDrawer?: () => void;
  onOpenTranscription?: () => void;
  currentConversationId?: string;
}

const AudioController: React.FC<AudioControllerProps> = ({
  onConversationCreated,
  onOpenDrawer,
  onOpenTranscription,
  currentConversationId,
}) => {
  // Theme colors
  const backgroundColor = useThemeColor({}, 'background');
  const surfaceColor = useThemeColor({}, 'surface');
  const textColor = useThemeColor({}, 'text');
  const primaryColor = useThemeColor({}, 'primary');
  const colorScheme = useColorScheme();

  // Estados principais
  const [currentState, setCurrentState] = useState<'idle' | 'recording' | 'processing' | 'playing'>('idle');
  const [lastRachelAudioUri, setLastRachelAudioUri] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<string | undefined>(currentConversationId);
  
  // Audio hooks
  const audioRecorder = useAudioRecorder({
    ...RecordingPresets.HIGH_QUALITY,
    isMeteringEnabled: true,
  });
  const recorderState = useAudioRecorderState(audioRecorder);
  const player = useAudioPlayer();

  // Update conversation ID when prop changes
  useEffect(() => {
    setConversationId(currentConversationId);
  }, [currentConversationId]);

  useEffect(() => {
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    try {
      console.log('🔐 Solicitando permissões...');
      
      const { status } = await AudioModule.requestRecordingPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permissão necessária', 'Permissão do microfone é necessária.');
        return false;
      }
      
      await setAudioModeAsync({
        allowsRecording: true,
        playsInSilentMode: true,
      });
      
      return true;
    } catch (error) {
      console.error('❌ Erro ao solicitar permissões:', error);
      return false;
    }
  };

  const startRecording = async () => {
    try {
      const hasPermission = await requestPermissions();
      if (!hasPermission) return;
      
      setCurrentState('recording');
      
      await audioRecorder.prepareToRecordAsync();
      audioRecorder.record();
    } catch (error) {
      console.error('❌ Erro ao iniciar gravação:', error);
      setCurrentState('idle');
      Alert.alert('Erro', 'Falha ao iniciar gravação');
    }
  };

  const stopRecording = async () => {
    try {
      setCurrentState('processing');
      
      await audioRecorder.stop();
      
      const uri = audioRecorder.uri;
      
      if (uri && recorderState.durationMillis > 500) {
        await handleAudioUpload(uri);
      } else {
        Alert.alert('Aviso', 'Gravação muito curta');
        setCurrentState('idle');
      }
    } catch (error) {
      console.error('❌ Erro ao parar gravação:', error);
      setCurrentState('idle');
      Alert.alert('Erro', 'Falha ao parar gravação');
    }
  };

  const handleAudioUpload = async (audioUri: string) => {
    try {
      console.log('📦 Preparando upload...');
      const formData = new FormData();
      formData.append('file', {
        uri: audioUri,
        type: 'audio/m4a',
        name: 'recording.m4a',
      } as any);

      let endpoint: string;
      if (!conversationId) {
        console.log('🆕 Criando nova conversa...');
        endpoint = 'http://192.168.50.132:8000/audio/new';
      } else {
        console.log('➕ Continuando conversa existente...');
        endpoint = `http://192.168.50.132:8000/audio/chat/${conversationId}`;
      }

      console.log('🌐 Enviando para servidor...');
      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.ok) {
        console.log('✅ Upload bem-sucedido');

        if (!conversationId) {
          const conversationIdFromHeader = response.headers.get('X-Conversation-ID');
          const titleFromHeader = response.headers.get('X-Conversation-Title');

          if (conversationIdFromHeader && titleFromHeader) {
            setConversationId(conversationIdFromHeader);
            
            if (onConversationCreated) {
              onConversationCreated(conversationIdFromHeader, titleFromHeader);
            }
          }
        }

        const rachelAudioUri = audioUri;
        setLastRachelAudioUri(rachelAudioUri);
        await playRachelResponse(rachelAudioUri);
        
      } else {
        console.log('❌ Erro do servidor:', response.status);
        Alert.alert('Erro', `Falha no servidor: ${response.status}`);
        setCurrentState('idle');
      }
    } catch (error) {
      console.error('❌ Erro ao enviar áudio:', error);
      
      if (error instanceof TypeError && error.message.includes('Network request failed')) {
        Alert.alert(
          'Erro de Conexão', 
          'Não foi possível conectar ao servidor. Verifique sua conexão de internet.'
        );
      } else {
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
        Alert.alert('Erro', `Falha ao enviar áudio: ${errorMessage}`);
      }
      
      setCurrentState('idle');
    }
  };

  const playRachelResponse = async (audioUri: string) => {
    try {
      setCurrentState('playing');
      
      player.replace({ uri: audioUri });
      player.play();

      const interval = setInterval(() => {
        if (!player.playing && player.currentTime > 0) {
          setCurrentState('idle');
          clearInterval(interval);
        }
      }, 100);

    } catch (error) {
      console.error('❌ Erro ao reproduzir:', error);
      setCurrentState('idle');
    }
  };

  const replayLastResponse = async () => {
    if (lastRachelAudioUri && currentState === 'idle') {
      await playRachelResponse(lastRachelAudioUri);
    }
  };

  const resetConversation = async () => {
    try {
      console.log('🗑️ Resetando conversa...');

      const response = await fetch('http://192.168.50.132:8000/audio/reset', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        console.log('✅ Servidor resetado');
      }
      
      setLastRachelAudioUri(null);
      setConversationId(undefined);
      setCurrentState('idle');
      
      if (currentState === 'playing') {
        player.pause();
        player.seekTo(0);
      }
      
    } catch (error) {
      console.error('❌ Erro ao resetar:', error);
      
      setLastRachelAudioUri(null);
      setConversationId(undefined);
      setCurrentState('idle');
    }
  };

  const getStatusText = () => {
    switch (currentState) {
      case 'recording':
        return 'Ouvindo...';
      case 'processing':
        return 'Pensando...';
      case 'playing':
        return 'Rachel está falando';
      case 'idle':
      default:
        return lastRachelAudioUri ? 'Toque para falar' : 'Comece uma conversa';
    }
  };

  return (
    <ThemedView style={styles.container}>
      <StatusBar 
        barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} 
        backgroundColor={backgroundColor} 
        translucent 
      />
      
      <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
        {/* Header */}
        <ThemedView style={[styles.header, { backgroundColor: surfaceColor }]}>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={onOpenDrawer}
            activeOpacity={0.7}
          >
            <Ionicons name="menu" size={24} color={textColor} />
          </TouchableOpacity>
          
          <ThemedText style={styles.headerTitle}>AzureJay</ThemedText>
          
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.resetButton}
              onPress={resetConversation}
              activeOpacity={0.7}
            >
              <Ionicons name="refresh-outline" size={20} color={textColor} />
            </TouchableOpacity>
          </View>
        </ThemedView>

        {/* Main Content */}
        <ThemedView style={styles.mainContent}>
          
          {/* Status Text */}
          <View style={styles.statusContainer}>
            <ThemedText style={styles.statusText}>{getStatusText()}</ThemedText>
          </View>

          {/* Central Audio Visualizer */}
          <AudioVisualizer
            isRecording={currentState === 'recording'}
            isPlaying={currentState === 'playing'}
            isLoading={currentState === 'processing'}
            onPressIn={startRecording}
            onPressOut={stopRecording}
            audioLevel={recorderState.metering || 0}
            currentState={currentState}
          />

          {/* Replay Button */}
          {lastRachelAudioUri && currentState === 'idle' && (
            <TouchableOpacity
              style={[
                styles.replayButton,
                { 
                  backgroundColor: useThemeColor({}, 'success'),
                  borderColor: `${primaryColor}30`
                }
              ]}
              onPress={replayLastResponse}
              activeOpacity={0.7}
            >
              <Ionicons name="play-outline" size={20} color={primaryColor} />
              <ThemedText style={[styles.replayText, { color: primaryColor }]}>
                Repetir
              </ThemedText>
            </TouchableOpacity>
          )}
          
        </ThemedView>
      </SafeAreaView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  headerActions: {
    width: 40,
    alignItems: 'flex-end',
  },
  resetButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  statusContainer: {
    position: 'absolute',
    top: 100,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  replayButton: {
    position: 'absolute',
    bottom: 100,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 1,
  },
  replayText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
});

export default AudioController;
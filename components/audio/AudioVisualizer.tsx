// components/audio/AudioVisualizer.tsx
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');
const CIRCLE_SIZE = Math.min(width * 0.6, 240);

interface AudioVisualizerProps {
  isRecording: boolean;
  isPlaying: boolean;
  isLoading: boolean;
  onPressIn: () => void;
  onPressOut: () => void;
  audioLevel?: number;
  currentState?: 'idle' | 'recording' | 'processing' | 'playing';
}

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
  isRecording,
  isPlaying,
  isLoading,
  onPressIn,
  onPressOut,
  audioLevel = -60,
  currentState = 'idle',
}) => {
  // Animações principais
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  
  // Animação dos dots de "thinking"
  const dotAnims = useRef([
    new Animated.Value(0.7),
    new Animated.Value(0.7),
    new Animated.Value(0.7),
  ]).current;
  
  // Animação das ondas sonoras
  const waveAnims = useRef([
    new Animated.Value(0.8),
    new Animated.Value(1),
    new Animated.Value(0.6),
  ]).current;

  // Efeito principal baseado no estado
  useEffect(() => {
    switch (currentState) {
      case 'recording':
        startRecordingAnimation();
        break;
      case 'processing':
        startProcessingAnimation();
        break;
      case 'playing':
        startPlayingAnimation();
        break;
      case 'idle':
      default:
        startIdleAnimation();
        break;
    }

    return () => {
      rotateAnim.stopAnimation();
      scaleAnim.stopAnimation();
      pulseAnim.stopAnimation();
      dotAnims.forEach(anim => anim.stopAnimation());
      waveAnims.forEach(anim => anim.stopAnimation());
    };
  }, [currentState]);

  // Animação do pulso baseada no nível de áudio
  useEffect(() => {
    if (currentState === 'recording' || currentState === 'playing') {
      animateAudioPulse();
    } else {
      resetAudioPulse();
    }
  }, [audioLevel, currentState]);

  const animateAudioPulse = () => {
    // Converter nível de áudio para escala (de -60 a 0 dB para 1.0 a 1.3)
    const normalizedLevel = Math.max(0, Math.min(1, (audioLevel + 60) / 60));
    const targetScale = 1 + (normalizedLevel * 0.3); // Varia de 1.0 a 1.3
    
    Animated.timing(pulseAnim, {
      toValue: targetScale,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const resetAudioPulse = () => {
    Animated.timing(pulseAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const startIdleAnimation = () => {
    // Reset todas as animações
    scaleAnim.setValue(1);
    pulseAnim.setValue(1);
    rotateAnim.setValue(0);
  };

  const startRecordingAnimation = () => {
    // Apenas o pulso baseado no áudio
    scaleAnim.setValue(1);
    rotateAnim.setValue(0);
  };

  const startProcessingAnimation = () => {
    // Rotação sutil durante processamento
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    ).start();

    // Animação dos dots de pensamento
    const dotAnimations = dotAnims.map((anim, index) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0.7,
            duration: 400,
            useNativeDriver: true,
          }),
        ]),
        { iterations: -1 }
      );
    });

    // Começar cada dot com um delay
    dotAnimations.forEach((animation, index) => {
      setTimeout(() => animation.start(), index * 200);
    });
  };

  const startPlayingAnimation = () => {
    // Reset rotação
    rotateAnim.setValue(0);
    
    // Animação das ondas sonoras
    const waveAnimations = waveAnims.map((anim, index) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 1.2,
            duration: 600 + (index * 100),
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0.6,
            duration: 600 + (index * 100),
            useNativeDriver: true,
          }),
        ]),
        { iterations: -1 }
      );
    });

    waveAnimations.forEach((animation, index) => {
      setTimeout(() => animation.start(), index * 150);
    });
  };

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
    onPressIn();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
    onPressOut();
  };

  const getCircleColor = () => {
    switch (currentState) {
      case 'recording':
        return '#10a37f'; // Verde do ChatGPT quando gravando
      case 'processing':
        return '#ff6b35'; // Laranja quando processando
      case 'playing':
        return '#10a37f'; // Verde quando reproduzindo
      case 'idle':
      default:
        return '#565869'; // Cinza quando idle
    }
  };

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <TouchableWithoutFeedback
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <View style={styles.container}>
        
        {/* Main circle com pulso baseado no áudio */}
        <Animated.View
          style={[
            styles.mainCircle,
            {
              backgroundColor: getCircleColor(),
              transform: [
                { scale: Animated.multiply(scaleAnim, pulseAnim) },
                { rotate: currentState === 'processing' ? rotateInterpolate : '0deg' },
              ],
            },
          ]}
        >
          
          {/* Inner content based on state */}
          <View style={styles.innerContent}>
            
            {/* Idle state */}
            {currentState === 'idle' && (
              <View style={styles.idleState}>
                <View style={styles.microphoneIcon} />
              </View>
            )}
            
            {/* Recording state */}
            {currentState === 'recording' && (
              <View style={styles.recordingState}>
                <View style={styles.recordingDot} />
              </View>
            )}
            
            {/* Processing state */}
            {currentState === 'processing' && (
              <View style={styles.processingState}>
                <View style={styles.thinkingDots}>
                  {dotAnims.map((anim, index) => (
                    <Animated.View
                      key={index}
                      style={[
                        styles.dot,
                        {
                          transform: [{ scale: anim }],
                          opacity: anim,
                        },
                      ]}
                    />
                  ))}
                </View>
              </View>
            )}
            
            {/* Playing state */}
            {currentState === 'playing' && (
              <View style={styles.playingState}>
                <View style={styles.soundWaves}>
                  {waveAnims.map((anim, index) => (
                    <Animated.View
                      key={index}
                      style={[
                        styles.wave,
                        styles[`wave${index + 1}` as keyof typeof styles],
                        {
                          transform: [{ scaleY: anim }],
                        },
                      ]}
                    />
                  ))}
                </View>
              </View>
            )}
            
          </View>
        </Animated.View>

        {/* Círculo externo sutil para indicar que está ativo */}
        {(currentState === 'recording' || currentState === 'playing') && (
          <Animated.View
            style={[
              styles.outerCircle,
              {
                borderColor: getCircleColor(),
                transform: [
                  { scale: Animated.multiply(pulseAnim, 1.1) },
                ],
                opacity: pulseAnim.interpolate({
                  inputRange: [1, 1.3],
                  outputRange: [0.2, 0.4],
                  extrapolate: 'clamp',
                }),
              },
            ]}
          />
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    width: CIRCLE_SIZE + 40,
    height: CIRCLE_SIZE + 40,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  
  // Círculo externo sutil
  outerCircle: {
    position: 'absolute',
    width: CIRCLE_SIZE + 20,
    height: CIRCLE_SIZE + 20,
    borderRadius: (CIRCLE_SIZE + 20) / 2,
    borderWidth: 2,
    backgroundColor: 'transparent',
  },
  
  // Main Circle com pulso
  mainCircle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    position: 'relative',
    zIndex: 10,
  },
  
  innerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Idle State
  idleState: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  microphoneIcon: {
    width: 20,
    height: 28,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    opacity: 0.7,
  },
  
  // Recording State
  recordingState: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordingDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#ffffff',
  },
  
  // Processing State
  processingState: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  thinkingDots: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ffffff',
    marginHorizontal: 2,
  },
  
  // Playing State
  playingState: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  soundWaves: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  wave: {
    width: 4,
    backgroundColor: '#ffffff',
    borderRadius: 2,
    marginHorizontal: 2,
    opacity: 0.8,
  },
  wave1: {
    height: 12,
  },
  wave2: {
    height: 20,
  },
  wave3: {
    height: 16,
  },
});

export default AudioVisualizer;
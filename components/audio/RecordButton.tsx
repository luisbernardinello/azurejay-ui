// components/audio/RecordButton.tsx
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  Animated,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

interface RecordButtonProps {
  isRecording: boolean;
  onPressIn: () => void;
  onPressOut: () => void;
  disabled: boolean;
}

const RecordButton: React.FC<RecordButtonProps> = ({
  isRecording,
  onPressIn,
  onPressOut,
  disabled,
}) => {
  const [scaleAnimation] = useState(new Animated.Value(1));
  const [pulseAnimation] = useState(new Animated.Value(1));

  useEffect(() => {
    if (isRecording) {
      // Animação de pulso durante gravação
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnimation, {
            toValue: 1.3,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnimation, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnimation.setValue(1);
    }
  }, [isRecording]);

  const handlePressIn = () => {
    Animated.spring(scaleAnimation, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
    onPressIn();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnimation, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
    onPressOut();
  };

  return (
    <View style={styles.container}>
      {/* Anel de pulso durante gravação */}
      {isRecording && (
        <Animated.View
          style={[
            styles.pulseRing,
            {
              transform: [{ scale: pulseAnimation }],
              opacity: pulseAnimation.interpolate({
                inputRange: [1, 1.3],
                outputRange: [0.6, 0],
              }),
            },
          ]}
        />
      )}

      <TouchableOpacity
        style={[styles.button, disabled && styles.disabled]}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        activeOpacity={1}
      >
        <Animated.View
          style={[
            styles.buttonInner,
            {
              transform: [{ scale: scaleAnimation }],
              backgroundColor: isRecording ? '#FF4444' : '#4A90E2',
            },
            isRecording && styles.recording,
          ]}
        >
          <Ionicons
            name={isRecording ? "stop" : "mic"}
            size={28}
            color="#FFFFFF"
          />
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pulseRing: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#FF4444',
  },
  button: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  disabled: {
    opacity: 0.5,
    elevation: 2,
    shadowOpacity: 0.1,
  },
  buttonInner: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recording: {
    backgroundColor: '#FF4444',
  },
});

export default RecordButton;
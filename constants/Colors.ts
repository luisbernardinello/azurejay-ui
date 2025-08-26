// constants/Colors.ts
export const Colors = {
  light: {
    // Main theme colors
    primary: '#4A90E2',
    secondary: '#4CAF50',
    accent: '#FFB74D',
    error: '#FF4444',
    
    // Background colors
    background: '#FFFFFF',
    surface: '#F5F5F5',
    card: 'rgba(0, 0, 0, 0.05)',
    
    // Text colors
    text: '#000000',
    textSecondary: 'rgba(0, 0, 0, 0.7)',
    textTertiary: 'rgba(0, 0, 0, 0.5)',
    textAccent: '#4A90E2',
    
    // Audio states
    audioIdle: '#4A90E2',
    audioRecording: '#FF4444',
    audioProcessing: '#7BB3F0',
    audioPlaying: '#4CAF50',
    audioDisabled: '#CCCCCC',
    
    // UI elements
    border: 'rgba(0, 0, 0, 0.1)',
    overlay: 'rgba(0, 0, 0, 0.5)',
    success: 'rgba(76, 175, 80, 0.1)',
    warning: 'rgba(255, 183, 77, 0.1)',
    errorBackground: 'rgba(255, 68, 68, 0.1)',
    
    // Tab bar
    tint: '#4A90E2',
    icon: '#000000',
    tabIconDefault: '#666666',
    tabIconSelected: '#4A90E2',
  },
  
  dark: {
    // Main theme colors
    primary: '#4A90E2',
    secondary: '#4CAF50',
    accent: '#FFB74D',
    error: '#FF4444',
    
    // Background colors
    background: '#000000',
    surface: '#1a1a1a',
    card: 'rgba(255, 255, 255, 0.1)',
    
    // Text colors
    text: '#FFFFFF',
    textSecondary: 'rgba(255, 255, 255, 0.7)',
    textTertiary: 'rgba(255, 255, 255, 0.5)',
    textAccent: '#4A90E2',
    
    // Audio states
    audioIdle: '#4A90E2',
    audioRecording: '#FF4444',
    audioProcessing: '#7BB3F0',
    audioPlaying: '#4CAF50',
    audioDisabled: '#666666',
    
    // UI elements
    border: 'rgba(255, 255, 255, 0.1)',
    overlay: 'rgba(0, 0, 0, 0.5)',
    success: 'rgba(76, 175, 80, 0.1)',
    warning: 'rgba(255, 183, 77, 0.1)',
    errorBackground: 'rgba(255, 68, 68, 0.1)',
    
    // Tab bar
    tint: '#4A90E2',
    icon: '#FFFFFF',
    tabIconDefault: '#666666',
    tabIconSelected: '#4A90E2',
  },
} as const;
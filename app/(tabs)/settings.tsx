// app/(tabs)/settings.tsx
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    Alert,
    Appearance,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Switch,
    TouchableOpacity,
    View,
} from 'react-native';

export default function SettingsScreen() {
  // Theme hooks
  const backgroundColor = useThemeColor({}, 'background');
  const surfaceColor = useThemeColor({}, 'surface');
  const textColor = useThemeColor({}, 'text');
  const textSecondaryColor = useThemeColor({}, 'textSecondary');
  const primaryColor = useThemeColor({}, 'primary');
  const borderColor = useThemeColor({}, 'border');
  const colorScheme = useColorScheme();

  const toggleColorScheme = () => {
    const newScheme = colorScheme === 'dark' ? 'light' : 'dark';
    Appearance.setColorScheme(newScheme);
  };

  const handleLanguageChange = () => {
    Alert.alert(
      'Idioma',
      'Funcionalidade de mudança de idioma será implementada em breve.',
      [{ text: 'OK' }]
    );
  };

  const handleAbout = () => {
    Alert.alert(
      'Sobre o AzureJay',
      'App para auxiliar no aprendizado de inglês através de conversas por voz.\n\nVersão: 1.0.0',
      [{ text: 'OK' }]
    );
  };

  const SettingItem = ({ 
    icon, 
    title, 
    subtitle, 
    onPress, 
    rightComponent 
  }: {
    icon: string;
    title: string;
    subtitle?: string;
    onPress?: () => void;
    rightComponent?: React.ReactNode;
  }) => (
    <TouchableOpacity
      style={[styles.settingItem, { backgroundColor: surfaceColor, borderBottomColor: borderColor }]}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={!onPress}
    >
      <View style={styles.settingItemLeft}>
        <View style={[styles.iconContainer, { backgroundColor: `${primaryColor}20` }]}>
          <Ionicons name={icon as any} size={18} color={primaryColor} />
        </View>
        <View style={styles.settingTextContainer}>
          <ThemedText style={styles.settingTitle}>{title}</ThemedText>
          {subtitle && (
            <ThemedText type="subtitle" style={styles.settingSubtitle}>
              {subtitle}
            </ThemedText>
          )}
        </View>
      </View>
      {rightComponent || (
        onPress && <Ionicons name="chevron-forward" size={18} color={textSecondaryColor} />
      )}
    </TouchableOpacity>
  );

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
          <ThemedText style={styles.headerTitle}>Configurações</ThemedText>
        </ThemedView>

        {/* Settings Content */}
        <ThemedView style={styles.content}>
          
          {/* Aparência */}
          <View style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              APARÊNCIA
            </ThemedText>
            
            <SettingItem
              icon="moon"
              title="Tema escuro"
              subtitle={`Atualmente: ${colorScheme === 'dark' ? 'Escuro' : 'Claro'}`}
              rightComponent={
                <Switch
                  value={colorScheme === 'dark'}
                  onValueChange={toggleColorScheme}
                  trackColor={{ false: borderColor, true: primaryColor }}
                  thumbColor={colorScheme === 'dark' ? '#ffffff' : '#f4f3f4'}
                />
              }
            />
          </View>

          {/* Idioma e Region */}
          <View style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              IDIOMA
            </ThemedText>
            
            <SettingItem
              icon="language"
              title="Idioma do app"
              subtitle="Português (Brasil)"
              onPress={handleLanguageChange}
            />
            
            <SettingItem
              icon="globe"
              title="Região de aprendizado"
              subtitle="Inglês americano"
              onPress={handleLanguageChange}
            />
          </View>

          {/* Audio */}
          <View style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              ÁUDIO
            </ThemedText>
            
            <SettingItem
              icon="volume-high"
              title="Qualidade do áudio"
              subtitle="Alta qualidade"
              onPress={() => Alert.alert('Em desenvolvimento', 'Funcionalidade em breve.')}
            />
          </View>

          {/* Sobre */}
          <View style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              INFORMAÇÕES
            </ThemedText>
            
            <SettingItem
              icon="information-circle"
              title="Sobre o AzureJay"
              subtitle="Versão 1.0.0"
              onPress={handleAbout}
            />
            
            <SettingItem
              icon="document-text"
              title="Política de privacidade"
              onPress={() => Alert.alert('Em desenvolvimento', 'Funcionalidade em breve.')}
            />
          </View>

        </ThemedView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 40, // Muito mais espaço no topo para evitar corte
    paddingBottom: 15,
    minHeight: 80, // Altura mínima garantida para o header
  },
  headerTitle: {
    fontSize: 24, // Reduzido ainda mais de 28 para 24
    fontWeight: 'bold',
    textAlign: 'left',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 20, // Espaçamento reduzido no topo
  },
  section: {
    marginBottom: 24, // Reduzido de 32 para 24
  },
  sectionTitle: {
    fontSize: 11, // Reduzido de 12 para 11
    fontWeight: '600',
    letterSpacing: 0.8, // Reduzido de 1 para 0.8
    marginBottom: 10, // Reduzido de 12 para 10
    textTransform: 'uppercase',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10, // Reduzido de 12 para 10
    paddingHorizontal: 14, // Reduzido de 16 para 14
    borderBottomWidth: 0.5,
    borderRadius: 8,
    marginBottom: 1,
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 28, // Reduzido de 32 para 28
    height: 28, // Reduzido de 32 para 28
    borderRadius: 7, // Reduzido de 8 para 7
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10, // Reduzido de 12 para 10
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 15, // Reduzido de 16 para 15
    fontWeight: '500',
  },
  settingSubtitle: {
    fontSize: 13, // Reduzido de 14 para 13
    marginTop: 1, // Reduzido de 2 para 1
  },
});
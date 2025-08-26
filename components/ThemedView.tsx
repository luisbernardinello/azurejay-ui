// components/ThemedView.tsx
import { useThemeColor } from '@/hooks/useThemeColor';
import { View, type ViewProps } from 'react-native';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({ style, lightColor, darkColor, ...otherProps }: ThemedViewProps) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}

// components/ThemedText.tsx
import { StyleSheet, Text, type TextProps } from 'react-native';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link' | 'secondary' | 'tertiary';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  const secondaryColor = useThemeColor({ light: lightColor, dark: darkColor }, 'textSecondary');
  const tertiaryColor = useThemeColor({ light: lightColor, dark: darkColor }, 'textTertiary');
  const accentColor = useThemeColor({ light: lightColor, dark: darkColor }, 'textAccent');

  const getTextColor = () => {
    switch (type) {
      case 'secondary':
        return secondaryColor;
      case 'tertiary':
        return tertiaryColor;
      case 'link':
        return accentColor;
      default:
        return color;
    }
  };

  return (
    <Text
      style={[
        { color: getTextColor() },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        type === 'secondary' ? styles.secondary : undefined,
        type === 'tertiary' ? styles.tertiary : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
  },
  secondary: {
    fontSize: 16,
    lineHeight: 24,
  },
  tertiary: {
    fontSize: 14,
    lineHeight: 20,
  },
});
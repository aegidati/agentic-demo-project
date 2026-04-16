import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function HomeScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to Agentic</Text>
        <Text style={styles.subtitle}>React Native Mobile Client</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Getting Started</Text>
          <Text style={styles.description}>
            This is your Agentic React Native starter foundation.
          </Text>
          <Text style={styles.description}>
            Edit src/screens/HomeScreen.tsx to customize your mobile app.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Features Included</Text>
          <FeatureItem text="React Native with Expo" />
          <FeatureItem text="React Navigation" />
          <FeatureItem text="TypeScript support" />
          <FeatureItem text="Jest testing framework" />
          <FeatureItem text="Multi-platform support (iOS, Android, Web)" />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Available Commands</Text>
          <CommandItem command="npm run dev" description="Start development server" />
          <CommandItem command="npm run build" description="Build for iOS/Android" />
          <CommandItem command="npm test" description="Run tests" />
          <CommandItem command="npm run lint" description="Run ESLint" />
          <CommandItem command="npm run type-check" description="Check TypeScript types" />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Learn more at: agentic.dev
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

interface FeatureItemProps {
  text: string;
}

function FeatureItem({ text }: FeatureItemProps) {
  return (
    <View style={styles.featureItem}>
      <Text style={styles.bullet}>✓</Text>
      <Text style={styles.featureText}>{text}</Text>
    </View>
  );
}

interface CommandItemProps {
  command: string;
  description: string;
}

function CommandItem({ command, description }: CommandItemProps) {
  return (
    <View style={styles.commandItem}>
      <Text style={styles.commandCode}>{command}</Text>
      <Text style={styles.commandDescription}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    paddingVertical: 20,
  },
  content: {
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
    marginBottom: 8,
  },
  featureItem: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'center',
  },
  bullet: {
    fontSize: 16,
    color: '#4CAF50',
    marginRight: 12,
    fontWeight: 'bold',
  },
  featureText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  commandItem: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  commandCode: {
    fontSize: 13,
    fontFamily: 'Courier New',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    color: '#d63384',
    marginBottom: 4,
  },
  commandDescription: {
    fontSize: 13,
    color: '#666',
  },
  footer: {
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#999',
  },
});

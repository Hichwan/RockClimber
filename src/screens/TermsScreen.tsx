import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

const TermsScreen: React.FC = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Terms of Use</Text>
      <Text style={styles.text}>
        Welcome to our Terms of Use. By using this application, you agree to the following conditions...
        {'\n\n'}1. Acceptance of Terms
        {'\n'}2. User Responsibilities
        {'\n'}3. Limitation of Liability
        {'\n'}(More legal text here...)
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  text: { fontSize: 16, lineHeight: 24 },
});

export default TermsScreen;

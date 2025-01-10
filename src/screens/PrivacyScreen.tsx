import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

const PrivacyScreen: React.FC = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Privacy Policy</Text>
      <Text style={styles.text}>
        Our Privacy Policy outlines how we collect, use, and protect your personal information...
        {'\n\n'}1. Information We Collect
        {'\n'}2. How We Use Your Data
        {'\n'}3. Your Rights and Choices
        {'\n'}(More privacy details...)
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  text: { fontSize: 16, lineHeight: 24 },
});

export default PrivacyScreen;

import { View, Text, ScrollView, StyleSheet, Button, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';

export default function PrivacyScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style ={styles.safeContainer}>
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Privacy Policy</Text>
      <Text style={styles.text}>
        Our Privacy Policy outlines how we collect, use, and protect your personal information...
        {'\n\n'}1. Information We Collect
        {'\n'}2. How We Use Your Data
        {'\n'}3. Your Rights and Choices
        {'\n'}(More privacy details...)
      </Text>

      {/* Close Button */}
      <Button title="Close" onPress={() => router.back()} />
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    backgroundColor: '#fff' },
  header: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    marginBottom: 10 },
  text: { 
    fontSize: 16, 
    lineHeight: 24 },
    safeContainer: {
        flex: 1,
        backgroundColor: 'white', 
      },
});

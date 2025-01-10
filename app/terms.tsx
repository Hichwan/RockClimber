import { View, Text, ScrollView, StyleSheet, Button, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';

export default function TermsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style ={styles.safeContainer}>
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Terms of Use</Text>
      <Text style={styles.text}>
        These are the terms of use for our application...
        {'\n\n'}1. Agreement
        {'\n'}2. User Responsibilities
        {'\n'}3. Termination Policy
        {'\n'}(More terms content...)
      </Text>

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

import { View, Text, ScrollView, StyleSheet, Button, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';

export default function TermsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView style={styles.container}>
        <Text style={styles.header}>Terms of Use</Text>
        <Text style={styles.text}>
          Last Updated: 1/12/2025
          {'\n\n'}
          <Text style={styles.subHeader}>1. Agreement</Text>
          {'\n'}
          By using the Rock Climbing Tracker App, you agree to comply with these Terms of Use. If you do not agree, please discontinue using the App.
          {'\n\n'}

          <Text style={styles.subHeader}>2. User Responsibilities</Text>
          {'\n'}
          - You must be at least **13 years old** to use the App.
          {'\n'}
          - You are responsible for maintaining the security of your account.
          {'\n'}
          - You may not misuse or exploit the App, including but not limited to unauthorized access, data scraping, or illegal activities.
          {'\n\n'}

          <Text style={styles.subHeader}>3. Data Ownership</Text>
          {'\n'}
          - **You own your data** and may delete it at any time.
          {'\n'}
          - We **do not sell or share** your personal data.
          {'\n\n'}

          <Text style={styles.subHeader}>4. Account Termination</Text>
          {'\n'}
          - You may delete your account through the **Profile Settings**.
          {'\n'}
          - We may suspend or terminate your account if you violate these Terms.
          {'\n\n'}

          <Text style={styles.subHeader}>5. Liability Disclaimer</Text>
          {'\n'}
          - The App is provided "as is" without warranties of any kind.
          {'\n'}
          - We are not responsible for **injuries or accidents** resulting from climbing activities.
          {'\n\n'}

          <Text style={styles.subHeader}>6. Updates to These Terms</Text>
          {'\n'}
          - We may update these Terms from time to time.
          {'\n'}
          - Continued use of the App after an update constitutes acceptance of the revised Terms.
          {'\n\n'}

          <Text style={styles.subHeader}>7. Contact Us</Text>
          {'\n'}
          If you have questions about these Terms, contact us at:  
          📧 [Insert Contact Email]
        </Text>

        <Button title="Close" onPress={() => router.back()} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  subHeader: { fontSize: 18, fontWeight: 'bold', marginTop: 15 },
  text: { fontSize: 16, lineHeight: 24 },
  safeContainer: { flex: 1, backgroundColor: 'white' },
});

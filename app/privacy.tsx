import { Text, ScrollView, StyleSheet, Button, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';

export default function PrivacyScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView style={styles.container}>
        <Text style={styles.header}>Privacy Policy</Text>
        <Text style={styles.text}>
          Last Updated: 1/12/2025
          {'\n\n'}
          <Text style={styles.subHeader}>1. Introduction</Text>
          {'\n'}
          We value your privacy and are committed to protecting your personal data. This Privacy Policy outlines how we collect, use, and safeguard your information when using the Rock Climbing Tracker App.
          {'\n\n'}

          <Text style={styles.subHeader}>2. Information We Collect</Text>
          {'\n'}
          - **Personal Information**: Name, email, weight (if provided).
          {'\n'}
          - **Climbing Data**: Logged climbing sessions, difficulty, duration.
          {'\n'}
          - **Location Data**: Only if GPS is enabled, we retrieve your city/state.
          {'\n'}
          - **Device Data**: App usage analytics for performance improvements.
          {'\n\n'}

          <Text style={styles.subHeader}>3. How We Use Your Data</Text>
          {'\n'}
          - To store and display climbing history.
          {'\n'}
          - To generate performance statistics (e.g., hardest climb, calories burned).
          {'\n'}
          - To enhance user experience and improve app functionality.
          {'\n\n'}

          <Text style={styles.subHeader}>4. Location Tracking & Permissions</Text>
          {'\n'}
          - **We do NOT track real-time location**.
          {'\n'}
          - Location is retrieved **only when logging a climb**, if GPS is enabled.
          {'\n'}
          - You can disable GPS tracking at any time in **Profile Settings**.
          {'\n\n'}

          <Text style={styles.subHeader}>5. Data Retention & Deletion</Text>
          {'\n'}
          - Your climbing data is stored until you delete your account.
          {'\n'}
          - You may request **data deletion** at any time via **Profile Settings** or contact us at [Insert Email].
          {'\n\n'}

          <Text style={styles.subHeader}>6. Data Security</Text>
          {'\n'}
          - We use industry-standard encryption to protect your data.
          {'\n'}
          - We do **not** share or sell your personal data to third parties.
          {'\n\n'}

          <Text style={styles.subHeader}>7. Changes to This Privacy Policy</Text>
          {'\n'}
          We may update this policy periodically. We will notify users of significant changes through **in-app notifications or email**.
        </Text>

        {/* Close Button */}
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

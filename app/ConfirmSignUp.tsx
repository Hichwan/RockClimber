import { View, Text, StyleSheet, ScrollView, SafeAreaView, Alert } from 'react-native';
import CustomButton from '../components/CustomButton/CustomButton';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { auth } from '../src/config/firebaseConfig';
import { sendEmailVerification } from "firebase/auth";

const ConfirmSignUpScreen = () => {
  const router = useRouter();
  const { email } = useLocalSearchParams(); // Get email passed from SignUp

  const onConfirmPressed = async () => {
    try {
      await auth.currentUser?.reload(); // Refresh user data
      if (auth.currentUser?.emailVerified) {
        Alert.alert("Success", "Your email is verified! You can now log in.");
        router.push('/SignInScreen'); // Redirect to Login
      } else {
        Alert.alert("Error", "Your email is not verified yet. Check your inbox.");
      }
    } catch (error: any) {
      console.error("Verification check error:", error);
      Alert.alert("Error", error.message);
    }
  };

  const onResendPressed = async () => {
    try {
      if (auth.currentUser) {
        await sendEmailVerification(auth.currentUser);
        Alert.alert("Success", "Verification email sent again. Check your inbox!");
      } else {
        Alert.alert("Error", "User session expired. Please sign up again.");
      }
    } catch (error: any) {
      console.error("Resend email error:", error);
      Alert.alert("Error", error.message);
    }
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.root}>
          <Text style={styles.title}>Confirm Your Email</Text>
          <Text style={styles.text}>A verification email has been sent to {email}. Please check your inbox.</Text>

          <CustomButton text="I Verified My Email" onPress={onConfirmPressed} type="Primary" />
          <CustomButton text="Resend Email" onPress={onResendPressed} type="Secondary" />
          <CustomButton text="Cancel" onPress={() => router.push('/SignInScreen')} type="Tertiary" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: { alignItems: 'center', padding: 20 },
  safeContainer: { flex: 1, backgroundColor: 'white' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#051C60', margin: 10 },
  text: { color: 'gray', textAlign: 'center', marginBottom: 20 },
});

export default ConfirmSignUpScreen;

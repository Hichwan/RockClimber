import { View, Text, StyleSheet, ScrollView, SafeAreaView, TextInput, Alert } from 'react-native';
import React from 'react';
import CustomButton from '../components/CustomButton/CustomButton';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { auth } from '../src/config/firebaseConfig'; 
import { sendPasswordResetEmail } from "firebase/auth";

type ForgotPassData = {
  email: string;
};

const ForgotPassScreen = () => {
  const router = useRouter();

  const { control, handleSubmit, formState: { errors } } = useForm<ForgotPassData>({
    defaultValues: { email: '' },
  });


  const onSendPressed = async (data: ForgotPassData) => {
    try {
      await sendPasswordResetEmail(auth, data.email);
      Alert.alert("Success", "A password reset email has been sent to your email address.");
      router.push('/SignInScreen');
    } catch (error: any) {
      console.error("Password reset error:", error);
      Alert.alert("Error", error.message);
    }
  };

  const onCancelPressed = () => {
    router.push('/SignInScreen');
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.root}>
          <Text style={styles.title}>Reset Your Password</Text>
          <Text style={styles.instructions}>
            Enter your email address, and we'll send you a link to reset your password.
          </Text>

          <Controller
            control={control}
            name="email"
            rules={{
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Enter a valid email address",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <>
                <TextInput
                  style={[styles.input, error && styles.inputError]}
                  placeholder="Enter your email"
                  placeholderTextColor="grey"
                  value={field.value || ''}
                  onChangeText={field.onChange}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                {error && <Text style={styles.error}>{error.message}</Text>}
              </>
            )}
          />

          <CustomButton text="Send Reset Link" onPress={handleSubmit(onSendPressed)} type="Primary" />
          <CustomButton text="Cancel" onPress={onCancelPressed} type="Tertiary" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: { 
    alignItems: 'center', 
    padding: 20 },

  safeContainer: { 
    flex: 1, 
    backgroundColor: 'white' },

  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: '#051C60', 
    margin: 10 },

  instructions: { 
    textAlign: 'center', 
    color: 'gray', 
    marginBottom: 15 },

  input: { 
    width: '90%', 
    padding: 10, 
    borderWidth: 1, 
    borderColor: '#ccc', 
    borderRadius: 5, 
    marginVertical: 10 },

  inputError: { 
    borderColor: "red" 
  },
  error: { 
    color: "red", 
    alignSelf: "stretch", 
    marginBottom: 10 
  },
});

export default ForgotPassScreen;

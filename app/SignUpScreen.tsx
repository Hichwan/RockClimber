import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Button, SafeAreaView, TextInput } from 'react-native';
import CustomButton from '../components/CustomButton/CustomButton';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { auth } from '../src/config/firebaseConfig';
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { Alert } from "react-native"; 

const EMAIL_REX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type SignUpFormData = {
  password: string;
  repeatpassword: string;
  email: string;
};

const SignUpScreen: React.FC<{ navigation: any }> = () => {

  const router = useRouter();

  const { control, handleSubmit, formState: {errors}, watch } = useForm<SignUpFormData>({
    defaultValues: {
      password: '',
      repeatpassword: '',
      email: '',
    },
  });

  const pwd = watch('password')

  const onRegisterPressed = async (data: SignUpFormData) => {
    try {
      
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;
  
      
      await sendEmailVerification(user);
  
      
      Alert.alert(
        "Verify Your Email",
        "A verification email has been sent. Please check your inbox and verify before logging in."
      );
  
      
      router.push({
        pathname: "/ConfirmSignUp",
        params: { email: data.email },
      });
  
    } catch (error: any) {
      console.error("Sign-up error:", error);
      Alert.alert("Error", error.message);
    }
  };

  const onSignInPressed = () => {
    console.warn("Navigating to SignIn");
    router.push('/SignInScreen');
  };

  

  return (
    <SafeAreaView style ={styles.safeContainer}>
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.root}>
        <Text style={styles.title}>Create an account</Text>

        <Controller
            control={control}
            name="email"
            rules ={{
              required: 'Email is required',
              pattern: {
                value: EMAIL_REX,
                message: "Enter a valid email address",
              },
            }}
            render={({ field, fieldState:{error} }) => (
              <>
              <TextInput
                style={[styles.input, error && styles.inputError]}
                placeholder="Email"
                placeholderTextColor="grey"
                value={field.value || ''}
                onChangeText={field.onChange}
              />
              {error &&(
                <Text style={{color: 'red', alignSelf: 'stretch'}}>{error.message || 'Error'}</Text>
                )}
              </>
          )}
        />


        <Controller
          control={control}
          name="password"
          rules ={{
            required: 'Password is required',
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters long"
            },
          }}
          render={({ field, fieldState:{error} }) => (
            <>
            <TextInput
              style={[styles.input, error && styles.inputError]}
              placeholder="Password"
              placeholderTextColor="grey"
              value={field.value || ''}
              onChangeText={field.onChange}
              secureTextEntry
            />
            {error &&(
              <Text style={{color: 'red', alignSelf: 'stretch'}}>{error.message || 'Error'}</Text>
              )}
            </>
          )}
        />

        <Controller
          control={control}
          name="repeatpassword"
          rules ={{
            validate: value=> value == pwd || 'Password does not match'
          }}
          render={({ field, fieldState:{error} }) => (
            <>
            <TextInput
              style={[styles.input, error && styles.inputError]}
              placeholder="Repeat Password"
              placeholderTextColor="grey"
              value={field.value || ''}
              onChangeText={field.onChange}
              secureTextEntry
            />
            {error &&(
              <Text style={{color: 'red', alignSelf: 'stretch'}}>{error.message || 'Error'}</Text>
            )}
            </>
          )}
        />

        {/*Registers Account*/}
        <CustomButton 
          text="Register" 
          onPress={handleSubmit(onRegisterPressed)}
          type="Primary" />

        {/*Standard terms and privacy windows for app*/}
        <Text style={styles.text}>
          By registering, you confirm that you accept our{' '}
          <Text style={styles.link} onPress={() => router.push('/terms')}>Terms of Use</Text>{' '}
          and{' '}
          <Text style={styles.link} onPress={() => router.push('/privacy')}>Privacy Policy</Text>.
        </Text>

        {/*Google Sign In*/}
        {/*Need to fix*/}
        <CustomButton 
        text="Sign In with Google" 
        onPress={() => console.warn("Google Sign-In")} 
        type="Tertiary" 
        bgColor="#FAE9EA" 
        fgColor="#DD4D44" 
        />

        {/*Apple Sign In*/}
        {/*Need to fix*/}
        <CustomButton 
        text="Sign In with Apple" 
        onPress={() => console.warn("Apple Sign-In")} 
        type="Tertiary" 
        bgColor="#e3e3e3" 
        fgColor="#363636" 
        />


        {/*Returns to Sign In*/}
        <CustomButton
        text = "Have an account? Sign in"
        onPress={onSignInPressed}
        type = "Tertiary"
        />

      </View>
    </ScrollView>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    padding: 20,
  },
  safeContainer: {
    flex: 1,
    backgroundColor: 'white', 
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#051C60',
    margin: 10,
  },
  text: {
    color: 'gray',
    marginVertical: 10,
  },
  link: {
    color: '#FDB075',
    textDecorationLine: 'underline',
  },
  input: {
    width: '90%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginVertical: 10,
  },
  inputError:{
    borderColor: "red"
  }
});

export default SignUpScreen;

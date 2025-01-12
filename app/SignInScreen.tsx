import { 
  View, Text, Image, StyleSheet, useWindowDimensions, 
  ScrollView, SafeAreaView, TextInput, Alert, Platform 
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import React, { useEffect } from 'react';
import CustomButton from '../components/CustomButton/CustomButton';
import { useRouter } from 'expo-router';
import { auth } from '../src/config/firebaseConfig';
import { signInWithEmailAndPassword, signInWithCredential, OAuthProvider } from "firebase/auth";
import * as AppleAuthentication from 'expo-apple-authentication';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';

// Ensures smooth Google sign-in on web
WebBrowser.maybeCompleteAuthSession();

type SignInFormData = {
  email: string;
  password: string;
};

const SignInScreen = () => {
  const { height } = useWindowDimensions();
  const router = useRouter();
  const { control, handleSubmit, formState: { errors } } = useForm<SignInFormData>({
    defaultValues: { email: '', password: '' },
  });

  // Initialize Google OAuth (INSIDE the component)
  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: "340619659043-g96053k6vpnakv3l50htc956h6vdfjqq.apps.googleusercontent.com",
    iosClientId: "340619659043-1leih1fnkntsn4o532qnv7lns5veq3cc.apps.googleusercontent.com"
  });

  // Handle Google OAuth Response
  useEffect(() => {
    if (response?.type === "success") {
      console.log("Google Sign-In Success:", response.authentication);
      Alert.alert("Success", "Signed in with Google!");
      router.push('/Home');
    } else if (response?.type === "error") {
      console.error("Google Sign-In Error:", response);
      Alert.alert("Error", "Google Sign-In failed.");
    }
  }, [response]);

  // Sign in with Email & Password
  const onSignInPressed = async (data: SignInFormData) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
      console.log("Signed in:", userCredential.user);
      Alert.alert("Success", "Login successful!");
      router.push('/Home');
    } catch (error: any) {
      console.error("Sign-in error:", error);
      Alert.alert("Error", error.message);
    }
  };

  // Sign In with Apple
  const onSignInApplePressed = async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
  
      if (!credential.identityToken) {
        throw new Error("Apple sign-in failed: No identity token returned.");
      }
  
     
      const provider = new OAuthProvider("apple.com");
      const firebaseCredential = provider.credential({
        idToken: credential.identityToken,
        rawNonce: credential.state ?? undefined,  
      });
  
      
      const userCredential = await signInWithCredential(auth, firebaseCredential);
      console.log("Apple Signed in:", userCredential.user);
      Alert.alert("Success", "Signed in with Apple!");
  
      router.push("/Home");  
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Apple Sign-in error:", error);
        Alert.alert("Error", error.message);
      } else {
        console.error("Unknown error:", error);
        Alert.alert("Error", "Apple Sign-In failed.");
      }
    }
  };
  

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.root}>
          <Image 
            source={require('../assets/images/icon.png')} 
            style={[styles.icon, { height: height * 0.3 }]} 
            resizeMode="contain"  
          />

          <Controller
            control={control}
            name="email"
            rules={{
              required: "Email is required",
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Enter a valid email address" },
            }}
            render={({ field, fieldState: { error } }) => (
              <>
                <TextInput
                  style={[styles.input, error && styles.inputError]}
                  placeholder="Email"
                  placeholderTextColor="grey"
                  value={field.value || ''}
                  onChangeText={field.onChange}
                  onBlur={field.onBlur}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                {error && <Text style={styles.error}>{error.message}</Text>}
              </>
            )}
          />

          <Controller
            control={control}
            name="password"
            rules={{
              required: "Password is required",
              minLength: { value: 6, message: "Password must be at least 6 characters long" },
            }}
            render={({ field, fieldState: { error } }) => (
              <>
                <TextInput
                  style={[styles.input, error && styles.inputError]}
                  placeholder="Password"
                  placeholderTextColor="grey"
                  value={field.value || ''}
                  onChangeText={field.onChange}
                  onBlur={field.onBlur}
                  secureTextEntry
                />
                {error && <Text style={styles.error}>{error.message}</Text>}
              </>
            )}
          />

          <CustomButton 
          text="Sign In" 
          onPress={handleSubmit(onSignInPressed)} 
          type="Primary" />
          <CustomButton text="Forgot Password" onPress={() => router.push('/ForgotPass')} type="Tertiary" />
          

          <CustomButton 
            text="Sign In with Google" 
            onPress={() => promptAsync()} 
            type="Tertiary" 
            bgColor="#FAE9EA" 
            fgColor="#DD4D44" 
          />

          {Platform.OS === 'ios' && (
            <CustomButton 
              text="Sign In with Apple" 
              onPress={onSignInApplePressed} 
              type="Tertiary" 
              bgColor="#e3e3e3" 
              fgColor="#363636" 
            />
          )}

          <CustomButton text="Don't have an account? Create One" onPress={() => router.push('/SignUpScreen')} type="Tertiary" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: { alignItems: 'center', padding: 20 },
  safeContainer: { flex: 1, backgroundColor: 'white' },
  icon: { width: '70%', maxWidth: 300, maxHeight: 200 },
  input: { width: '90%', padding: 10, borderWidth: 1, borderColor: '#ccc', borderRadius: 5, marginVertical: 10 },
  inputError: { borderColor: "red" },
  error: { color: "red", alignSelf: "stretch", marginBottom: 10 }
});

export default SignInScreen;

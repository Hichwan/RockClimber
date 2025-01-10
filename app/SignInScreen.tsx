import { View, Text, Image, StyleSheet, useWindowDimensions, ScrollView, SafeAreaView } from 'react-native';
import React, { useState } from 'react';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton/CustomButton';
import { useRouter } from 'expo-router';


const SignInScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const { height } = useWindowDimensions();
  const router = useRouter();

  const onSignInPressed = () => {
    console.warn("Sign In");
    router.push('../Home');
  };

  const onForgotPasswordPressed = () => {
    console.warn("onForgotPasswordPressed");
    router.push('/ForgotPass')
  };

  const onSignInGooglePressed = () => {
    console.warn("onSignInGooglePressed");
  };
  const onSignInApplePressed = () => {
    console.warn("onSignInApplePressed");
  };
  const onSignUpPressed = () => {
    console.warn("onSignUpPressed");
    router.push('/SignUpScreen');
  };

  return (
    <SafeAreaView style ={styles.safeContainer}>
    <ScrollView showsVerticalScrollIndicator={false}>
    <View style={styles.root}>
      <Image 
        source={require('../assets/images/icon.png')} 
        style={[styles.icon, { height: height * 0.3 }]} 
        resizeMode="contain"  
      />

      <CustomInput 
        value={username} 
        setValue={setUsername} 
        placeholder="Username" 
        secureTextEntry={false}
      />
      <CustomInput 
        value={password} 
        setValue={setPassword} 
        placeholder="Password" 
        secureTextEntry={true}
      />

      <CustomButton 
        text="Sign In"
        onPress={onSignInPressed}
        type = "Primary"
      />

      <CustomButton 
        text="Forgot Password"
        onPress={onForgotPasswordPressed}
        type = "Tertiary"
      />
      <CustomButton 
        text="Sign In with Google"
        onPress={onSignInGooglePressed}
        type = "Tertiary"
        bgColor ="#FAE9EA"
        fgColor ="#DD4D44"
      />

      <CustomButton 
        text="Sign In with Apple"
        onPress={onSignInApplePressed}
        type = "Tertiary"
        bgColor ="#e3e3e3"
        fgColor ="363636"
      />

      <CustomButton 
        text="Don't have an account? Create One"
        onPress={onSignUpPressed}
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
  icon: {
    width: '70%',
    maxWidth: 300,
    maxHeight: 200,
  },
});

export default SignInScreen;

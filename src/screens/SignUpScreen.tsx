import { View, Text, Image, StyleSheet, useWindowDimensions, ScrollView } from 'react-native';
import React, { useState } from 'react';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton/CustomButton';

const SignUpScreen = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState(' ')
  const [password, setPassword] = useState('');
  const [passwordRepeat, setPasswordRepeat] = useState('')

  const { height } = useWindowDimensions();

  const onRegisterPressed = () => {
    console.warn("onRegisterPressed");
  };

  const onForgotPasswordPressed = () => {
    console.warn("onForgotPasswordPressed");
  };

  const onSignInGooglePressed = () => {
    console.warn("onSignInGooglePressed");
  };
  const onSignInApplePressed = () => {
    console.warn("onSignInApplePressed");
  };
  const onSignUpPressed = () => {
    console.warn("onSignUpPressed");
  };

  const onTermsOfUsePressed = () => {
    console.warn("onTermsOfUsePressed");
  }

  const onPrivacyPolicyPressed = () => {
    console.warn("onPrivacyPolicyPressed");
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
    <View style={styles.root}>
      <Text style ={styles.title}>
        Create an account
      </Text>

      <CustomInput 
        value={username} 
        setValue={setUsername} 
        placeholder="Username" 
        secureTextEntry={false}
      />

      <CustomInput 
        value={email} 
        setValue={setEmail} 
        placeholder="Email" 
        secureTextEntry={false}
      />

      <CustomInput 
        value={password} 
        setValue={setPassword} 
        placeholder="Password" 
        secureTextEntry={true}
      />

      <CustomInput 
        value={passwordRepeat} 
        setValue={setPasswordRepeat} 
        placeholder="Repeat Password" 
        secureTextEntry={true}
      />

      <CustomButton 
        text="Register"
        onPress={onRegisterPressed}
        type = "Primary"
      />

      <Text style = {styles.text}>
        By registering, you confirm that you accept our 
        <Text style = {styles.link} onPress = {onTermsOfUsePressed}>Terms of Use </Text> 
        and {' '}
        <Text style = {styles.link} onPress = {onPrivacyPolicyPressed}>Privacy Policy</Text>
      </Text>
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
  );
};

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#051C60',
    margin: 10,
  },
  text: {
    color: 'gray',
    marginVertical: 10
  },
  link: {
    color: '#FDB075'
  }
});

export default SignUpScreen;

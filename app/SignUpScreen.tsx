import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Button, SafeAreaView } from 'react-native';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton/CustomButton';
import { useRouter } from 'expo-router';


const SignUpScreen: React.FC<{ navigation: any }> = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordRepeat, setPasswordRepeat] = useState('');

  const router = useRouter();

  const onRegisterPressed = () => {
    console.warn("onRegisterPressed");
    router.push('/ConfirmSignUp');
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

        <CustomInput 
        value={username} 
        setValue={setUsername} 
        placeholder="Username" 
        secureTextEntry={false} />

        <CustomInput 
        value={email} 
        setValue={setEmail} 
        placeholder="Email" 
        secureTextEntry={false} />

        <CustomInput 
        value={password} 
        setValue={setPassword} 
        placeholder="Password" 
        secureTextEntry={true} />

        <CustomInput 
        value={passwordRepeat} 
        setValue={setPasswordRepeat} 
        placeholder="Repeat Password" 
        secureTextEntry={true} />

        <CustomButton 
        text="Register" onPress={onRegisterPressed} 
        type="Primary" />

        <Text style={styles.text}>
          By registering, you confirm that you accept our{' '}
          <Text style={styles.link} onPress={() => router.push('/terms')}>Terms of Use</Text>{' '}
          and{' '}
          <Text style={styles.link} onPress={() => router.push('/privacy')}>Privacy Policy</Text>.
        </Text>

        <CustomButton 
        text="Sign In with Google" 
        onPress={() => console.warn("Google Sign-In")} 
        type="Tertiary" 
        bgColor="#FAE9EA" 
        fgColor="#DD4D44" 
        />

        <CustomButton 
        text="Sign In with Apple" 
        onPress={() => console.warn("Apple Sign-In")} 
        type="Tertiary" 
        bgColor="#e3e3e3" 
        fgColor="#363636" 
        />

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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default SignUpScreen;

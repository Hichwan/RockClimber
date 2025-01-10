import { View, Text, Image, StyleSheet, useWindowDimensions, ScrollView, SafeAreaView } from 'react-native';
import React, { useState } from 'react';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton/CustomButton';
import { useRouter } from 'expo-router';

const ConfirmSignUpScreen = () => {
  const [code, setCode] = useState('');

  const router = useRouter();
  const { height } = useWindowDimensions();

  const onConfirmPressed = () => {
    console.warn("onConfirm");
  };

  const onCancelPressed = () => {
    console.warn("onCancelPressed");
    router.push('/SignInScreen')
  };

  const onResendPressed = () => {
    console.warn("onResendPressed");
  };
  return (
    <SafeAreaView style ={styles.safeContainer}>
    <ScrollView showsVerticalScrollIndicator={false}>
    <View style={styles.root}>
        <Text style={styles.title}>
        Confirm your email
        </Text>

      <CustomInput 
        value={code} 
        setValue={setCode} 
        placeholder="Enter your confirmation Code" 
        secureTextEntry={false}
      />

    <CustomButton 
        text="Confirm"
        onPress={onConfirmPressed}
        type = "Primary"
      />

    <CustomButton 
        text="Resend Code"
        onPress={onResendPressed}
        type = "Secondary"
      />

    <CustomButton 
        text="Cancel"
        onPress={onCancelPressed}
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
});

export default ConfirmSignUpScreen;

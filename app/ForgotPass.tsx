import { View, Text, Image, StyleSheet, useWindowDimensions, ScrollView, SafeAreaView } from 'react-native';
import React, { useState } from 'react';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton/CustomButton';
import { useRouter } from 'expo-router';

const ForgotPassScreen = () => {
  const [username, setUsername] = useState('');

  const router = useRouter();
  const { height } = useWindowDimensions();

  const onSendPressed = () => {
    console.warn("onSend");
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
            Reset your password
            </Text>

          <CustomInput 
            value={username} 
            setValue={setUsername} 
            placeholder="Username" 
            secureTextEntry={false}
          />

        <CustomButton 
            text="Send"
            onPress={onSendPressed}
            type = "Primary"
          />

        <CustomButton 
            text="Resend"
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

export default ForgotPassScreen;

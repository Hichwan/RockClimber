import { View, Text, Image, StyleSheet, useWindowDimensions, ScrollView } from 'react-native';
import React, { useState } from 'react';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton/CustomButton';

const ConfirmSignUpScreen = () => {
  const [code, setCode] = useState('');


  const { height } = useWindowDimensions();

  const onConfirmPressed = () => {
    console.warn("onConfirm");
  };

  const onCancelPressed = () => {
    console.warn("onCancelPressed");
  };

  const onResendPressed = () => {
    console.warn("onResendPressed");
  };
  return (
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
});

export default ConfirmSignUpScreen;

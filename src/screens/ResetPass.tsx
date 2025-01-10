import { View, Text, Image, StyleSheet, useWindowDimensions, ScrollView } from 'react-native';
import React, { useState } from 'react';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton/CustomButton';

const ResetPassScreen = () => {
  const [code, setCode] = useState('');
  const [newpassword, setNewPassword] = useState('');


  const { height } = useWindowDimensions();

  const onSubmitPressed = () => {
    console.warn("onSubmit");
  };

  const onCancelPressed = () => {
    console.warn("onCancelPressed");
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
    <View style={styles.root}>
        <Text style={styles.title}>
        Reset your password
        </Text>

      <CustomInput 
        value={code} 
        setValue={setCode} 
        placeholder="Enter your confirmation code" 
        secureTextEntry={false}
      />

      <CustomInput 
        value={newpassword} 
        setValue={setNewPassword} 
        placeholder="Enter your new password" 
        secureTextEntry={true}
      />

    <CustomButton 
        text="Submit"
        onPress={onSubmitPressed}
        type = "Primary"
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

export default ResetPassScreen;

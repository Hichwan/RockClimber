import { View, Text, Image, StyleSheet, useWindowDimensions, ScrollView } from 'react-native';
import React, { useState } from 'react';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton/CustomButton';

const ForgotPassScreen = () => {
  const [username, setUsername] = useState('');


  const { height } = useWindowDimensions();

  const onSendPressed = () => {
    console.warn("onSend");
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

export default ForgotPassScreen;

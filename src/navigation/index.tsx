import { View, Text } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator} from '@react-navigation/native-stack'
import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import ConfirmEmail from '../screens/ConfirmSignUp';
import ForgotPass from '../screens/ForgotPass';
import ResetPass from '../screens/ResetPass';
import Home from '../../app/(tabs)/Home';

export type RootStackParamList = {
    SignIn: undefined;
    SignUp: undefined;
    ConfirmEmail: undefined;
    ForgotPass: undefined;
    ResetPass: undefined;
    Home: undefined;
  };

const Stack = createNativeStackNavigator<RootStackParamList>();

const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="SignIn" component = {SignInScreen}/>
        <Stack.Screen name="SignUp" component = {SignUpScreen}/>
        <Stack.Screen name="ConfirmEmail" component = {ConfirmEmail}/>
        <Stack.Screen name="ForgotPass" component = {ForgotPass}/>
        <Stack.Screen name="ResetPass" component = {ResetPass}/>
        <Stack.Screen name="Home" component = {Home}/>
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default Navigation
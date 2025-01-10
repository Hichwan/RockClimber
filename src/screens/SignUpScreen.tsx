import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Modal, Button } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton/CustomButton';
import { RootStackParamList } from '../navigation/index';

type SignUpScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'SignUp'>;

const SignUpScreen: React.FC<{ navigation: any }> = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordRepeat, setPasswordRepeat] = useState('');

  const [modalVisible, setModalVisible] = useState(false);
  const [content, setContent] = useState('');

  const navigation = useNavigation<SignUpScreenNavigationProp>();

  const onRegisterPressed = () => {
    console.warn("onRegisterPressed");
  };

  const onSignInPressed = () => {
    console.warn("Navigating to SignIn");
    navigation.navigate('SignIn'); 
  };

  const showModal = (text: string) => {
    setContent(text);
    setModalVisible(true);
  };

  return (
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
          <Text style={styles.link} onPress={() => showModal('Terms of Use')}>
            Terms of Use
          </Text>{' '}
          and{' '}
          <Text style={styles.link} onPress={() => showModal('Privacy Policy')}>
            Privacy Policy
          </Text>.
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
      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{content}</Text>
            <Text style={styles.modalText}>
              {content === 'Terms of Use'
                ? 'These are the terms of use for our app. Please read carefully...'
                : 'This is our privacy policy. We respect your data and privacy...'}
            </Text>
            <Button title="Close" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
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

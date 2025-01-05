import { View, Text, TextInput, StyleSheet } from 'react-native'
import React from 'react'

type CustomInputProps = {
  value: string;
  setValue: (text: string) => void;
  placeholder: string;
  secureTextEntry: boolean;
};

const CustomInput: React.FC<CustomInputProps> = ({ value, setValue, placeholder, secureTextEntry }) => {
  return (
    <View style={styles.container}>
      <TextInput 
      value = {value}
      onChangeText={setValue}
      placeholder = {placeholder}
      placeholderTextColor= "grey"
      style ={styles.input}
      secureTextEntry={secureTextEntry}
      />
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        width: '100%',
        height: 50,

        borderColor: '#e8e8e8',
        borderWidth: 1,
        borderRadius: 5,

        paddingHorizontal: 10,
        marginVertical: 5,
        justifyContent: 'center'
    },
    input: {
      flex: 1,
      fontSize: 16,
      color: 'black',
    },

});

export default CustomInput
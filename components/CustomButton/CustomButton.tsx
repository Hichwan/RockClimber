import { View, Text, StyleSheet, Pressable } from 'react-native'
import React from 'react'

type CustomButtonProps ={
    onPress: () => void;
    text: string;
    type?: 'Primary' | 'Secondary' | 'Tertiary';
    bgColor?: string;
    fgColor?: string;
};

const CustomButton: React.FC<CustomButtonProps> = ({ onPress, text, type = 'Primary', bgColor, fgColor}) => {
  return (
    <Pressable onPress={onPress} style={[
        styles.container, 
        styles[`container_${type}`], 
        bgColor ? {backgroundColor: bgColor} : {}]}>
      <Text style={[
        styles[`text_${type}`], 
        styles.text, 
        fgColor ? {color: fgColor} : {}]}>
            {text}
            </Text> 
    </Pressable>
  )
}

const styles = StyleSheet.create({
    container: {

        width: '100%',
        padding: 15,
        marginVertical: 5,
        alignItems: 'center',
        borderRadius: 5,
    },

    container_Primary:{
        backgroundColor: '#3B71F3',
    },

    container_Secondary:{
        borderColor: '#3B71F3',
        borderWidth: 2
    },

    container_Tertiary:{
        backgroundColor: 'transparent',
    },

    text: {
        fontWeight: 'bold',
    },

    text_Primary: {
        color: 'white',
    },

    text_Secondary: {
        color: '#3B71F3',
    },

    text_Tertiary: {
        color: 'grey',
    }
})

export default CustomButton
import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

export default function ProfileScreen(){
  return (
    <View style={styles.container}>
      <Text style = {styles.text}>profile</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
      display: 'flex',
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fff',
  },
  text: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#333',
  },

});
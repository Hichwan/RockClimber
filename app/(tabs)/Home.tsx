import {Image, StyleSheet, Platform } from 'react-native';
import { StatusBar} from 'expo-status-bar';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  return (
      <ThemedView style= {styles.titleContainer}>
        <ThemedText type="title"> Climb On!</ThemedText>
        <StatusBar style ="auto"/>
      </ThemedView>

  );
}  

const styles = StyleSheet.create({
  titleContainer: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
});

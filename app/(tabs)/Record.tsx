import { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TextInput, Image, TouchableOpacity, Modal, Button } from 'react-native';
import { Picker } from '@react-native-picker/picker';  
import { StatusBar } from 'expo-status-bar';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import CustomButton from '../../components/CustomButton/CustomButton';
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, auth } from "../../src/config/firebaseConfig";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { useFocusEffect } from '@react-navigation/native';
import * as ImagePicker from "expo-image-picker";



const Record = () => {
  const [selectedValue, setSelectedValue] = useState("5");
  const [location, setLocation] = useState('');
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [showPicker, setShowPicker] = useState(false);  
  const [gpsEnabled, setGpsEnabled] = useState(false);
  const [image, setImage] = useState<string | null>(null);

  const storage = getStorage();

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Permission to access gallery is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // **Function to take a picture**
  const takePicture = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Permission to access camera is required!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      setImage(result.assets[0].uri); 
    }
  };

  // **Function to upload image to Firebase Storage**
  const uploadImage = async (uri: string) => {
    if (!uri) return null;

    try {
      console.log("Uploading image from URI:", uri);
      const response = await fetch(uri);
      console.log("Fetch response status:", response.status);
      const blob = await response.blob();
      console.log("Blob created successfully:", blob);
  
      const filename = `climbImages/${auth.currentUser?.uid}/${Date.now()}.jpg`;
      const storageRef = ref(storage, filename);
      
  
      await uploadBytes(storageRef, blob);
      console.log("Image uploaded successfully.");
  
      const downloadURL = await getDownloadURL(storageRef);
      console.log("Image download URL:", downloadURL);
      return downloadURL;
    } catch (error) {
      console.error("Error uploading image to Firebase:", error);
      throw error; // Propagate the error
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds + 1);
      }, 1000);
    } else if (!isRunning && seconds !== 0) {
      clearInterval(interval!);
    }

    return () => clearInterval(interval!);
  }, [isRunning]);

  //Listen for GPS setting changes & Fetch location
  useEffect(() => {
    const loadGpsSetting = async () => {
      try {
        const storedGps = await AsyncStorage.getItem("gpsEnabled");
        const isGpsEnabled = storedGps === "true";
        setGpsEnabled(isGpsEnabled);

        if (isGpsEnabled) {
          await fetchCurrentLocation();
        }
      } catch (error) {
        console.error("🔥 Error loading GPS setting:", error);
      }
    };

    loadGpsSetting();
  }, []);

  useFocusEffect(
    useCallback(() => {
      const checkGpsSetting = async () => {
        try {
          const storedGps = await AsyncStorage.getItem("gpsEnabled");
          const isGpsEnabled = storedGps === "true";
          setGpsEnabled(isGpsEnabled);
  
          if (isGpsEnabled) {
            console.log("📍 GPS setting is enabled, fetching current location...");
            await fetchCurrentLocation(); 
          }
        } catch (error) {
          console.error("🔥 Error checking GPS setting:", error);
        }
      };
  
      checkGpsSetting(); 
  
    }, [])
  );
  
  useEffect(() => {
    const updateLocationBasedOnGps = async () => {
      if (!gpsEnabled) {
        console.log("GPS disabled, clearing location...");
        setLocation("");
        await AsyncStorage.removeItem("lastLocation"); 
      } else {
        console.log("GPS enabled, fetching location...");
        await fetchCurrentLocation();
      }
    };
  
    updateLocationBasedOnGps();
  }, [gpsEnabled]);

  // Fetch Current Location if GPS is Enabled
  const fetchCurrentLocation = async () => {
    if (!gpsEnabled) {
      return;
    }

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Permission Denied - Enable location services.");
        return;
      }

      const locationData = await Location.getCurrentPositionAsync({});
      const address = await Location.reverseGeocodeAsync(locationData.coords);

      if (address.length > 0) {
        const { city, region } = address[0];
        const formattedLocation = `${city}, ${region}`;
        setLocation(formattedLocation);
        console.log("📍 Updated Location:", formattedLocation);
      }
    } catch (error) {
      console.error("🔥 Error fetching location:", error);
      alert("Error - Failed to fetch location.");
    }
  };


  const formatTime = (secs: number) => {
    const minutes = Math.floor(secs / 60);
    const remainingSeconds = secs % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  const saveClimb = async () => {
    if (!selectedValue || !location || seconds === 0) {
      alert("Please fill all fields and record time before submitting.");
      return;
    }

    try {
      let imageUrl = null;
      // if (image) {
      //   console.log("Uploading image...");
      //   imageUrl = await uploadImage(image);
      // }

      await addDoc(collection(db, "climbing_sessions"), {
        userId: auth.currentUser?.uid,
        difficulty: selectedValue,
        location: location.trim() || "Unknown",
        timeSpent: seconds,
        imageUrl,
        timestamp: serverTimestamp(),
        
      });

      alert("Climb saved successfully!");
      setSeconds(0);
      setIsRunning(false);
      setSelectedValue("5");
      setLocation("");
      setImage(null);
    } catch (error) {
      console.error("Error saving climb:", error);
      alert("Failed to save climb.");
    }
  };

  return (

    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>Climb On!</ThemedText>

      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Select Difficulty:</Text>

        
        <TouchableOpacity 
          style={styles.pickerContainer} 
          onPress={() => setShowPicker(true)}
        >
          <Text style={styles.selectedValueText}>{selectedValue}</Text>
        </TouchableOpacity>

        {/*Creates Modal to allow choosing difficulty*/}
        <Modal
          animationType="slide"
          transparent={true}
          visible={showPicker}
          onRequestClose={() => setShowPicker(false)} 
        >
          <View style={styles.modalContainer}>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={selectedValue}
                onValueChange={(itemValue) => {
                  setSelectedValue(itemValue.toString());
                  setShowPicker(false); 
                }}
                style={styles.picker}
                itemStyle={{ color: 'black' }} 
              >
                <Picker.Item label="5" value="5" />
                <Picker.Item label="6" value="6" />
                <Picker.Item label="7" value="7" />
                <Picker.Item label="8" value="8" />
                <Picker.Item label="9" value="9" />
                <Picker.Item label="10a" value="10a" />
                <Picker.Item label="10b" value="10b" />
                <Picker.Item label="10c" value="10c" />
                <Picker.Item label="10d" value="10d" />
                <Picker.Item label="11a" value="11a" />
                <Picker.Item label="11b" value="11b" />
                <Picker.Item label="11c" value="11c" />
                <Picker.Item label="11d" value="11d" />
                <Picker.Item label="12a" value="12a" />
                <Picker.Item label="12b" value="12b" />
                <Picker.Item label="12c" value="12c" />
                <Picker.Item label="12d" value="12d" />
              </Picker>
            </View>
          </View>
        </Modal>
      </View>

      
      {/* Location Input */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Enter Location:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter location"
          placeholderTextColor="white"
          value={location}
          onChangeText={setLocation}
        />
      </View>

      {/* Timer */}
      <View style={styles.timerContainer}>
        <Text 
        style={styles.timerText}>{formatTime(seconds)}
        </Text>
      </View>

      {/* Timer Controls */}
      <View style={styles.buttonContainer}>
        <CustomButton 
          text={isRunning ? "Pause Timer" : "Start Timer"} 
          onPress={() => setIsRunning(!isRunning)} 
          type = "Primary"
          fgColor={isRunning ? "white" : "black"}
          bgColor={isRunning ? "#FF5733" : ""}
        />
      </View>

      <View style={styles.buttonContainer}>
        <CustomButton 
        text="Reset Timer" 
        onPress={() => { setIsRunning(false); setSeconds(0); }} 
        type="Secondary" 
        bgColor= "white"
        />
      
      </View>
      <StatusBar style="auto" />
      {/* 📸 Image Picker Buttons */}
      <View style={styles.imageButtons}>
        <Button title="Take a Picture 📸" onPress={takePicture} />
        <Button title="Pick from Gallery 📂" onPress={pickImage} />
      </View>

      {/* 🖼️ Show Selected Image */}
      {image && <Image source={{ uri: image }} style={styles.image} />}
      {/* Save Climb Button */}
      <CustomButton 
      text="Save Climb" 
      onPress={saveClimb} 
      type = "Tertiary"
      bgColor="#28A745" 
      fgColor ="black"
      />
    <View style={styles.container}>
  
    </View>


      <StatusBar style="auto" />
    </ThemedView>

  );
};

const styles = StyleSheet.create({

  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    paddingTop: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    marginTop:50,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 15,
  },

  label: {
    fontSize: 16,
    marginBottom: 5,
    textAlign: 'center',
    color: 'white'
  },
  pickerContainer: {
    backgroundColor: '#e0e0e0',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  selectedValueText: {
    fontSize: 18,
    color: 'black', 
  },
  picker: {
    height: 200, 
    width: '100%',
    backgroundColor: '#f8f8f8',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
  },
  pickerWrapper: {
    backgroundColor: 'white',
    width: '80%',
    padding: 10,
    borderRadius: 10,
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    textAlign: 'center',
    color: "white",
  },
  timerContainer: {
    marginVertical: 20,
    padding: 15,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
  },
  timerText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: 10,
    width: '100%',
  },
  image: { width: 125, height: 125, marginTop: 10 },
  imageButtons: { flexDirection: "row", gap: 10, marginBottom: 10 },
});

export default Record;

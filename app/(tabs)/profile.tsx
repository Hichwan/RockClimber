import { useState, useEffect } from "react";
import { 
  View, Text, TextInput, StyleSheet, Alert, Button, SafeAreaView, Modal, TouchableOpacity, Switch, Linking, ScrollView 
} from "react-native";
import { getAuth, updatePassword, deleteUser, signOut, User } from "firebase/auth";
import { collection, query, where, getDocs, deleteDoc } from "firebase/firestore";
import { db } from "../../src/config/firebaseConfig";
import { Picker } from "@react-native-picker/picker";
import CustomButton from '../../components/CustomButton/CustomButton';
import { useRouter } from 'expo-router';
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";

const ProfileScreen = () => {
  const router = useRouter();
  const auth = getAuth();
  const user: User | null = auth.currentUser;  // Explicitly typed

  const [newPassword, setNewPassword] = useState("");
  const [selectedRange, setSelectedRange] = useState("all"); // Default to 'all'
  const [showPicker, setShowPicker] = useState(false);

  const [gpsEnabled, setGpsEnabled] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<string | null>(null);

  //Change Password Function
  const handleChangePassword = async () => {
    if (!user) {
      Alert.alert("Error", "No user is logged in.");
      return;
    }
    
    if (!newPassword) {
      Alert.alert("Error", "Please enter a new password.");
      return;
    }

    try {
      await updatePassword(user, newPassword);
      Alert.alert("Success", "Password updated successfully!");
      setNewPassword(""); // Clear input field
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error updating password:", error);
        Alert.alert("Error", error.message);
      } else {
        Alert.alert("Error", "An unknown error occurred.");
      }
    }
  };

  useEffect(() => {
    const loadGpsSetting = async () => {
      try {
        const storedGps = await AsyncStorage.getItem("gpsEnabled");
        setGpsEnabled(storedGps === "true");
      } catch (error) {
        console.error("Error loading GPS setting:", error);
      }
    };
    loadGpsSetting();
  }, []);

  const handleToggleGps = async (value: boolean) => {
    if (value) {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        setPermissionStatus("Granted");
        setGpsEnabled(true);
        await AsyncStorage.setItem("gpsEnabled", "true");

        await AsyncStorage.setItem("gpsUpdated", Date.now().toString());
      } else {
        Alert.alert(
          "Permission Denied",
          "Location access is required for GPS. Enable it in settings.",
          [
            { text: "Open Settings", onPress: () => Linking.openSettings() },
            { text: "Cancel", style: "cancel" },
          ]
        );
        setPermissionStatus("Denied");
        setGpsEnabled(false);
        await AsyncStorage.setItem("gpsEnabled", "false"); // Ensure stored state is updated
      }
    } else {
      setPermissionStatus("Disabled");
      setGpsEnabled(false);
      await AsyncStorage.setItem("gpsEnabled", "false"); // Save to AsyncStorage
      await AsyncStorage.setItem("gpsUpdated", Date.now().toString()); 
    }
  };

  //Delete Account Function
  const handleDeleteAccount = async () => {
    if (!user) {
      Alert.alert("Error", "No user is logged in.");
      return;
    }

    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive", 
          onPress: async () => {
            try {
              await deleteUser(user);
              Alert.alert("Account Deleted", "Your account has been successfully deleted.");
              signOut(auth);
            } catch (error: unknown) {
              if (error instanceof Error) {
                console.error("Error deleting account:", error);
                Alert.alert("Error", error.message);
              } else {
                Alert.alert("Error", "An unknown error occurred.");
              }
            }
          }
        }
      ]
    );
  };

  //Delete Climbing History Function
  const handleClearHistory = async () => {
    if (!user) {
      Alert.alert("Error", "No user is logged in.");
      return;
    }

    
    const climbsRef = collection(db, "climbing_sessions");

    // Filter based on selected range
    let timeLimit;
    const now = new Date();

    switch (selectedRange) {
      case "1day":
        timeLimit = new Date(now.setDate(now.getDate() - 1));
        break;
      case "1week":
        timeLimit = new Date(now.setDate(now.getDate() - 7));
        break;
      case "1month":
        timeLimit = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case "1year":
        timeLimit = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      default:
        timeLimit = null; // Delete all
    }

    try {
      const q = query(
        climbsRef,
        where("userId", "==", user.uid)
      );

      const querySnapshot = await getDocs(q);
      let deletedCount = 0;

      for (const doc of querySnapshot.docs) {
        const climb = doc.data();
        
        if (!timeLimit || (climb.timestamp && climb.timestamp.toDate() >= timeLimit)) {
          await deleteDoc(doc.ref);
          deletedCount++;
        }
      }

      Alert.alert("History Cleared", `${deletedCount} climb(s) removed.`);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error deleting history:", error);
        Alert.alert("Error", error.message);
      } else {
        Alert.alert("Error", "An unknown error occurred.");
      }
    }
  };

  const handleLogOut = () => {    
    Alert.alert(
      "Log Out",  
      "Are you sure you want to log out?",  
      [
        {
          text: "Cancel",
          style: "cancel",  
        },
        {
          text: "Log Out",
          style: "destructive",  
          onPress: async () => {
            try {
              await signOut(auth);
              router.push("../SignInScreen"); 
            } catch (error) {
              console.error("Error logging out:", error);
              Alert.alert("Error", "Failed to log out. Please try again.");
            }
          },
        },
      ]
    );
  }
  return (
    <SafeAreaView style={styles.safeContainer}>
    <ScrollView showsVerticalScrollIndicator={true}>
    <View style={styles.container}>
      <Text style={styles.title}>👤 Profile Settings</Text>

      {/* Change Password */}
      <View style={styles.section}>
        <Text style={styles.label}>Change Password</Text>
        <TextInput
          style={styles.input}
          placeholder="New Password"
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
        />
        <CustomButton 
        text="Update Password" 
        onPress={handleChangePassword} 
        type="Primary" />
      </View>

      <View style={styles.section}>
          <Text style={styles.label}>Enable GPS for Auto Location</Text>
          <Switch 
            value={gpsEnabled} 
            onValueChange={handleToggleGps} 
          />
          <Text>Status: {permissionStatus || "Unknown"}</Text>
        </View>


 {/*  Delete Climbing History */}
<View style={styles.section}>
  <Text style={styles.label}>Clear Climbing History</Text>

  {/* Button to open Picker */}
  <TouchableOpacity style={styles.pickerButton} onPress={() => setShowPicker(true)}>
    <Text style={styles.pickerText}>
      {selectedRange === "all" ? "All History" : selectedRange}
    </Text>
  </TouchableOpacity>

  {/* Modal for Picker */}
  <Modal visible={showPicker} transparent={true} animationType="slide">
    <View style={styles.modalContainer}>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={selectedRange}
          onValueChange={(itemValue) => {
            setSelectedRange(itemValue);
            setShowPicker(false);  
          }}
          style={{ backgroundColor: "#ffffff", color: "#000000" }} 
          itemStyle={{ color: "black" }} 
        >
          <Picker.Item label="All History" value="all" />
          <Picker.Item label="Last 1 Day" value="1 day" />
          <Picker.Item label="Last 1 Week" value="1 week" />
          <Picker.Item label="Last 1 Month" value="1 month" />
          <Picker.Item label="Last 1 Year" value="1 year" />
        </Picker>

        {/* Close Button */}
        <Button title="Close" onPress={() => setShowPicker(false)} color="#007BFF" />
      </View>
    </View>
  </Modal>

  {/* Clear History */}
  <CustomButton
        text="Clear History" 
        onPress={handleClearHistory} 
        type = "Tertiary"
        bgColor = "#FF5733"
        fgColor="black" />
      </View>

      {/* Log Out */}
      <View style={styles.section}>
        <Text style={styles.label}>Log Out </Text>
        <CustomButton
        text="Log Out" 
        onPress={handleLogOut} 
        type = "Secondary" />
      </View>

      {/*  Delete Account */}
      <View style={styles.section}>
        <Text style={styles.deletelabel}>Delete Account </Text>
        <CustomButton
        text="Delete Account" 
        onPress={handleDeleteAccount} 
        type = "Tertiary"
        bgColor = "red"
        fgColor="black" />
      </View>


    </View>
    </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  safeContainer: {
    flex: 1,
    backgroundColor: "#fff",  
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  section: {
    marginBottom: 30,
    padding: 15,
    backgroundColor: "#f8f8f8",
    borderRadius: 10,
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  deletelabel: {
    color: "#DC3545",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
  },
  picker: {
    width: "100%",
    height: 50,
    backgroundColor: "#f8f8f8",
    marginBottom: 10,
  },
  pickerButton: {
    backgroundColor: "#e0e0e0",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
  },
  pickerText: {
    fontSize: 18,
    color: "black",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", 
  },
  pickerWrapper: {
    backgroundColor: "white",
    width: "80%",
    padding: 10,
    borderRadius: 10,
  },
});

export default ProfileScreen;

import { useEffect, useState } from "react";
import { 
  View, Text, FlatList, StyleSheet, Dimensions, SafeAreaView, TextInput
} from "react-native";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../../src/config/firebaseConfig";
import { getAuth } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const screenWidth = Dimensions.get("window").width;

// Difficulty Mapping & MET Values

const metValues: Record<string, number> = {
  "5": 5.8, "6": 5.8, "7": 5.8, "8": 5.8, "9": 5.8,
  "10a": 5.8, "10b": 5.8, "10c": 5.8, "10d": 5.8,
  "11a": 7.5, "11b": 7.5, "11c": 7.5, "11d": 7.5,
  "12a": 7.5, "12b": 7.5, "12c": 7.5, "12d": 7.5,
  "13a": 7.5, "13b": 7.5, "13c": 7.5, "13d": 7.5,
  "14a": 7.5, "14b": 7.5, "14c": 7.5, "14d": 7.5
};

const Daily = () => {
  type ClimbingSession = {
    id: string;
    userId: string;
    timestamp: any;
    location?: string;
    difficulty: string;
    timeSpent: number;
  };

  const [sessions, setSessions] = useState<ClimbingSession[]>([]);
  const [userWeight, setUserWeight] = useState<number>(70); // Default weight in kg
  const [currentDate, setCurrentDate] = useState<string>("");

  useEffect(() => {
    const authInstance = getAuth();
    const user = authInstance.currentUser;

    if (!user) {
      console.warn("User is not logged in. Skipping Firestore query.");
      return;
    }

    console.log(" Logged-in User ID:", user.uid);

    // ** Firestore Query - Only Fetch Today's Climbs**
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of day

    const formattedDate = today.toLocaleDateString();
    setCurrentDate(formattedDate); // Set date at the top

    const q = query(
      collection(db, "climbing_sessions"),
      where("userId", "==", user.uid),
      where("timestamp", ">=", today),
      orderBy("timestamp", "asc")
    );

    const unsubscribeFirestore = onSnapshot(q, (querySnapshot) => {
      try {
        const sessionData: ClimbingSession[] = querySnapshot.docs.map(doc => {
          const { id, ...data } = doc.data() as ClimbingSession;
          return { id: doc.id, ...data };
        });

        console.log(" Today's Climbs:", sessionData);
        setSessions(sessionData);
      } catch (error) {
        console.error(" Firestore Permission Error:", error);
      }
    });

    return () => unsubscribeFirestore();
  }, []);

  // Load Weight from Storage
  useEffect(() => {
    const loadWeight = async () => {
      try {
        const storedWeight = await AsyncStorage.getItem("userWeight");
        if (storedWeight) {
          setUserWeight(parseFloat(storedWeight));
        }
      } catch (error) {
        console.error(" Error loading weight:", error);
      }
    };

    loadWeight();
  }, []);

  // Save Weight to Storage
  const handleWeightChange = async (text: string) => {
    if (text === "") {
      setUserWeight(0);  // If empty, set to 0
      await AsyncStorage.setItem("userWeight", "0");
      return;
    }
  
    const weight = parseFloat(text);
    if (!isNaN(weight)) {
      setUserWeight(weight);
      await AsyncStorage.setItem("userWeight", weight.toString());
    }
  };

  // Calculate Calories Burned
  const calculateCalories = (difficulty: string, timeSpent: number): number => {
    const metValue = metValues[difficulty] || 5.8;
    return ((metValue * (userWeight*2.2) * 3.5) / 200) * (timeSpent / 60);
  };

  // Stats Calculation
  const getStats = () => {
    if (!sessions.length) return { totalCalories: "0 kcal", totalTime: "0m 0s" };

    const totalTime = sessions.reduce((sum, session) => sum + session.timeSpent, 0);
    const totalCalories = sessions.reduce((sum, session) => sum + calculateCalories(session.difficulty, session.timeSpent), 0);

    return {
      totalTime: `${Math.floor(totalTime / 60)}m ${totalTime % 60}s`,
      totalCalories: `${totalCalories.toFixed(2)} kcal`
    };
  };

  const { totalTime, totalCalories } = getStats();

  return (
    <SafeAreaView style={styles.safeContainer}> 
      <View style={styles.container}>

        {/* Date Display */}
        <Text style={styles.dateText}>{currentDate}</Text>

        {/* Weight Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Enter Weight (lb):</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="70"
            value={userWeight.toString()}
            onChangeText={handleWeightChange}
          />
        </View>

        {/* Stats Section */}
        <View style={styles.statsContainer}>
          <Text>⏳ Total Time: {totalTime}</Text>
          <Text>🔥 Calories Burned: {totalCalories}</Text>
        </View>

        {/* List of Today's Climbing Sessions */}
        <FlatList
          data={sessions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.sessionItem}>
              <Text>📅 {new Date(item.timestamp?.toDate()).toLocaleTimeString()}</Text>
              <Text>📍 {item.location || "Unknown"}</Text>
              <Text>🎯 Difficulty: {item.difficulty}</Text>
              <Text>⏳ Time Spent: {Math.floor(item.timeSpent / 60)}m {item.timeSpent % 60}s</Text>
              <Text>🔥 Calories Burned: {calculateCalories(item.difficulty, item.timeSpent).toFixed(2)} kcal</Text>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  safeContainer: { flex: 1, backgroundColor: "#fff" },
  dateText: { fontSize: 20, fontWeight: "bold", textAlign: "center", marginBottom: 10 },
  inputContainer: { marginBottom: 15 },
  label: { fontSize: 16, marginBottom: 5 },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 5, padding: 10, textAlign: "center" },
  statsContainer: { padding: 10, backgroundColor: "#f8f8f8", marginBottom: 20, borderRadius: 10 },
  sessionItem: { padding: 10, borderBottomWidth: 1, borderBottomColor: "#ddd", marginBottom: 5 },
});

export default Daily;

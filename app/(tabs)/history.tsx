import { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, Dimensions, SafeAreaView } from "react-native";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { db, auth } from "../../src/config/firebaseConfig";
import { LineChart } from "react-native-chart-kit";
import { onAuthStateChanged, getAuth, signOut } from "firebase/auth";

const screenWidth = Dimensions.get("window").width;

// Difficulty Mapping
const difficultyMap: Record<string, number> = {
  "5": 1, "6": 2, "7": 3, "8": 4, "9": 5, 
  "10a": 6, "10b": 7, "10c": 8, "10d": 9, 
  "11a": 10, "11b": 11, "11c": 12, "11d": 13, 
  "12a": 14, "12b": 15, "12c": 16, "12d": 17, 
  "13a": 18, "13b": 19, "13c": 20, "13d": 21, 
  "14a": 22, "14b": 23, "14c": 24, "14d": 25
};

// Reverse Mapping for Y-Axis Labels
const reverseDifficultyMap = Object.fromEntries(
  Object.entries(difficultyMap).map(([grade, value]) => [value, grade])
);

const HistoryScreen = () => {
  type ClimbingSession = {
    id: string;
    userId: string;
    timestamp: any;  
    location?: string;
    difficulty: string;
    timeSpent: number;
  };
  
  const [sessions, setSessions] = useState<ClimbingSession[]>([]);

  useEffect(() => {
    const authInstance = getAuth();
    
    // Listen for user authentication changes
    const unsubscribeAuth = onAuthStateChanged(authInstance, async (user) => {
      if (!user) {
        console.warn("User is not logged in. Skipping Firestore query.");
        return;
      }
  
      console.log("✅ Logged-in User ID:", user.uid);
  
      // ** Force token refresh every 55 minutes (before it expires)**
      user.getIdToken(true).catch(async (error) => {
        console.error("🔥 Token Refresh Failed:", error);
        alert("Session expired. Please log in again.");
        await signOut(authInstance);
      });
  
      // ** Firestore Query**
      const q = query(
        collection(db, "climbing_sessions"),
        where("userId", "==", auth.currentUser?.uid), 
        orderBy("timestamp", "asc")
      );
      
  
      const unsubscribeFirestore = onSnapshot(q, (querySnapshot) => {
        try {
          const sessionData: ClimbingSession[] = querySnapshot.docs.map(doc => {
            const { id, ...data } = doc.data() as ClimbingSession;
            return { id: doc.id, ...data };
          });
  
          console.log(" Fetched Data:", sessionData);
          setSessions(sessionData);
        } catch (error) {
          console.error(" Firestore Permission Error:", error);
        }
      });
  
      return () => unsubscribeFirestore();
    });
  
    return () => unsubscribeAuth();
  }, []);
  
  

  //Filter to get only the hardest climb per day
  const getHardestClimbPerDay = () => {
    const dailyMaxMap: Record<string, ClimbingSession> = {};
  
    sessions.forEach(session => {
      if (!session.timestamp || !session.timestamp.toDate) {
        console.warn("Skipping session with missing timestamp:", session);
        return; 
      }
  
      const date = new Date(session.timestamp.toDate()).toLocaleDateString();
      const difficultyValue = difficultyMap[session.difficulty] || 0;
  
      if (!dailyMaxMap[date] || difficultyValue > difficultyMap[dailyMaxMap[date].difficulty]) {
        dailyMaxMap[date] = session;
      }
    });
  
    return Object.values(dailyMaxMap); 
  };
  const hardestClimbs = getHardestClimbPerDay();

  //Chart Data (Filtered for hardest climb per day)
  const difficultyData = {
    labels: hardestClimbs.map(session => {
      try {
        return new Date(session.timestamp?.toDate()).toLocaleDateString();
      } catch (error) {
        return "N/A";
      }
    }),
    datasets: [{
      data: hardestClimbs.map(session => difficultyMap[session.difficulty] || 0)
    }]
  };

  //Stats Calculation
  const getStats = () => {
    if (!sessions.length) return { avgTime: "0m 0s", totalTime: "0m 0s", avgDifficulty: "N/A", hardestClimb: "N/A" };

    const totalTime = sessions.reduce((sum, session) => sum + session.timeSpent, 0);
    const avgTime = totalTime / sessions.length;

    const difficulties = sessions.map(session => difficultyMap[session.difficulty] || 0);
    const avgDifficulty = reverseDifficultyMap[Math.round(difficulties.reduce((sum, diff) => sum + diff, 0) / difficulties.length)] || "N/A";
    const hardestClimb = reverseDifficultyMap[Math.max(...difficulties)] || "N/A";

    return { 
      avgTime: `${Math.floor(avgTime / 60)}m ${avgTime % 60}s`,
      totalTime: `${Math.floor(totalTime / 60)}m ${totalTime % 60}s`,
      avgDifficulty,
      hardestClimb
    };
  };

  const { avgTime, totalTime, avgDifficulty, hardestClimb } = getStats()
  const sortedSessions = [...hardestClimbs]
  .filter(session => session.timestamp && session.timestamp.toDate) 
  .sort((a, b) => a.timestamp.toDate().getTime() - b.timestamp.toDate().getTime());
  const yAxisFormatter = (yLabel: string) => {
    const numValue = parseFloat(yLabel); 
    return reverseDifficultyMap[Math.round(numValue)] || yLabel; 
  };
  const yAxisLabels = [...new Set(difficultyData.datasets[0].data)]
  .sort((a, b) => a - b) 
  .map(value => reverseDifficultyMap[Math.round(value)] || value); 

  return (
    <SafeAreaView style={styles.safeContainer}>  
    <View style={styles.container}>
      {/* Stats Section */}
      <View style={styles.statsContainer}>
        <Text>📊 Average Time: {avgTime}</Text>
        <Text>⏳ Total Time: {totalTime}</Text>
        <Text>🎯 Average Difficulty: {avgDifficulty}</Text>
        <Text>🏆 Hardest Climb: {hardestClimb}</Text>
      </View>
      
      {/* **📈 Difficulty Progression Chart** */}
      {hardestClimbs.length > 0 ? (
        <View>
          <Text style={styles.chartTitle}>📈 Hardest Climb Per Day</Text>
          <LineChart
              data={{
                labels: sortedSessions.map(session => 
                  new Date(session.timestamp.toDate()).toLocaleDateString()
                ),
                datasets: [
                  {
                    data: sortedSessions.map(session => difficultyMap[session.difficulty] || 0), 
                  },
                ],
              }}
              width={Dimensions.get("window").width - 20}
              height={220}
              chartConfig={{
                backgroundGradientFrom: "#fff",
                backgroundGradientTo: "#fff",
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                propsForDots: { r: "4", strokeWidth: "2", stroke: "#000" },
                formatYLabel: yAxisFormatter, 
              }}
              bezier
            />

        </View>
      ) : (
        <Text>No climb data available yet.</Text>
      )}

      {/* **📝 List of Climbing Sessions** */}
      <FlatList
        data={sessions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.sessionItem}>
            <Text>📅 {new Date(item.timestamp?.toDate()).toLocaleDateString()}</Text>
            <Text>📍 {item.location || "Unknown"}</Text>
            <Text>🎯 Difficulty: {reverseDifficultyMap[item.difficulty] || item.difficulty}</Text>
            <Text>⏳ Time Spent: {Math.floor(item.timeSpent / 60)}m {item.timeSpent % 60}s</Text>
          </View>
  )}
/>

    </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    backgroundColor: "#fff" },

    safeContainer: {
      flex: 1,
      backgroundColor: "#fff",  
    },
    
  statsContainer: { 
    padding: 10, 
    backgroundColor: "#f8f8f8", 
    marginBottom: 20, 
    borderRadius: 10 },

  chartTitle: { 
    fontSize: 18, 
    fontWeight: "bold", 
    marginBottom: 10, 
    textAlign: "center" },

  sessionItem: { 
    padding: 10, 
    borderBottomWidth: 1, 
    borderBottomColor: "#ddd", 
    marginBottom: 5 },
});

export default HistoryScreen;

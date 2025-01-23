import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Button } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { auth, db } from "../../src/config/firebaseConfig";

export default function HomeScreen() {
  const [manualModel, setManualModel] = useState<{ slope: number; intercept: number } | null>(null);
  const [prediction, setPrediction] = useState<number | null>(null);
  const [userData, setUserData] = useState<{ session: number; difficulty: number }[]>([]);
  const [metrics, setMetrics] = useState<{ r2: number; mse: number } | null>(null);

  useEffect(() => {
    async function initializeData() {
      const userClimbs = await fetchUserClimbs();
      setUserData(userClimbs);

      if (userClimbs.length > 2) {
        await retrainModelWithoutTensorFlow(userClimbs, true);
      } else {
        console.log("⚠️ Not enough data to train the manual model.");
      }
    }

    initializeData();
  }, []);

  const fetchUserClimbs = async () => {
    try {
      if (!auth.currentUser) {
        console.error("User not logged in.");
        return [];
      }

      const q = query(
        collection(db, "climbing_sessions"),
        where("userId", "==", auth.currentUser.uid),
        orderBy("timestamp", "asc")
      );

      const querySnapshot = await getDocs(q);
      const climbs = querySnapshot.docs.map((doc, index) => ({
        session: index + 1,
        difficulty: parseInt(doc.data().difficulty) || 5,
      }));

      console.log("📊 Loaded Climb Data:", climbs);
      return climbs;
    } catch (error) {
      console.error("Error fetching user climbs:", error);
      return [];
    }
  };

  const retrainModelWithoutTensorFlow = async (
    data: { session: number; difficulty: number }[],
    isAutomatic: boolean
  ) => {
    if (data.length < 2) {
      console.log("⚠️ Not enough data to train the manual model.");
      return;
    }

    console.log(`${isAutomatic ? "⏳ Automatically retraining" : "⏳ Manually retraining"} manual model...`);

    try {
      const x = data.map((d) => d.session);
      const y = data.map((d) => d.difficulty);

      const meanX = x.reduce((a, b) => a + b, 0) / x.length;
      const meanY = y.reduce((a, b) => a + b, 0) / y.length;

      let numerator = 0;
      let denominator = 0;
      for (let i = 0; i < x.length; i++) {
        numerator += (x[i] - meanX) * (y[i] - meanY);
        denominator += (x[i] - meanX) ** 2;
      }
      const m = numerator / denominator;
      const b = meanY - m * meanX;

      console.log(`📊 Manual Model Coefficients: m=${m}, b=${b}`);
      setManualModel({ slope: m, intercept: b });

      // Predict y values based on the model
      const yPredicted = x.map((xi) => m * xi + b);

      // Calculate MSE
      const mse =
        y.reduce((sum, yi, i) => sum + (yi - yPredicted[i]) ** 2, 0) / y.length;

      // Calculate R²
      const totalVariance = y.reduce((sum, yi) => sum + (yi - meanY) ** 2, 0);
      const residualVariance = y.reduce(
        (sum, yi, i) => sum + (yi - yPredicted[i]) ** 2,
        0
      );
      const r2 = 1 - residualVariance / totalVariance;

      console.log(`📊 Manual Metrics: MSE=${mse}, R²=${r2}`);
      setMetrics({ r2, mse });
    } catch (error) {
      console.error("Error during manual training:", error);
    }
  };

  const predictNextWithoutTensorFlow = (
    model: { slope: number; intercept: number } | null,
    nextSession: number
  ) => {
    if (!model) {
      console.error("Manual model is not trained yet.");
      return null;
    }

    const { slope, intercept } = model;
    const predictedDifficulty = slope * nextSession + intercept;
    return predictedDifficulty;
  };

  const handlePredictNextClimb = () => {
    const nextSession = userData.length + 1;
    const predictedDifficulty = predictNextWithoutTensorFlow(manualModel, nextSession);

    if (predictedDifficulty !== null) {
      setPrediction(Math.round(predictedDifficulty));
      console.log(`📊 Predicted Difficulty for Session ${nextSession}: ${Math.round(predictedDifficulty)}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Climb On!</Text>
      <Button
        title="Retrain Manual Model"
        onPress={() => retrainModelWithoutTensorFlow(userData, false)}
        disabled={userData.length < 2}
      />
      <Button
        title="Predict Next Climb (Manual)"
        onPress={handlePredictNextClimb}
        disabled={userData.length < 2 || !manualModel}
      />
      {metrics && (
        <>
          <Text style={styles.metrics}>R²: {metrics.r2.toFixed(2)}</Text>
          <Text style={styles.metrics}>MSE: {metrics.mse.toFixed(2)}</Text>
        </>
      )}
      {prediction && <Text style={styles.prediction}>Next Difficulty: {prediction}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 24, fontWeight: "bold" },
  metrics: { fontSize: 16, color: "purple", marginTop: 10 },
  prediction: { fontSize: 20, color: "blue", marginTop: 10 },
});

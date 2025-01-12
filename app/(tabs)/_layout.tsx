import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = "help-circle-outline";

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "History") {
            iconName = focused ? "time" : "time-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "blue",
        tabBarInactiveTintColor: "gray",
        headerShown: false,
      })}
    >
      <Tabs.Screen name="Home" options={{ title: "Home" }} />
      <Tabs.Screen name="History" options={{ title: "History" }} />
      <Tabs.Screen name="Profile" options={{ title: "Profile" }} />
    </Tabs>
  );
}



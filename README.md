**Rock Climbing Tracker App**


A React Native app for tracking rock climbing sessions, including difficulty, location, time spent, and calories burned. Built with Firebase (Firestore, Authentication) and Expo.

**Features**


User Authentication



Sign up, log in, and secure authentication via Firebase.
Ability to reset passwords.
Climbing Session Logging

Start, pause, and reset a timer for each climb.
Select climbing difficulty from V grades / Yosemite Decimal System (YDS).
GPS integration for automatic location tracking (with manual override).
Saves climb history to Firebase Firestore.
Progress Tracking

Displays climbing history in a line chart using react-native-chart-kit.
Allows interactive graph clicks to highlight sessions in history.
Computes calories burned based on MET values and user weight.
User Preferences & Settings

Enable/Disable GPS tracking from the Profile tab.
Dynamically update weight for accurate calorie calculation.
Delete past climbs selectively (e.g., last day, week, month, or all).
Delete entire account if needed.
Smooth User Experience

Modal Pickers for difficulty and time range selection.
Confirmation prompts before destructive actions.
Dark & Light Mode Support via Expo’s ThemedView.


**Tech Stack**


Technology	Purpose
React Native	Cross-platform mobile development
Expo	Simplified development & deployment
Firebase Firestore	Cloud database for storing climb logs
Firebase Authentication	User authentication and security
React Navigation	Tab navigation for Home, History, Profile
Expo Location API	GPS-based location tracking
AsyncStorage	Persistent user settings (e.g., GPS enabled/disabled)
React Native Chart Kit	Data visualization for climbing progress


**1. Installation & Running Locally**

 Clone the repository:

sh
Copy code
git clone https://github.com/yourusername/RockClimbingTracker.git
cd RockClimbingTracker

**2. Install dependencies:**

sh
Copy code
npm install
or

sh
Copy code
yarn install

**3. Set up Firebase:**

Create a Firebase project at Firebase Console
Enable Firestore and Authentication (Email/Password)
Copy Firebase config into src/config/firebaseConfig.ts

**4. Run the app:**

sh
Copy code
expo start
Scan the QR code with Expo Go (iOS/Android)
Or run in an emulator:
sh
Copy code
npm run android  # For Android
npm run ios      # For iOS (Mac only)


**1/12/25 - Version 2.2.1** 

- Fixed minor bugs and added QOL features.

- To be added:

- Analytic Panel

- Ability to switch between different climbing disciplines

- Get the Google and Apple Log In to work

- Ability to search around for suggestions

- Cleaner UI/Profile Page

- Ability to share with others via social media!

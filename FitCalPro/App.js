// import { StatusBar } from 'expo-status-bar';
// import { initializeApp } from "firebase/app";
// import { StyleSheet, Text, View } from 'react-native';
// import app from './firebase';
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import LoginScreen from './screens/LoginScreen';
// import HomeScreen from './screens/HomeScreen';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// // const Tab = createBottomTabNavigator();

// // function MyTabs() {
// //   return (
// //     <NavigationContainer>
// //     <Tab.Navigator>
// //       <Tab.Screen name="Login" component={LoginScreen} />
// //       <Tab.Screen name="Home" component={HomeScreen} />
// //     </Tab.Navigator>
// //     </NavigationContainer>

// //   );
// // }

// const Stack = createNativeStackNavigator();

// export default function App() {
//   return (
//     <NavigationContainer>
//     <Stack.Navigator>
//       <Stack.Screen name="Login" component={LoginScreen} />
//       <Stack.Screen name="Home" component={HomeScreen} />

//     </Stack.Navigator>
//   </NavigationContainer>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });

import { StatusBar } from 'expo-status-bar';
import { initializeApp } from 'firebase/app';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import WorkoutScreen from './screens/WorkoutScreen';
import DietScreen from './screens/DietScreen.js';
import ProfileScreen from './screens/ProfileScreen';
 import app from './firebase';
import RegisterScreen from './screens/RegisterScreen';
import ScanFoodScreen from './screens/ScanFoodScreen';
import HealthProfileScreen from './screens/healthprofileScreen.js';
import AddFoodForm from './components/addFoodForm';


 const Stack = createNativeStackNavigator();
 const Tab = createBottomTabNavigator();
 
 // WorkoutDetails screen component
 const WorkoutDetailsScreen = ({ route }) => {
   const { level, workout } = route.params;
 
   return (
     <View style={styles.container}>
       <Text style={styles.heading}>{level}</Text>
       <Text style={styles.workoutDetails}>{workout} Details</Text>
     </View>
   );
 };
 
 // HomeTabs component with a nested Stack.Navigator for WorkoutDetails
 //       <Tab.Screen name="Workout" component={WorkoutScreen} options={{ headerShown: false }}/>

 const HomeTabs = () => {
   return (
     <Tab.Navigator>
       <Tab.Screen name="Diet" component={DietScreen} />
       <Tab.Screen name="Scan" component={ScanFoodScreen}/>
       <Tab.Screen name="Profile" component={ProfileScreen} />
     </Tab.Navigator>
   );
 };
 
 export default function App() {
   return (
     <NavigationContainer>
       <Stack.Navigator initialRouteName="Login">
         <Stack.Screen name="Login" component={LoginScreen} />
         <Stack.Screen name="Register" component={RegisterScreen} />
         <Stack.Screen name="HomeTabs" component={HomeTabs} options={{ headerShown: false }} />
         <Stack.Screen name="WorkoutDetails" component={WorkoutDetailsScreen}  />
         <Stack.Screen name="HealthProfile" component={HealthProfileScreen} />
         <Stack.Screen name='AddFoodForm' component={AddFoodForm} />
       </Stack.Navigator>
     </NavigationContainer>
   );
 }
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});


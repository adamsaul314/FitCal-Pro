import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Button, Modal, TouchableOpacity } from 'react-native';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, query, where, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import DateSelector from '../components/dateSelector';
import MealTypeSection from '../components/MealTypeSection';
import AddFoodForm from '../components/addFoodForm';
import { useNavigation } from '@react-navigation/native';
import { useNutrition } from './NutritionContext';

const DietScreen = ({ route }) => {
  const [loggedItems, setLoggedItems] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [calorieGoal, setCalorieGoal] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [currentMealType, setCurrentMealType] = useState('');

  const { setNutritionData } = useNutrition();

  const closeModal = () => {
    setIsFormVisible(false);
  };

  const totals = useMemo(() => loggedItems.reduce((acc, item) => ({
    carbs: acc.carbs + item.carbs,
    protein: acc.protein + item.protein,
    fat: acc.fat + item.fat,
    kcal: acc.kcal + item.kcal,
  }), { carbs: 0, protein: 0, fat: 0, kcal: 0 }), [loggedItems]);

  const db = getFirestore();
  const auth = getAuth();
  const user = auth.currentUser;
  const navigation = useNavigation();

  useEffect(() => {
    if (user) {
      // Fetching logged foods
      const fetchLoggedFoodsForDate = (date) => {
        const formattedDate = date.toISOString().split('T')[0]; // Format date as YYYY-MM-DD
        const q = query(
          collection(db, "loggedFoods"),
          where("userId", "==", user.uid),
          where("date", "==", formattedDate)
        );
  
        return onSnapshot(q, (querySnapshot) => {
          const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setLoggedItems(items);
        });
      };
  
      // Fetching caloric needs
      const userProfileRef = doc(db, "userProfiles", user.uid);
      const unsubscribeProfile = onSnapshot(userProfileRef, (docSnap) => {
        if (docSnap.exists()) {
          const userData = docSnap.data();
          setCalorieGoal(userData.caloricNeeds);
        } else {
          console.log("No profile data found.");
        }
      });

      const unsubscribeFoods = fetchLoggedFoodsForDate(selectedDate);
  
      // Cleanup function
      return () => {
        unsubscribeFoods();
        unsubscribeProfile();
      };
    }
  }, [selectedDate]); // Depend on selectedDate

  useEffect(() => {
    // Call this when totals or calorieGoal changes
    setNutritionData({ totals, calorieGoal });
  }, [totals, calorieGoal]);
  
  const handleAddFood = (mealType) => {
    setCurrentMealType(mealType);
    setIsFormVisible(true); // Show the form
  };

  const handleScanFood = (mealType) => {
    console.log(`Scan Food For ${mealType}`);
    navigation.navigate('Scan', {mealType});
  };

  const removeItem = async (itemId) => {
    try {
      await deleteDoc(doc(db, "loggedFoods", itemId));
      // Filter out the removed item from the loggedItems state
      const updatedItems = loggedItems.filter(item => item.id !== itemId);
      setLoggedItems(updatedItems); // Update the state with the filtered items
    } catch (error) {
      console.error("Error removing document: ", error);
    }
  };

  // const totals = loggedItems.reduce(
  //   (acc, item) => ({
  //     carbs: acc.carbs + item.carbs,
  //     protein: acc.protein + item.protein,
  //     fat: acc.fat + item.fat,
  //     kcal: acc.kcal + item.kcal,
  //   }),
  //   { carbs: 0, protein: 0, fat: 0, kcal: 0 }
  // );

  return (
    <ScrollView style={styles.container}>
      <DateSelector onDateSelected={setSelectedDate} />
      <MealTypeSection mealType="Breakfast" onAddFood={() => handleAddFood('Breakfast')} onScanFood={() => handleScanFood('Breakfast')} loggedItems={loggedItems.filter(item => item.mealType === 'Breakfast')} removeItem={removeItem}/>
      <MealTypeSection mealType="Lunch" onAddFood={() => handleAddFood('Lunch')} onScanFood={() => handleScanFood('Lunch')} loggedItems={loggedItems.filter(item => item.mealType === 'Lunch')} removeItem={removeItem}/>
      <MealTypeSection mealType="Dinner" onAddFood={() => handleAddFood('Dinner')} onScanFood={() => handleScanFood('Dinner')} loggedItems={loggedItems.filter(item => item.mealType === 'Dinner')} removeItem={removeItem}/>
      <MealTypeSection mealType="Snacks" onAddFood={() => handleAddFood('Snacks')} onScanFood={() => handleScanFood('Snacks')} loggedItems={loggedItems.filter(item => item.mealType === 'Snacks')} removeItem={removeItem}/>

      <View style={styles.totalsContainer}>
        <Text style={styles.totalText}>Total Carbs: {totals.carbs.toFixed(2)}g</Text>
        <Text style={styles.totalText}>Total Protein: {totals.protein.toFixed(2)}g</Text>
        <Text style={styles.totalText}>Total Fat: {totals.fat.toFixed(2)}g</Text>
        <Text style={styles.totalText}>Total Kcal: {totals.kcal.toFixed(2)}</Text>
        {calorieGoal && <Text style={styles.totalText}>Calorie Goal: {Math.round(calorieGoal)}</Text>}
      </View>

      <Modal visible={isFormVisible} animationType="slide">
  <View style={styles.modalContainer}>
    <View style={styles.modalContent}>
      <TouchableOpacity style={styles.closeButton} onPress={() => setIsFormVisible(false)}>
        <Text style={styles.closeButtonText}>Close</Text>
      </TouchableOpacity>
      <AddFoodForm userId={user.uid} date={selectedDate.toISOString().split('T')[0]} mealType={currentMealType} closeModal={closeModal}/>
    </View>
  </View>
</Modal>

    </ScrollView>
  );
};

// Updated StyleSheet for DietScreen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2', // Consistent background color
  },
  totalsContainer: {
    margin: 10,
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#FFF', // Card-like design for totals
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  totalText: {
    fontWeight: 'bold',
    color: '#333', // Improved readability
    marginBottom: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333', // Section titles similar to HomeScreen
    marginTop: 20,
    marginBottom: 10,
  },
  mealTypeSection: {
    margin: 10,
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#FFF', // Use card design for each meal type
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '50%',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    width: '90%', // Adjusted for better layout
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 10,
  },
  closeButtonText: {
    fontSize: 16,
    color: '#007bff', // Keeping it consistent with the button color
  },
});


export default DietScreen;

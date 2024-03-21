import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Button} from 'react-native';
import { getAuth } from 'firebase/auth';
import { firestore } from '../firebase';
import { collection, query, where, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import DateSelector from '../components/dateSelector';
import { getFirestore } from 'firebase/firestore';
import MealTypeSection from '../components/MealTypeSection';
import AddFoodForm from '../components/addFoodForm';




const DietScreen = ({ route }) => {
  const [loggedItems, setLoggedItems] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [calorieGoal, setCalorieGoal] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [currentMealType, setCurrentMealType] = useState('');

  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const auth = getAuth();
    const db = getFirestore();
    const user = auth.currentUser;
  
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
  
  const handleAddFood = (mealType) => {
    setCurrentMealType(mealType);
    setIsFormVisible(true); // Show the form
  };

  const handleScanFood = (mealType) => {
    console.log(`Scan Food For ${mealType}`);
  };

  // Function to render items for a specific meal type
  const renderItemsForMealType = (mealType) => {
    return loggedItems
      .filter(item => item.mealType === mealType)
      .map((item, index) => (
        <View key={index} style={styles.itemContainer}>
          <Text>Product Name: {item.productName}</Text>
          <Text>Carbs: {item.carbs.toFixed(2)}g</Text>
          <Text>Protein: {item.protein.toFixed(2)}g</Text>
          <Text>Fat: {item.fat.toFixed(2)}g</Text>
          <Text>Kcal: {item.kcal.toFixed(2)}</Text>
          <Button title="Remove" onPress={() => removeItem(item.id)} />
        </View>
      ));
  };

  const totals = loggedItems.reduce(
    (acc, item) => ({
      carbs: acc.carbs + item.carbs,
      protein: acc.protein + item.protein,
      fat: acc.fat + item.fat,
      kcal: acc.kcal + item.kcal,
    }),
    { carbs: 0, protein: 0, fat: 0, kcal: 0 }
  );

  const removeItem = async (itemId) => {
    try {
      await deleteDoc(doc(firestore, "loggedFoods", itemId));
      // Filter out the removed item from the loggedItems state
      const updatedItems = loggedItems.filter(item => item.id !== itemId);
      setLoggedItems(updatedItems); // Update the state with the filtered items
    } catch (error) {
      console.error("Error removing document: ", error);
    }
  };
  

  

  return (
    <ScrollView style={styles.container}>
      <DateSelector onDateSelected={setSelectedDate} />
      <MealTypeSection mealType="Breakfast" onAddFood={() => handleAddFood('Breakfast')} onScanFood={() => handleScanFood('Breakfast')} loggedItems={loggedItems.filter(item => item.mealType === 'Breakfast')} removeItem={removeItem}/>
      <MealTypeSection mealType="Lunch" onAddFood={() => handleAddFood('Lunch')} onScanFood={() => handleScanFood('Lunch')} loggedItems={loggedItems.filter(item => item.mealType === 'Lunch')} removeItem={removeItem}/>
      <MealTypeSection mealType="Dinner" onAddFood={() => handleAddFood('Dinner')} onScanFood={() => handleScanFood('Dinner')} loggedItems={loggedItems.filter(item => item.mealType === 'Dinner')} removeItem={removeItem}/>
      <MealTypeSection mealType="Snacks" onAddFood={() => handleAddFood('Snacks')} onScanFood={() => handleScanFood('Snacks')} loggedItems={loggedItems.filter(item => item.mealType === 'Snacks')} removeItem={removeItem}/>

      {isFormVisible && (
        <AddFoodForm 
        userId={user.uid} 
        date={selectedDate.toISOString().split('T')[0]} 
        mealType={currentMealType}
        />
        )}
        
      {/* {loggedItems.map((item, index) => (
        <View key={index} style={styles.itemContainer}>
          <Text>Product Name: {item.productName}</Text>
          <Text>Carbs: {item.carbs.toFixed(2)}g</Text>
          <Text>Protein: {item.protein.toFixed(2)}g</Text>
          <Text>Fat: {item.fat.toFixed(2)}g</Text>
          <Text>Kcal: {item.kcal.toFixed(2)}</Text>
          <Button title="Remove" onPress={() => removeItem(item.id)} />
        </View>
      ))} */}
      <View style={styles.totalsContainer}>
        <Text style={styles.totalText}>Total Carbs: {totals.carbs.toFixed(2)}g</Text>
        <Text style={styles.totalText}>Total Protein: {totals.protein.toFixed(2)}g</Text>
        <Text style={styles.totalText}>Total Fat: {totals.fat.toFixed(2)}g</Text>
        <Text style={styles.totalText}>Total Kcal: {totals.kcal.toFixed(2)}</Text>
        {calorieGoal && <Text style={styles.totalText}>Calorie Goal: {Math.round(calorieGoal)}</Text>
}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  itemContainer: {
    margin: 10,
    padding: 10,
    backgroundColor: '#f0f0f0',
  },
  totalsContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#ddd',
  },
  totalText: {
    fontWeight: 'bold',
  },
});

export default DietScreen;

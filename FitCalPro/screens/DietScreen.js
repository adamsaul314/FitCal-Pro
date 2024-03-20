import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Button} from 'react-native';
import { getAuth } from 'firebase/auth';
import { firestore } from '../firebase';
import { collection, query, where, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import DateSelector from '../components/dateSelector';



const DietScreen = ({ route }) => {
  const [loggedItems, setLoggedItems] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    const fetchLoggedFoodsForDate = async (date) => {
      const formattedDate = date.toISOString().split('T')[0]; // Format date as YYYY-MM-DD
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        const q = query(
          collection(firestore, "loggedFoods"),
          where("userId", "==", user.uid),
          where("date", "==", formattedDate)
        );
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setLoggedItems(items);
        });
        return () => unsubscribe();
      }
    };
  
    fetchLoggedFoodsForDate(selectedDate);
  }, [selectedDate]); // Depend on selectedDate



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
    } catch (error) {
      console.error("Error removing document: ", error);
    }
  };

  

  return (
    <ScrollView style={styles.container}>
      <DateSelector onDateSelected={setSelectedDate} />
      {loggedItems.map((item, index) => (
        <View key={index} style={styles.itemContainer}>
          <Text>Product Name: {item.productName}</Text>
          <Text>Carbs: {item.carbs.toFixed(2)}g</Text>
          <Text>Protein: {item.protein.toFixed(2)}g</Text>
          <Text>Fat: {item.fat.toFixed(2)}g</Text>
          <Text>Kcal: {item.kcal.toFixed(2)}</Text>
          <Button title="Remove" onPress={() => removeItem(item.id)} />
        </View>
      ))}
      <View style={styles.totalsContainer}>
        <Text style={styles.totalText}>Total Carbs: {totals.carbs.toFixed(2)}g</Text>
        <Text style={styles.totalText}>Total Protein: {totals.protein.toFixed(2)}g</Text>
        <Text style={styles.totalText}>Total Fat: {totals.fat.toFixed(2)}g</Text>
        <Text style={styles.totalText}>Total Kcal: {totals.kcal.toFixed(2)}</Text>
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

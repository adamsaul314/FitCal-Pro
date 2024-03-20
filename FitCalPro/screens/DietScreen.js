import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Button} from 'react-native';
import { getAuth } from 'firebase/auth';
import { firestore } from '../firebase';
import { collection, query, where, onSnapshot, deleteDoc, doc } from 'firebase/firestore';



const DietScreen = ({ route }) => {
  const [loggedItems, setLoggedItems] = useState([]);

  // useEffect(() => {
  //   console.log(route.params?.nutritionalInfo);
  //   if (route.params?.nutritionalInfo) {
  //     setLoggedItems(currentItems => [...currentItems, route.params.nutritionalInfo]);
  //   }
  // }, [route.params?.nutritionalInfo]);

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      const q = query(collection(firestore, "loggedFoods"), where("userId", "==", user.uid));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setLoggedItems(items);
      });
      return () => unsubscribe(); // Cleanup subscription on unmount
    }
  }, []); 

  // The rest of your component remains the same

  
  const totals = loggedItems.reduce(
    (acc, item) => ({
      carbs: acc.carbs + item.carbs,
      protein: acc.protein + item.protein,
      fat: acc.fat + item.fat,
      kcal: acc.kcal + item.kcal,
    }),
    { carbs: 0, protein: 0, fat: 0, kcal: 0 }
  );

  // const removeItem = (index) => {
  //   setLoggedItems(currentItems => currentItems.filter((item, idx) => idx !== index));
  // };

  const removeItem = async (itemId) => {
    try {
      await deleteDoc(doc(firestore, "loggedFoods", itemId));
      // Optional: Show a success message or perform additional state updates if necessary
    } catch (error) {
      console.error("Error removing document: ", error);
      // Optional: Show an error message
    }
  };

  return (
    <ScrollView style={styles.container}>
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

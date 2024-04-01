import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { addDoc, collection } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import DietScreen from '../screens/DietScreen';

const AddFoodForm = ({ userId, date, mealType, closeModal }) => {
  const [productName, setProductName] = useState('');
  const [carbs, setCarbs] = useState('');
  const [protein, setProtein] = useState('');
  const [fat, setFat] = useState('');
  const [kcal, setKcal] = useState('');

  const db = getFirestore();

  const handleAddFood = async (foodItem) => {
    if (!productName || !carbs || !protein || !fat || !kcal) {
      alert('Please fill out all fields.');
      return;
    }

    if (!userId || !date) {
        alert('Missing user ID or date.');
        return;
      }

    try {
      const docRef = await addDoc(collection(db, "loggedFoods"), {
        userId,
        productName,
        carbs: parseFloat(carbs),
        protein: parseFloat(protein),
        fat: parseFloat(fat),
        kcal: parseFloat(kcal),
        date,
        mealType,
        // Include any other necessary fields, such as userId or date
      });

      console.log("Document written with ID: ", docRef.id);
      // Optionally, navigate back or reset form fields here
      closeModal();
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

//   userId,
//       productName: nutritionalInfo.productName,
//       carbs: nutritionalInfo.carbs,
//       protein: nutritionalInfo.protein,
//       fat: nutritionalInfo.fat,
//       kcal: nutritionalInfo.kcal,
//       consumedWeight,
//       date,

  return (
    <View style={styles.container}>
      <TextInput placeholder="Product Name" value={productName} onChangeText={setProductName} style={styles.input} placeholderTextColor="#666" />
      <TextInput placeholder="Carbs (g)" value={carbs} onChangeText={setCarbs} keyboardType="numeric" style={styles.input} placeholderTextColor="#666" />
      <TextInput placeholder="Protein (g)" value={protein} onChangeText={setProtein} keyboardType="numeric" style={styles.input} placeholderTextColor="#666" />
      <TextInput placeholder="Fat (g)" value={fat} onChangeText={setFat} keyboardType="numeric" style={styles.input} placeholderTextColor="#666" />
      <TextInput placeholder="Kcal" value={kcal} onChangeText={setKcal} keyboardType="numeric" style={styles.input} placeholderTextColor="#666" />
      <Button title="Add Food" onPress={handleAddFood} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 10,
  },
});

export default AddFoodForm;

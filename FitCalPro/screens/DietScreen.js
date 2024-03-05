import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const DietScreen = ({ route }) => {
  const [loggedItems, setLoggedItems] = useState([]);

  useEffect(() => {
    console.log(route.params?.nutritionalInfo);
    if (route.params?.nutritionalInfo) {
      setLoggedItems(currentItems => [...currentItems, route.params.nutritionalInfo]);
    }
  }, [route.params?.nutritionalInfo]);

  const totals = loggedItems.reduce(
    (acc, item) => ({
      carbs: acc.carbs + item.carbs,
      protein: acc.protein + item.protein,
      fat: acc.fat + item.fat,
      kcal: acc.kcal + item.kcal,
    }),
    { carbs: 0, protein: 0, fat: 0, kcal: 0 }
  );

  return (
    <ScrollView style={styles.container}>
      {loggedItems.map((item, index) => (
        <View key={index} style={styles.itemContainer}>
          <Text>Product Name: {item.productName}</Text>
          <Text>Carbs: {item.carbs.toFixed(2)}g</Text>
          <Text>Protein: {item.protein.toFixed(2)}g</Text>
          <Text>Fat: {item.fat.toFixed(2)}g</Text>
          <Text>Kcal: {item.kcal.toFixed(2)}</Text>
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

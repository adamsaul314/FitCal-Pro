import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const DietScreen = ({ route }) => {
  const { onAddToDiet, nutritionalInfo } = route.params ?? {};
  const [dietData, setDietData] = useState({ carbs: 0, protein: 0, fat: 0, kcal: 0 });

  useEffect(() => {
    if (onAddToDiet && nutritionalInfo) {
      onAddToDiet(nutritionalInfo);
    }
  }, [onAddToDiet, nutritionalInfo]);

  // Log the dietData to check its values
  useEffect(() => {
    console.log('Diet Data:', dietData);
  }, [dietData]);

  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>Carbs: {dietData.carbs.toFixed(0)}g</Text>
        <Text style={styles.infoText}>Protein: {dietData.protein.toFixed(0)}g</Text>
        <Text style={styles.infoText}>Fat: {dietData.fat.toFixed(0)}g</Text>
        <Text style={styles.infoText}>Kcal: {dietData.kcal.toFixed(0)} kcal</Text>
      </View>
      <Button
        title="Clear Diet"
        onPress={() => setDietData({ carbs: 0, protein: 0, fat: 0, kcal: 0 })}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 16,
  },
  infoText: {
    marginBottom: 10,
  },
});

export default DietScreen;

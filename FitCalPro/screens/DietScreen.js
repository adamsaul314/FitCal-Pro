import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const DietScreen = ({ route }) => {
  const [dietData, setDietData] = useState({ carbs: 0, protein: 0, fat: 0, kcal: 0 });

  useEffect(() => {
    if (route.params?.nutritionalInfo) {
      const { carbs, protein, fat, kcal } = route.params.nutritionalInfo;
      setDietData({ carbs, protein, fat, kcal });
    }
  }, [route.params?.nutritionalInfo]);

  return (
    <View style={styles.container}>
      <Text style={styles.infoText}>Carbs: {dietData.carbs}g</Text>
      <Text style={styles.infoText}>Protein: {dietData.protein}g</Text>
      <Text style={styles.infoText}>Fat: {dietData.fat}g</Text>
      <Text style={styles.infoText}>Kcal: {dietData.kcal}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 16,
    margin: 10,
  },
});

export default DietScreen;

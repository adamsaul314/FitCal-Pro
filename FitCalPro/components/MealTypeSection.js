import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const MealTypeSection = ({ mealType, onAddFood, onScanFood }) => {
  return (
    <View style={styles.mealTypeContainer}>
      <Text style={styles.mealTypeTitle}>{mealType}</Text>
      <View style={styles.mealTypeButtons}>
        <Button title="Add Food" onPress={onAddFood} />
        <Icon.Button name="camera" backgroundColor="#3b5998" onPress={onScanFood}>
          Scan
        </Icon.Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mealTypeContainer: {
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  mealTypeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  mealTypeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default MealTypeSection;

import React from 'react';
import { View, Text, StyleSheet, Button, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const MealTypeSection = ({ mealType, onAddFood, onScanFood, loggedItems }) => {
  return (
    <View style={styles.mealTypeContainer}>
      <Text style={styles.mealTypeTitle}>{mealType}</Text>
      {/* Display Logged Items */}
      <ScrollView style={styles.loggedItemsContainer} nestedScrollEnabled={true}>
        {loggedItems.map((item, index) => (
          <View key={index} style={styles.loggedItem}>
            <Text style={styles.itemText}>Product Name: {item.productName}</Text>
            <Text style={styles.itemText}>Carbs: {item.carbs.toFixed(2)}g</Text>
            <Text style={styles.itemText}>Protein: {item.protein.toFixed(2)}g</Text>
            <Text style={styles.itemText}>Fat: {item.fat.toFixed(2)}g</Text>
            <Text style={styles.itemText}>Kcal: {item.kcal.toFixed(2)}</Text>
            {/* Add a remove or edit button if necessary */}
          </View>
        ))}
      </ScrollView>
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
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  mealTypeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  mealTypeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  loggedItemsContainer: {
    maxHeight: 200, // Set a max height for scrollable area
  },
  loggedItem: {
    padding: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemText: {
    fontSize: 14,
  },
});

export default MealTypeSection;

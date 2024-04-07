import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const MealTypeSection = ({ mealType, onAddFood, onScanFood, loggedItems, removeItem }) => {
  const renderItem = ({ item }) => (
    <View style={styles.loggedItem}>
      <Icon name="food" size={20} color="#007bff" />
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.productName}</Text>
        <Text style={styles.itemInfo}>Carbs: {item.carbs}g | Protein: {item.protein}g | Fat: {item.fat}g | Kcal: {item.kcal}</Text>
      </View>
      <TouchableOpacity onPress={() => removeItem(item.id)} style={styles.removeButton}>
        <Icon name="trash-can-outline" size={20} color="#ff6347" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{mealType}</Text>
      <FlatList
        data={loggedItems}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        horizontal={false}
        showsVerticalScrollIndicator={false}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={onAddFood} style={[styles.button, styles.addButton]}>
          <Icon name="plus" size={20} color="white" />
          <Text style={styles.buttonText}>Add Food</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onScanFood} style={[styles.button, styles.scanButton]}>
          <Icon name="barcode-scan" size={20} color="white" />
          <Text style={styles.buttonText}>Scan</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007bff',
    marginBottom: 16,
  },
  loggedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  itemDetails: {
    flex: 1,
    marginLeft: 10,
  },
  itemName: {
    fontWeight: 'bold',
  },
  itemInfo: {
    color: '#666',
  },
  removeButton: {
    marginLeft: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  addButton: {
    backgroundColor: '#28a745',
  },
  scanButton: {
    backgroundColor: '#007bff',
  },
  buttonText: {
    marginLeft: 10,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default MealTypeSection;

import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, TextInput, Alert, Keyboard } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { useNavigation } from '@react-navigation/native';
import { getAuth } from 'firebase/auth';
import { firestore } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

const calculateAndAddToDiet = async () => {
  if (!consumedWeight) {
    Alert.alert('Please enter the weight of the food you are consuming.');
    return;
  }
  
  // Check for a logged-in user
  const user = getAuth().currentUser;
  if (!user) {
    Alert.alert('User not logged in', 'Please log in to continue.');
    return;
  }
  const userId = user.uid;

  const weightFactor = parseFloat(consumedWeight) / 100;
  const nutritionalInfo = {
    productName: foodData.productName,
    carbs: foodData.carbs * weightFactor,
    protein: foodData.protein * weightFactor,
    fat: foodData.fat * weightFactor,
    kcal: foodData.kcal * weightFactor,
  };

  // Add the current date in YYYY-MM-DD format
  const date = new Date().toISOString().split('T')[0];

  // Log the food to Firestore
  try {
    await addDoc(collection(firestore, 'loggedFoods'), {
      userId,
      productName: nutritionalInfo.productName,
      carbs: nutritionalInfo.carbs,
      protein: nutritionalInfo.protein,
      fat: nutritionalInfo.fat,
      kcal: nutritionalInfo.kcal,
      consumedWeight,
      date,
    });
    Alert.alert('Success', 'Food added to your log.');
    navigation.navigate('DietScreen', { nutritionalInfo });
  } catch (error) {
    console.error('Error logging food:', error);
    Alert.alert('Error logging food', error.message);
  }

  Keyboard.dismiss();
};


const ScanFoodScreen = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const navigation = useNavigation();
  const [scanned, setScanned] = useState(false);
  const [foodData, setFoodData] = useState(null);
  const [consumedWeight, setConsumedWeight] = useState('');

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const fetchFoodInfo = async (barcode) => {
    try {
      const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      if (data && data.product) {
        const { nutriments, product_name, product_quantity } = data.product;
        setFoodData({
          productName: product_name,
          productQuantity: product_quantity,
          carbs: nutriments.carbohydrates_100g || 0,
          protein: nutriments.proteins_100g || 0,
          fat: nutriments.fat_100g || 0,
          kcal: nutriments.energy_value || 0, // Ensure this key exists or use a fallback key
        });
        setScanned(true);
      } else {
        Alert.alert('No product found for the given barcode.');
      }
    } catch (error) {
      Alert.alert('Error fetching food information:', error.toString());
    }
  };

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    fetchFoodInfo(data);
  };

  const calculateAndAddToDiet = async () => {
    if (!consumedWeight) {
      Alert.alert('Please enter the weight of the food you are consuming.');
      return;
    }
    
    // Check for a logged-in user
    const user = getAuth().currentUser;
    if (!user) {
      Alert.alert('User not logged in', 'Please log in to continue.');
      return;
    }
    const userId = user.uid;
  
    const weightFactor = parseFloat(consumedWeight) / 100;
    const nutritionalInfo = {
      productName: foodData.productName,
      carbs: foodData.carbs * weightFactor,
      protein: foodData.protein * weightFactor,
      fat: foodData.fat * weightFactor,
      kcal: foodData.kcal * weightFactor,
    };
  
    // Add the current date in YYYY-MM-DD format
    const date = new Date().toISOString().split('T')[0];
  
    // Log the food to Firestore
    try {
      await addDoc(collection(firestore, 'loggedFoods'), {
        userId,
        productName: nutritionalInfo.productName,
        carbs: nutritionalInfo.carbs,
        protein: nutritionalInfo.protein,
        fat: nutritionalInfo.fat,
        kcal: nutritionalInfo.kcal,
        consumedWeight,
        date,
      });
      Alert.alert('Success', 'Food added to your log.');
      navigation.navigate('DietScreen', { nutritionalInfo });
    } catch (error) {
      console.error('Error logging food:', error);
      Alert.alert('Error logging food', error.message);
    }
  
    Keyboard.dismiss();
  };
  

  return (
    <View style={styles.container}>
      {hasPermission === null ? (
        <Text>Requesting camera permission</Text>
      ) : hasPermission === false ? (
        <Text>No access to camera</Text>
      ) : (
        <>
          {!scanned && (
            <BarCodeScanner
              onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
              style={StyleSheet.absoluteFillObject}
            />
          )}
          {scanned && (
            <View style={styles.infoContainer}>
              <Text style={styles.infoText}>
                {foodData ? `Product Name: ${foodData.productName}` : 'Scan a barcode to start'}
              </Text>
              <Text style={styles.infoText}>
                {foodData ? `Serving Size: ${foodData.productQuantity}` : ''}
              </Text>
              {/* Input for the consumed weight */}
              <TextInput
                style={styles.input}
                onChangeText={text => setConsumedWeight(text)}
                value={consumedWeight}
                placeholder="Enter weight in grams"
                keyboardType="numeric"
              />
              <Button title="Add to Diet" onPress={calculateAndAddToDiet} />
              <Button title="Scan Another" onPress={() => setScanned(false)} />
            </View>
          )}
        </>
      )}
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
    marginTop: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoText: {
    fontSize: 16,
    margin: 5,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: '80%', // Adjust as necessary
  },
});

export default ScanFoodScreen;

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  TextInput,
  Alert,
  Keyboard,
  TouchableWithoutFeedback
} from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { useNavigation } from '@react-navigation/native';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

const ScanFoodScreen = ({ route }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const navigation = useNavigation();
  const [scanned, setScanned] = useState(false);
  const [foodData, setFoodData] = useState(null);
  const [consumedWeight, setConsumedWeight] = useState('');
  const { mealType } = route.params; // mealType received from navigation parameter

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
          kcal: nutriments.energy_value || 0,
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

    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      Alert.alert('User not logged in', 'Please log in to continue.');
      return;
    }
    const db = getFirestore();
    const userId = user.uid;

    const weightFactor = parseFloat(consumedWeight) / 100;
    const nutritionalInfo = {
      productName: foodData.productName,
      carbs: foodData.carbs * weightFactor,
      protein: foodData.protein * weightFactor,
      fat: foodData.fat * weightFactor,
      kcal: foodData.kcal * weightFactor,
    };

    const date = new Date().toISOString().split('T')[0];

    try {
      await addDoc(collection(db, 'loggedFoods'), {
        userId,
        mealType,
        date,
        ...nutritionalInfo,
        consumedWeight: parseFloat(consumedWeight),
      });
      Alert.alert('Success', 'Food added to your log.');
      navigation.goBack(); // Changed to goBack for returning to the previous screen
    } catch (error) {
      console.error('Error logging food:', error);
      Alert.alert('Error logging food', error.message);
    }

    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
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
                  {foodData ? `Serving Size: ${foodData.productQuantity}g` : ''}
                </Text>
                <TextInput
                  style={styles.input}
                  onChangeText={setConsumedWeight}
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
    </TouchableWithoutFeedback>
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
    width: '80%',
  },
});

export default ScanFoodScreen;

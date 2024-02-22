import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';

const ScanFoodScreen = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [foodData, setFoodData] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const fetchFoodInfo = async (barcode) => {
    try {
      const response = await fetch(
        `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (data && data.product) {
        const fetchedFoodData = data.product;
        console.log('Food Information:', fetchedFoodData);

        // Extract specific nutritional information
        const { nutriments } = fetchedFoodData;
        const productName = fetchedFoodData.product_name;     
        const productQuantity = fetchedFoodData.product_quantity;
        const carbs = nutriments['carbohydrates_100g'] || 0;
        const protein = nutriments['proteins_100g'] || 0;
        const fat = nutriments['fat_100g'] || 0;
        const kcal = nutriments['energy-kcal_value_computed'] || 0;

        // Set the retrieved nutritional information in state
        setFoodData({ productName, productQuantity, carbs, protein, fat, kcal });
        setScanned(true);
      } else {
        console.warn('No product found for the given barcode.');
      }
    } catch (error) {
      console.error('Error fetching food information:', error);
    }
  };

  const resetScanner = () => {
    setScanned(false);
    setFoodData(null);
  };

  const startScanner = () => {
    setScanned(false);
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
            <View style={styles.scannerContainer}>
              <BarCodeScanner
                onBarCodeScanned={({ data }) => {
                  setScanned(true);
                  fetchFoodInfo(data);
                }}
                style={StyleSheet.absoluteFill}
              />
            </View>
          )}

          <View style={styles.buttonContainer}>
            {scanned ? (
              <View style={styles.infoContainer}>
                <Text style={styles.infoText}>
                  {foodData ? `Product Name: ${foodData.productName}` : ``}
                </Text>
                <Text style={styles.infoText}>
                  {foodData ? `Serving Size: ${foodData.productQuantity}` : ``}
                </Text>
                <Text style={styles.infoText}>
                  {foodData ? `Carbs: ${foodData.carbs.toFixed(0)}g` : 'Scan a Barcode'}
                </Text>
                <Text style={styles.infoText}>
                  {foodData ? `Protein: ${foodData.protein.toFixed(0)}g` : ''}
                </Text>
                <Text style={styles.infoText}>
                  {foodData ? `Fat: ${foodData.fat.toFixed(0)}g` : ''}
                </Text>
                <Text style={styles.infoText}>
                  {foodData ? `Kcal: ${foodData.kcal.toFixed(0)} kcal` : ''}
                </Text>
                <Button title="Scan Again" onPress={resetScanner} />
              </View>
            ) : (
              <Button title="Scan Barcode" onPress={startScanner} />
            )}
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  scannerContainer: {
    flex: 1,
  },
  buttonContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  infoContainer: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  infoText: {
    marginBottom: 10,
  },
});

export default ScanFoodScreen;

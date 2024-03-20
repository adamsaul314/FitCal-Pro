// firestoreService.js

import firestore from '@react-native-firebase/firestore';

/**
 * Adds a food log entry to Firestore.
 * @param {string} userId - The ID of the user logging the food.
 * @param {string} foodName - The name of the food.
 * @param {number} calories - The calorie content of the food.
 * @param {number} protein - The protein content of the food.
 * @param {number} carbs - The carbohydrate content of the food.
 * @param {number} fats - The fat content of the food.
 * @param {string} date - The date of the food log.
 * @returns A Promise resolved with the added document reference.
 */
export function addFoodLog(userId, foodName, calories, protein, carbs, fats, date) {
  return firestore().collection('loggedFoods').add({
    userId,
    date,
    foodName,
    calories,
    protein,
    carbs,
    fats
  });
}

// You can add more Firestore interaction functions here.

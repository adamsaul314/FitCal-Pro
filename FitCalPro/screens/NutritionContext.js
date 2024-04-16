// Create a file named NutritionContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';

const NutritionContext = createContext();

export const useNutrition = () => useContext(NutritionContext);

export const NutritionProvider = ({ children }) => {
  const [nutritionData, setNutritionData] = useState({
    totals: { carbs: 0, protein: 0, fat: 0, kcal: 0 },
    calorieGoal: 0,
  });

  useEffect(() => {
    // Example fetch function to get initial data
    const fetchInitialData = async () => {
      // Fetch data from local storage, API, etc.
      // For demonstration, using static data
      const initialData = {
        totals: { carbs: 0, protein: 0, fat: 0, kcal: 0 },
        calorieGoal: 0,
      };
      setNutritionData(initialData);
    };

    fetchInitialData();
  }, []);

  return (
    <NutritionContext.Provider value={{ nutritionData, setNutritionData }}>
      {children}
    </NutritionContext.Provider>
  );
};


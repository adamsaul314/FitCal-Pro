// Create a file named NutritionContext.js
import React, { createContext, useState, useContext } from 'react';

const NutritionContext = createContext();

export const useNutrition = () => useContext(NutritionContext);

export const NutritionProvider = ({ children }) => {
  const [nutritionData, setNutritionData] = useState({
    totals: { carbs: 0, protein: 0, fat: 0, kcal: 0 },
    calorieGoal: 0,
  });

  return (
    <NutritionContext.Provider value={{ nutritionData, setNutritionData }}>
      {children}
    </NutritionContext.Provider>
  );
};

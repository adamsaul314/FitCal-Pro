import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ProgressBarAndroid, Alert } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { useNutrition } from './NutritionContext';


const HomeScreen = () => {


  const [dailySummary, setDailySummary] = useState({
    caloriesConsumed: 0,
    macroNutrients: { carbs: 0, protein: 0, fat: 0 },
  });
  const [dailyGoals, setDailyGoals] = useState({
    calorieGoal: 2000,
    proteinGoal: 50,
    waterGoal: 8, // Liters
  });
  const [streaks, setStreaks] = useState(0);
  const [nutritionInsights, setNutritionInsights] = useState('');
  const [motivationalMessage, setMotivationalMessage] = useState('');

  const { nutritionData } = useNutrition();
  const { totals, calorieGoal } = nutritionData;

  

  // Placeholder for functions to fetch real data
  useEffect(() => {
    // Fetch daily summary, goals, and other info from backend or local storage
    // Dummy data below
    setDailySummary({
      caloriesConsumed: 1200,
      macroNutrients: { carbs: 100, protein: 55, fat: 30 },
    });
    setStreaks(5);
    setNutritionInsights('You tend to consume more sodium on weekends.');
    setMotivationalMessage('Great job! You’ve logged your meals for 30 consecutive days!');
  }, []);

  // Actual implementation would involve fetching data and calculating values

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.title}>Daily Summary</Text>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Calories</Text>
          <Text>Total Carbs: {totals.carbs.toFixed(2)}g</Text>
            <View style={styles.progressCircleContainer}>
            <AnimatedCircularProgress
              size={120} // Diameter of the circle
              width={15} // Thickness of the progress line
              fill={(dailySummary.caloriesConsumed / dailyGoals.calorieGoal) * 100} // Calculate the fill percentage
              tintColor="#00e0ff" // Color of the progress line
              backgroundColor="#3d5875" // Color of the remaining circle
            >
              {
                (fill) => (
                  <Text style={styles.caloriesCount}>
                    {dailySummary.caloriesConsumed} kcal
                  </Text>
                )
              }
            </AnimatedCircularProgress>
              <Text style={styles.caloriesCount}>{dailySummary.caloriesConsumed} kcal</Text>
            </View>
          <Text style={styles.goalText}>of {dailyGoals.calorieGoal} kcal goal</Text>
        </View>
      </View>

        
      {/* Nutrition Insights */}
        <View style={styles.section}>
            <Text style={styles.title}>Nutrition Insights</Text>
            <Text style={styles.text}>{nutritionInsights}</Text>
            {/* Additional insights as necessary */}
        </View>

      {/* Motivational Messages */}
    <View style={styles.section}>
        <Text style={styles.title}>Keep Going!</Text>
        <Text style={styles.text}>{motivationalMessage}</Text>
    </View>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  section: {
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 14,
  },
  progressBar: {
    height: 20,
    backgroundColor: 'grey',
    borderRadius: 10,
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
    borderRadius: 10,
  },

  card: {
    alignItems: 'center',
    margin: 10,
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#FFF',
    // Add shadow or elevation for depth
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  progressCircleContainer: {
    // Container styles for the circular progress bar
  },
  caloriesCount: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  goalText: {
    fontSize: 14,
    color: 'grey',
  },
});

export default HomeScreen;

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Dimensions } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { useNutrition } from './NutritionContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { PieChart } from 'react-native-chart-kit';

const HomeScreen = () => {
  const { nutritionData } = useNutrition();
  const { totals, calorieGoal } = nutritionData;

  // Calculate the total macros for percentage calculations
  const totalMacros = totals.carbs + totals.protein + totals.fat;

  // Update the data array to include only the name and percentage
  const data = [
    {
      name: `Carbs ${(totals.carbs / totalMacros * 100).toFixed(0)}%`, // Only include percentage in name
      population: totals.carbs, // This is necessary for the chart to calculate the slice size
      color: '#FFA500',
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    },
    {
      name: `Protein ${(totals.protein / totalMacros * 100).toFixed(0)}%`,
      population: totals.protein,
      color: '#00CED1',
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    },
    {
      name: `Fat ${(totals.fat / totalMacros * 100).toFixed(0)}%`,
      population: totals.fat,
      color: '#DEB887',
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    },
  ];
  

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
  };

  return (
    <ScrollView style={styles.container}>
      {/* Daily Summary Section */}
      <View style={styles.section}>
        <Text style={styles.title}>Daily Summary</Text>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Calories</Text>
          <AnimatedCircularProgress
            size={120}
            width={15}
            fill={(totals.kcal / calorieGoal) * 100}
            tintColor="#00e0ff"
            backgroundColor="#3d5875"
          >
            {(fill) => (
              <Text style={styles.caloriesCount}>
                {totals.kcal.toFixed(0)} kcal
              </Text>
            )}
          </AnimatedCircularProgress>
          <Text style={styles.goalText}>of {calorieGoal.toFixed(0)} kcal goal</Text>
        </View>
      </View>

      {/* Nutrition Insights Section */}
      <View style={styles.section}>
        <Text style={styles.title}>Daily Nutrition Insights</Text>
        <View style={styles.nutrientRow}>
          {/* Carbs */}
          <View style={styles.card}>
            <Icon name="corn" size={24} color="#FFA500" />
            <Text style={styles.cardTitle}>Carbs</Text>
            <Text style={styles.caloriesCount}>
              {totals.carbs.toFixed(0)}g 
            </Text>
          </View>

          {/* Protein */}
          <View style={styles.card}>
            <Icon name="fish" size={24} color="#00CED1" />
            <Text style={styles.cardTitle}>Protein</Text>
            <Text style={styles.caloriesCount}>
              {totals.protein.toFixed(0)}g
            </Text>
          </View>

          {/* Fat */}
          <View style={styles.card}>
            <Icon name="oil" size={24} color="#DEB887" />
            <Text style={styles.cardTitle}>Fat</Text>
            <Text style={styles.caloriesCount}>
              {totals.fat.toFixed(0)}g
            </Text>
          </View>
        </View>
      </View>

      {/* Calorie Breakdown */}
      <Text style={styles.title}>Calorie Breakdown</Text>
      <View style={styles.card}>
      <PieChart
        data={data}
        width={Dimensions.get('window').width}
        height={220}
        chartConfig={chartConfig}
        accessor={"population"}
        backgroundColor={"transparent"}
        paddingLeft={"15"}
        center={[10, 0]}
        absolute={false} // Make sure this is false to use the formatted name correctly
      />
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
  nutrientRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  card: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#FFF',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
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

// WorkoutDetailsScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const WorkoutDetailsScreen = ({ route }) => {
  const { level, workout } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{level}</Text>
      <Text style={styles.workoutDetails}>{workout} Details</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3498db', // Blue color
    marginBottom: 10,
  },
  workoutDetails: {
    fontSize: 16,
  },
});

export default WorkoutDetailsScreen;

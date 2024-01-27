// WorkoutDetailsScreen.js

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const WorkoutDetailsScreen = ({ route }) => {
  const { workoutDetails } = route.params;
  const { name, description } = workoutDetails;

  // Example exercise details (modify as needed)
  const exerciseDetails = {
    exercise: 'Squat',
    sets: 5,
    reps: 5,
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Workout Details</Text>
      <Text>Name: {name}</Text>
      <Text>Description: {description}</Text>
      <Text>Exercise: {exerciseDetails.exercise}</Text>
      <Text>Sets: {exerciseDetails.sets}</Text>
      <Text>Reps: {exerciseDetails.reps}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default WorkoutDetailsScreen;

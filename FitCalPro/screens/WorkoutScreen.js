import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';

const WorkoutScreen = () => {
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Workout A</Text>
        {renderExercise('Squats', 5, 5)}
        {renderExercise('Bench Press', 5, 5)}
        {renderExercise('Bent Over Row', 5, 5)}

        <Text style={[styles.title, styles.marginTop]}>Workout B</Text>
        {renderExercise('Squats', 5, 5)}
        {renderExercise('Deadlift', 1, 5)}
        {renderExercise('Overhead Press', 5, 5)}
      </View>
    </ScrollView>
  );
};

const renderExercise = (exercise, sets, reps) => (
  <View style={styles.exerciseContainer} key={exercise}>
    <Text style={styles.exerciseTitle}>Exercise: {exercise}</Text>
    <Text style={styles.setsReps}>Sets: {sets} Reps: {reps}</Text>
  </View>
);

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    paddingVertical: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  exerciseContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 20,
    borderRadius: 10,
    marginBottom: 10,
  },
  exerciseTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  setsReps: {
    fontSize: 16,
  },
  marginTop: {
    marginTop: 20,
  },
});

export default WorkoutScreen;

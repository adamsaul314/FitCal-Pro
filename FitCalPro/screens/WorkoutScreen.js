// WorkoutScreen.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const WorkoutScreen = ({ navigation }) => {
  const levels = [
    { level: 'Beginner', workouts: ['Workout 1', 'Workout 2', 'Workout 3'] },
    { level: 'Intermediate', workouts: ['Workout 4', 'Workout 5', 'Workout 6'] },
    { level: 'Advanced', workouts: ['Workout 7', 'Workout 8', 'Workout 9'] },
  ];

  const navigateToWorkoutScreen = (level, workout) => {
    navigation.navigate('WorkoutDetails', { level, workout });
  };

  return (
    <View style={styles.container}>
      {levels.map((item) => (
        <View key={item.level} style={styles.levelContainer}>
          <Text style={styles.heading}>{item.level}</Text>
          {item.workouts.map((workout, index) => (
            <TouchableOpacity
              key={workout}
              style={styles.workoutButton}
              onPress={() => navigateToWorkoutScreen(item.level, workout)}
            >
              <Text style={styles.workoutButtonText}>{workout}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  levelContainer: {
    marginBottom: 20,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3498db', // Blue color
    marginBottom: 10,
  },
  workoutButton: {
    backgroundColor: '#3498db', // Blue color
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  workoutButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default WorkoutScreen;

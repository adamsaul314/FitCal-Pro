import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView, Dimensions } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const HealthProfileScreen = () => {
const [genderOpen, setGenderOpen] = useState(false);
const [activityLevelOpen, setActivityLevelOpen] = useState(false);
const [healthGoalOpen, setHealthGoalOpen] = useState(false);

  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [activityLevel, setActivityLevel] = useState('');
  const [healthGoal, setHealthGoal] = useState('');
  const [bmi, setBmi] = useState(null);
  const [caloricNeeds, setCaloricNeeds] = useState(null);

  const [itemsForGender] = useState([
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
  ]);

  const [itemsForActivityLevel] = useState([
    { label: 'Sedentary', value: 'sedentary' },
    { label: 'Lightly Active', value: 'lightly_active' },
    { label: 'Moderately Active', value: 'moderately_active' },
    { label: 'Very Active', value: 'very_active' },
    { label: 'Extra Active', value: 'extra_active' },
  ]);

  const [itemsForHealthGoal] = useState([
    { label: 'Lose Weight', value: 'lose' },
    { label: 'Maintain Weight', value: 'maintain' },
    { label: 'Gain Weight', value: 'gain' },
  ]);
  
  

  const calculateBmi = () => {
    const heightInMeters = height / 100;
    const calculatedBmi = weight / (heightInMeters ** 2);
    setBmi(calculatedBmi.toFixed(2));
  };

  const calculateCaloricNeeds = () => {
    // Placeholder for BMR calculation logic
    let bmr;
    if (gender === 'male') {
      bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
    } else {
      bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
    }

    // Adjusting BMR based on activity level
    const activityFactors = {
      sedentary: 1.2,
      lightly_active: 1.375,
      moderately_active: 1.55,
      very_active: 1.725,
      extra_active: 1.9,
    };
    const tdee = bmr * activityFactors[activityLevel];

    // Adjusting for health goal
    if (healthGoal === 'lose') {
      setCaloricNeeds(tdee - 500); // Subtract 500 calories for weight loss
    } else if (healthGoal === 'gain') {
      setCaloricNeeds(tdee + 500); // Add 500 calories for weight gain
    } else {
      setCaloricNeeds(tdee); // Maintain weight
    }
  };


  const handleSubmit = () => {
    if (!name || !age || !gender || !height || !weight || !activityLevel || !healthGoal) {
      Alert.alert('Error', 'Please fill out all fields.');
      return;
    }
    calculateBmi();
    calculateCaloricNeeds();
  };

  return (
    <ScrollView contentContainerStyle={styles.contentContainer}>
      <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Age"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
      />
        <DropDownPicker
          open={genderOpen}
          value={gender}
          items={itemsForGender}
          setOpen={setGenderOpen}
          setValue={setGender}
          setItems={() => {}}
          zIndex={3000}
          zIndexInverse={1000}
          placeholder='Select Gender'
        />
        <TextInput
        style={styles.input}
        placeholder="Height in cm"
        value={height}
        onChangeText={setHeight}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Weight in kg"
        value={weight}
        onChangeText={setWeight}
        keyboardType="numeric"
      />
        <DropDownPicker
          open={activityLevelOpen}
          value={activityLevel}
          items={itemsForActivityLevel}
          setOpen={setActivityLevelOpen}
          setValue={setActivityLevel}
          setItems={() => {}}
          zIndex={2000}
          zIndexInverse={2000}
          placeholder='Select Activity Level'
        />
        <DropDownPicker
          open={healthGoalOpen}
          value={healthGoal}
          items={itemsForHealthGoal}
          setOpen={setHealthGoalOpen}
          setValue={setHealthGoal}
          setItems={() => {}}
          zIndex={1000}
          zIndexInverse={3000}
          placeholder='Select Health Goal'
        />

<Button title="Calculate" onPress={handleSubmit} />
      {bmi && <Text>Your BMI is: {bmi}</Text>}
      {caloricNeeds && (
        <Text>Daily Caloric Needs: {caloricNeeds.toFixed(0)} kcal</Text>)}
      </View>
    </ScrollView>
  );
};

const screenWidth = Dimensions.get('window').width;


const styles = StyleSheet.create({
    contentContainer: {
      flexGrow: 1, // Use flexGrow instead of flex to ensure it can expand to fit
      alignItems: 'center',
      paddingVertical: 20, // Ensure there's padding at the top and bottom
    },
    container: {
      width: screenWidth * 0.9, // Adjust based on your layout preference
      alignItems: 'center',
    },
    input: {
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      marginBottom: 10,
      width: '100%', // Make sure this is consistent with Picker width
      paddingHorizontal: 10,
    },
  });

export default HealthProfileScreen;

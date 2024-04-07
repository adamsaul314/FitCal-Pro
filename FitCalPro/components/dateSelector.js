import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const DateSelector = ({ onDateSelected }) => {
  const [date, setDate] = useState(new Date());

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setDate(currentDate);
    onDateSelected(currentDate);
  };

  return (
    <View style={styles.container}>
      <DateTimePicker
        value={date}
        mode="date"
        display="default"
        onChange={onChange}
        style={styles.picker}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // Style your container for the date picker here
    padding: 10,
    backgroundColor: '#fff', // Example background color
  },
  picker: {
    // Style your date picker here
  },
});

export default DateSelector;

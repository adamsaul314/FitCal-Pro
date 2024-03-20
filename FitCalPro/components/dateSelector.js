import React, { useState } from 'react';
import { View, Button } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const DateSelector = ({ onDateSelected }) => {
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    setShow(false);
    setDate(selectedDate || date);
    onDateSelected(selectedDate || date);
  };

  return (
    <View>
      <Button onPress={() => setShow(true)} title="Choose Date" />
      {show && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={onChange}
        />
      )}
    </View>
  );
};

export default DateSelector;
import React, { useState } from 'react'
import { StyleSheet, Text, View, Pressable } from 'react-native';
import Holicon from "../holicon"

const Counter: React.FC = () => {
  const [count, setCount] = useState(0);
  const incrementCount = () => setCount(count + 1);

  return (
    <View>
      <Text>You clicked {count} times</Text>

      <Pressable onPress={incrementCount} style={styles.button}>
        <Holicon icon="person" size={20} color="#0f0" />
        <Text style={styles.buttonText}>Click Me</Text>
      </Pressable>
    </View>
  )
}

export default Counter;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    borderWidth: 1,
    borderColor: 'red',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  buttonText: {
    flex: 1,
  }
});
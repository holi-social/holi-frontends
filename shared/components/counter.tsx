import React, { useState } from 'react'
import { StyleSheet, Text, View, Pressable } from 'react-native'

import Button from 'shared/components/ui/Button'
import Holicon from 'shared/components/ui/holicon'

const Counter: React.VoidFunctionComponent = () => {
  const [count, setCount] = useState(0)
  const incrementCount = () => setCount(count + 1)

  return (
    <View>
      <Text>You clicked {count} times</Text>
      <Pressable
        onPress={incrementCount}
        style={styles.button}
        testID="purePressable"
        accessible={true}
        accessibilityLabel="purePressable"
      >
        <Holicon icon="person" size={20} color="#0f0" />
        <Text style={styles.buttonText}>Click Me (pure pressable)</Text>
      </Pressable>
      <Button onPress={incrementCount} style={styles.marginTop}>
        Click Me (Button component)
      </Button>
    </View>
  )
}

export default Counter

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  marginTop: {
    marginTop: 20,
  },
  button: {
    borderWidth: 1,
    borderColor: 'red',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonText: {
    flex: 1,
  },
})

import React from 'react'
import { View, Button, Text, StyleSheet } from 'react-native'
import { clearRandomizationState } from '@holi-apps/volunteering/hooks/useRandomizedRecos'

/**
 * Debug component for testing volunteering recommendations randomization
 * This component provides a button to clear the randomization state
 */
const VolunteeringRecosDebug: React.FC = () => {
  const [message, setMessage] = React.useState<string>('')

  const handleClearState = async () => {
    try {
      await clearRandomizationState()
      setMessage('Randomization state cleared. Pull to refresh the feed.')
    } catch (error) {
      setMessage(`Error: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Volunteering Recos Debug</Text>
      <Button title="Clear Randomization State" onPress={handleClearState} />
      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    marginVertical: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 10,
  },
  message: {
    marginTop: 10,
    color: 'green',
  },
})

export default VolunteeringRecosDebug

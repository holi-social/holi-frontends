import { LinearGradient } from 'expo-linear-gradient'
import React from 'react'
import { StyleSheet } from 'react-native'

const ChallengeImageLoader = () => (
  <LinearGradient
    colors={['transparent', 'rgba(0, 0, 0, 0.5)']}
    style={styles.gradient}
    start={{ x: 0.5, y: 0.5 }}
    end={{ x: 0.5, y: 1 }}
  />
)

export default ChallengeImageLoader

const styles = StyleSheet.create({
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 60,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
})

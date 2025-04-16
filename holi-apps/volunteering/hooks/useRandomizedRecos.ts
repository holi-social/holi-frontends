import { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { logError } from '@holi/core/errors/helpers'
import { DEBUG_LOG_COMPONENTS } from '@holi/core/helpers/logging/constants'

const STORAGE_KEY = 'volunteering_recos_randomization'
const REFRESH_INTERVAL_MS = 24 * 60 * 60 * 1000 // 24 hours

// For development debugging only
const DEBUG = process.env.NODE_ENV === 'development' && DEBUG_LOG_COMPONENTS.RandomizationState

interface RandomizationState {
  lastRefreshTimestamp: number
  randomSeed: number
}

/**
 * Utility function to clear the randomization state from AsyncStorage
 * This is useful for testing the refresh functionality
 */
export const clearRandomizationState = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY)
    if (DEBUG) {
      // eslint-disable-next-line no-console
      console.log('Randomization state cleared successfully')
    }
  } catch (error) {
    logError(error, 'Failed to clear randomization state', {
      location: 'clearRandomizationState',
    })
  }
}

/**
 * Hook to randomize volunteering recommendations with daily rotation
 *
 * @param recos The original recommendations from the API
 * @param pageSize The number of recommendations to show
 * @returns Randomized recommendations
 */
export const useRandomizedRecos = <T>(recos: T[] = [], pageSize = 5): T[] => {
  const [randomizedRecos, setRandomizedRecos] = useState<T[]>([])

  useEffect(() => {
    const loadAndRandomize = async () => {
      try {
        // Skip if no recommendations
        if (!recos.length) {
          setRandomizedRecos([])
          return
        }

        // Load previous state
        const storedData = await AsyncStorage.getItem(STORAGE_KEY)
        let state: RandomizationState

        if (storedData) {
          state = JSON.parse(storedData)
          const now = Date.now()

          // Check if we need to refresh - using the current REFRESH_INTERVAL_MS value
          // This allows testing with different intervals without clearing storage
          if (now - state.lastRefreshTimestamp > REFRESH_INTERVAL_MS) {
            // Generate new random seed
            state = {
              lastRefreshTimestamp: now,
              randomSeed: Math.random(),
            }
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state))
            if (DEBUG) {
              // eslint-disable-next-line no-console
              console.log(`Randomization state refreshed with new seed: ${state.randomSeed}`)
            }
          } else if (DEBUG) {
            // eslint-disable-next-line no-console
            console.log(`Using existing randomization seed: ${state.randomSeed}`)
            // eslint-disable-next-line no-console
            console.log(`Time until next refresh: ${REFRESH_INTERVAL_MS - (now - state.lastRefreshTimestamp)}ms`)
          }
        } else {
          // First time, create initial state
          state = {
            lastRefreshTimestamp: Date.now(),
            randomSeed: Math.random(),
          }
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state))
          if (DEBUG) {
            // eslint-disable-next-line no-console
            console.log(`Initial randomization state created with seed: ${state.randomSeed}`)
          }
        }

        // randomize recommendations
        const shuffled = shuffleArray([...recos], state.randomSeed)
        setRandomizedRecos(shuffled.slice(0, pageSize))
      } catch (error) {
        logError(error, 'Error randomizing volunteering recommendations', {
          location: 'useRandomizedRecos.loadAndRandomize',
        })
        // Fallback to original recommendations
        setRandomizedRecos(recos.slice(0, pageSize))
      }
    }

    loadAndRandomize()
  }, [recos, pageSize])

  return randomizedRecos
}

/**
 * Shuffle array
 */
function shuffleArray<T>(array: T[], seed: number): T[] {
  const result = [...array]
  let currentSeed = seed

  // shuffle with seeded random
  for (let i = result.length - 1; i > 0; i--) {
    // Generate deterministic random number based on seed
    currentSeed = (currentSeed * 9301 + 49297) % 233280
    const randomValue = currentSeed / 233280
    const randomIndex = Math.floor(randomValue * (i + 1))

    // Swap elements
    const temp = result[i]
    result[i] = result[randomIndex]
    result[randomIndex] = temp
  }

  return result
}

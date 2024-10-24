import AsyncStorage from '@react-native-async-storage/async-storage'
import { useCallback, useEffect, useState } from 'react'

const NOTIFICATION_MODAL_STORAGE_KEY = '@NotificationModalState'

export interface ModalState {
  attempts: number
  lastAttemptDate: string
  lastShowTime: number
  expirationTime: number
  activeDays: number
  configActiveDays: number
}

export interface NotificationEligibilityConfig {
  maxAttemptsPerDay: number
  pauseDays: number
  activeDays: number
  minIntervalBetweenAttemptsMs: number
}

const checkNotificationEligibility = async (config: NotificationEligibilityConfig): Promise<boolean> => {
  const { maxAttemptsPerDay, pauseDays, activeDays, minIntervalBetweenAttemptsMs } = config

  try {
    const storedData = await AsyncStorage.getItem(NOTIFICATION_MODAL_STORAGE_KEY)
    const currentTime = new Date()
    const currentDate = currentTime.toDateString()

    let modalState: ModalState = storedData
      ? JSON.parse(storedData)
      : {
          attempts: 0,
          lastAttemptDate: '',
          lastShowTime: 0,
          expirationTime: 0,
          activeDays: 0,
          configActiveDays: activeDays,
        }

    // Reset state if config has changed
    if (modalState.configActiveDays !== activeDays) {
      modalState = { ...modalState, attempts: 0, activeDays: 0, configActiveDays: activeDays }
    }

    // Check if it's a new day and update modal state
    if (modalState.lastAttemptDate !== currentDate) {
      modalState.activeDays = modalState.activeDays < activeDays ? modalState.activeDays + 1 : 0
      modalState.expirationTime =
        modalState.activeDays === 0
          ? currentTime.getTime() + pauseDays * 24 * 60 * 60 * 1000
          : modalState.expirationTime
      modalState.attempts = 0
      modalState.lastAttemptDate = currentDate
    }

    // Check eligibility conditions
    const isInPausePeriod = currentTime.getTime() < modalState.expirationTime
    const hasReachedMaxAttempts = modalState.attempts >= maxAttemptsPerDay
    const hasNotWaitedLongEnough = currentTime.getTime() - modalState.lastShowTime < minIntervalBetweenAttemptsMs

    if (isInPausePeriod || hasReachedMaxAttempts || hasNotWaitedLongEnough) {
      await AsyncStorage.setItem(NOTIFICATION_MODAL_STORAGE_KEY, JSON.stringify(modalState))
      return false
    }

    // Update state for a valid attempt
    modalState.attempts += 1
    modalState.lastShowTime = currentTime.getTime()
    await AsyncStorage.setItem(NOTIFICATION_MODAL_STORAGE_KEY, JSON.stringify(modalState))
    return true
  } catch (error) {
    return false
  }
}

export const getNotificationModalState = async (): Promise<ModalState | null> => {
  try {
    const storedData = await AsyncStorage.getItem(NOTIFICATION_MODAL_STORAGE_KEY)
    return storedData ? JSON.parse(storedData) : null
  } catch (error) {
    return null
  }
}

export const useNotificationEligibility = (config: NotificationEligibilityConfig) => {
  const [isEligible, setIsEligible] = useState(false)
  const [modalState, setModalState] = useState<ModalState | null>(null)

  const checkEligibility = useCallback(async () => {
    const eligible = await checkNotificationEligibility(config)
    setIsEligible(eligible)
    const currentState = await getNotificationModalState()
    setModalState(currentState)
  }, [config])

  useEffect(() => {
    checkEligibility()
  }, [checkEligibility])

  return { isEligible, modalState }
}

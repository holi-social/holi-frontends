import AsyncStore from '@react-native-async-storage/async-storage'
import { logError } from '@holi/core/errors/helpers'

const GUEST_MODE_STORAGE_KEY = 'guest_mode'

export const storeGuestMode = async (guestMode?: boolean): Promise<void> => {
  try {
    if (guestMode) {
      await AsyncStore.setItem(GUEST_MODE_STORAGE_KEY, 'true')
    } else {
      await AsyncStore.removeItem(GUEST_MODE_STORAGE_KEY)
    }
  } catch (error) {
    logError(error, 'Failed to store guest mode', {
      location: 'guestModeStorage.storeGuestMode',
    })
  }
}
export const getGuestMode = async (): Promise<boolean> => {
  try {
    const userData = await AsyncStore.getItem(GUEST_MODE_STORAGE_KEY)
    return userData ? true : false
  } catch (error) {
    logError(error, 'Failed to get guest mode', {
      location: 'guestModeStorage.getGuestMode',
    })
    return false
  }
}

export const clearGuestMode = () => storeGuestMode()

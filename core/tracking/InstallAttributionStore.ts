import AsyncStorage from '@react-native-async-storage/async-storage'

import { logError } from '@holi/core/errors/helpers'
import { getLogger } from '@holi/core/helpers/logging'

const logger = getLogger('InstallAttributionStore')
export const INSTALL_TRACKED_KEY = 'HOLI_INSTALL_TRACKED'

const isInstallTracked = async (): Promise<boolean> => {
  try {
    const value = await AsyncStorage.getItem(INSTALL_TRACKED_KEY)
    const tracked = value === 'true'
    logger.debug('isInstallTracked', `install tracked: ${tracked}`)
    return tracked
  } catch (e) {
    logError(e, 'Error checking install tracked status', { location: 'InstallAttributionStore' })
    return false
  }
}

const markInstallAsTracked = async (): Promise<void> => {
  try {
    await AsyncStorage.setItem(INSTALL_TRACKED_KEY, 'true')
    logger.debug('markInstallAsTracked', 'marked install as tracked')
  } catch (e) {
    logError(e, 'Error marking install as tracked', { location: 'InstallAttributionStore' })
    throw e
  }
}

const clear = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(INSTALL_TRACKED_KEY)
    logger.debug('clear', 'cleared install tracked flag')
  } catch (e) {
    logError(e, 'Error clearing install tracked flag', { location: 'InstallAttributionStore' })
    throw e
  }
}

export const installAttributionStore = {
  isInstallTracked,
  markInstallAsTracked,
  clear,
}

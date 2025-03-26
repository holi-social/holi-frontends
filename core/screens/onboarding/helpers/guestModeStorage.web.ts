import { logError } from '@holi/core/errors/helpers'
import { getCookie, setCookie, deleteCookie } from 'cookies-next'

export const GUEST_MODE_COOKIE_NAME = 'guest_mode'

export const storeGuestMode = async (guestMode?: boolean): Promise<void> => {
  try {
    if (guestMode) {
      setCookie(GUEST_MODE_COOKIE_NAME, 'true')
    } else {
      deleteCookie(GUEST_MODE_COOKIE_NAME)
    }
  } catch (error) {
    logError(error, 'Failed to store guest mode', {
      location: 'guestModeStorage.storeGuestMode',
    })
  }
}
export const getGuestMode = async (): Promise<boolean> => {
  try {
    const userData = getCookie(GUEST_MODE_COOKIE_NAME)
    return userData ? true : false
  } catch (error) {
    logError(error, 'Failed to get guest mode', {
      location: 'guestModeStorage.getGuestMode',
    })
    return false
  }
}

export const clearGuestMode = () => storeGuestMode()

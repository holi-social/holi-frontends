import { getLogger } from '@holi/core/helpers/logging'

const REDIRECT_AFTER_SOCIAL_LOGIN_KEY = 'redirectAfterSocialLogin'
const logger = getLogger('RedirectAfterSocialLogin')

/**
 * Sets the redirect path in localStorage after social login
 * @param path - The path to redirect to after social login
 */
export const setRedirectAfterSocialLogin = (path: string): void => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(REDIRECT_AFTER_SOCIAL_LOGIN_KEY, path)
    }
  } catch (error) {
    logger.debug('setRedirectAfterSocialLogin', 'Error setting redirect path', { error })
  }
}

/**
 * Removes the redirect path from localStorage
 */
export const removeRedirectAfterSocialLogin = (): void => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(REDIRECT_AFTER_SOCIAL_LOGIN_KEY)
    }
  } catch (error) {
    logger.debug('removeRedirectAfterSocialLogin', 'Error removing redirect path', { error })
  }
}

/**
 * Gets the redirect path from localStorage
 * @returns The redirect path or null if not found
 */
export const getRedirectAfterSocialLogin = (): string | null => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem(REDIRECT_AFTER_SOCIAL_LOGIN_KEY)
    }
    return null
  } catch (error) {
    logger.debug('getRedirectAfterSocialLogin', 'Error getting redirect path', { error })
    return null
  }
}

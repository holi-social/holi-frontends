import { Platform } from 'react-native'

export const isWebTouchDevice = () => {
  if (typeof window === 'undefined') return false
  return Platform.OS === 'web' && ('ontouchstart' in (window || {}) || navigator?.maxTouchPoints > 0)
}

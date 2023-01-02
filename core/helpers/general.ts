import { Platform } from 'react-native'

export const isWebTouchDevice = () => {
  return Platform.OS === 'web' && ('ontouchstart' in (window || {}) || navigator?.maxTouchPoints > 0)
}

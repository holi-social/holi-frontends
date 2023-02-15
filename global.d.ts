/* eslint-disable no-var */
import type { ScreenOptions } from '@react-navigation/native'

declare global {
  var mockNavigate: (routeName: string) => void
  var captureSentryException: (error: Error) => void
  var mockSetOptions: (options: Partial<ScreenOptions>) => void
  var mockOpenURL: (url: string) => void
}

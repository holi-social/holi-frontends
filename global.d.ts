/* eslint-disable no-var */
import type { ScreenOptions } from '@react-navigation/native'

import { HoliToastType } from '@holi/ui/components/molecules/HoliToastProvider'

declare global {
  var mockNavigate: (routeName: string) => void
  var captureSentryException: (error: Error) => void
  var mockSetOptions: (options: Partial<ScreenOptions>) => void
  var mockOpenURL: (url: string) => void
  var mockOpenToast: (text: string, type: HoliToastType, timeout: number, testID?: string) => void
}

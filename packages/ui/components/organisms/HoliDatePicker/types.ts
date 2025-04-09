import type { StyleProp, ViewStyle } from 'react-native'

export interface HoliDatePickerBaseProps {
  value: Date
  onChange: (date: Date) => void
  minimumDate?: Date
  maximumDate?: Date
  label?: string
  isRequired?: boolean
  style?: StyleProp<ViewStyle>
  testID?: string
}

export interface HoliDatePickerProps extends HoliDatePickerBaseProps {
  title: string
  dateFormat?: 'long' | 'short'
}

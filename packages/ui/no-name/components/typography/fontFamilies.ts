import { Platform } from 'react-native'

export const fontFamilies = {
  regular: Platform.select({
    web: 'InstrumentSans-Regular,Helvetica,Arial,sans-serif',
    default: 'InstrumentSans-Regular',
  }),
  bold: Platform.select({
    web: 'InstrumentSans-Medium,Helvetica,Arial,sans-serif',
    default: 'InstrumentSans-Medium',
  }),
}

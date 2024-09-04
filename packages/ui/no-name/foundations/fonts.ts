import { Platform } from 'react-native'

// TODO(SF) include in themes?
export const fonts = {
  regular: Platform.select({
    web: 'InstrumentSans-Regular,Helvetica,Arial,sans-serif',
    default: 'InstrumentSans-Regular',
  }),
  bold: Platform.select({
    web: 'InstrumentSans-Medium,Helvetica,Arial,sans-serif',
    default: 'InstrumentSans-Medium',
  }),
}

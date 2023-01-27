import React from 'react'
import { StyleProp, ViewStyle } from 'react-native'

import theHtml from '@holi/core/static/codeOfConduct_en.html'
import HoliHtmlView from '@holi/ui/components/molecules/HoliHtmlView'

export type CodeOfConductProps = {
  style?: StyleProp<ViewStyle>
  testID?: string
}

const CodeOfConduct: React.VFC<CodeOfConductProps> = ({ style, testID }) => {
  // TODO: choose language and hand over correct file

  return <HoliHtmlView source={theHtml} height={500} style={style} testID={testID} />
}

export default CodeOfConduct

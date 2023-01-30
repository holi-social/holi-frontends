import React from 'react'
import { StyleProp, ViewStyle } from 'react-native'

import i18n from '@holi/core/i18n'
import htmlDe from '@holi/core/static/codeOfConduct_de.html'
import htmlEn from '@holi/core/static/codeOfConduct_en.html'
import HoliHtmlView from '@holi/ui/components/molecules/HoliHtmlView'

export type CodeOfConductProps = {
  style?: StyleProp<ViewStyle>
  testID?: string
}

const CodeOfConduct: React.VFC<CodeOfConductProps> = ({ style, testID }) => {
  return <HoliHtmlView source={i18n.language === 'de' ? htmlDe : htmlEn} style={style} testID={testID} />
}

export default CodeOfConduct

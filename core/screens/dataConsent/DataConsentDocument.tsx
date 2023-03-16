import React from 'react'
import { StyleProp, ViewStyle } from 'react-native'

import i18n from '@holi/core/i18n'
import htmlDe from '@holi/core/static/dataConsent_de'
import htmlEn from '@holi/core/static/dataConsent_en'
import HoliHtmlView from '@holi/ui/components/molecules/HoliHtmlView'

export type DataConsentDocumentProps = {
  style?: StyleProp<ViewStyle>
  testID?: string
}

const DataConsentDocument: React.VFC<DataConsentDocumentProps> = ({ style, testID }) => {
  return <HoliHtmlView html={i18n.language === 'de' ? htmlDe : htmlEn} style={style} testID={testID} />
}

export default DataConsentDocument

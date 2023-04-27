import React from 'react'
import { StyleProp, ViewStyle } from 'react-native'

import i18n from '@holi/core/i18n'
import htmlDe from '@holi/core/static/communityGuidelines_de'
import htmlEn from '@holi/core/static/communityGuidelines_en'
import HoliHtmlView from '@holi/ui/components/molecules/HoliHtmlView'

export type CommunityGuidelinesDocumentProps = {
  style?: StyleProp<ViewStyle>
  testID?: string
}

const CommunityGuidelinesDocument: React.VFC<CommunityGuidelinesDocumentProps> = ({ style, testID }) => {
  const language = i18n.language.split('-')[0]
  return <HoliHtmlView html={language === 'de' ? htmlDe : htmlEn} style={style} testID={testID} />
}

export default CommunityGuidelinesDocument

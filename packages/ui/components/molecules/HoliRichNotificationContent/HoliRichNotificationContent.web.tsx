import React from 'react'
import { View } from 'react-native'
import { StyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet'
import { ViewStyle } from 'react-native/Libraries/StyleSheet/StyleSheetTypes'

import { getBaseStyle } from '@holi/ui/components/molecules/HoliRichNotificationContent/styles'
import { useTheme } from '@holi/ui/styles/theme'

import './tagStyles.web.css'

type HoliRichNotificationContentProps = {
  html: string
  testID?: string
}
const HoliRichNotificationContent = ({ html, testID }: HoliRichNotificationContentProps) => {
  const { theme } = useTheme()

  if (!html) return null

  const baseStyle = getBaseStyle(theme)

  return (
    <View testID={testID} style={baseStyle.base as StyleProp<ViewStyle>}>
      {/* We trust the Novu template processing */}
      <div dangerouslySetInnerHTML={{ __html: html }} className="web-rich-notification" />
    </View>
  )
}

export default HoliRichNotificationContent

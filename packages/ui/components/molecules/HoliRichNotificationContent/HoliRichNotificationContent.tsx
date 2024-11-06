import React from 'react'
import RenderHtml, { defaultSystemFonts } from 'react-native-render-html'

import { getBaseStyle, getTagStyles } from '@holi/ui/components/molecules/HoliRichNotificationContent/styles'
import { useTheme } from '@holi/ui/styles/theme'

type HoliRichNotificationContentProps = {
  html: string
  testID?: string
}

const HoliRichNotificationContent = ({ html, testID }: HoliRichNotificationContentProps) => {
  const { theme } = useTheme()

  if (!html) return null

  const baseStyle = getBaseStyle(theme)
  const tagStyles = getTagStyles(theme)

  return (
    <RenderHtml
      contentWidth={500}
      source={{ html: html }}
      baseStyle={baseStyle.base}
      tagsStyles={tagStyles}
      enableCSSInlineProcessing={false}
      systemFonts={[...defaultSystemFonts, theme.fontFamily.default('Medium'), theme.fontFamily.default('Regular')]}
      defaultViewProps={{
        testID,
      }}
    />
  )
}

export default HoliRichNotificationContent

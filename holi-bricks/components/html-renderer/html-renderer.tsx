import { fontFamilies } from 'holi-bricks/components/text/fontFamilies'
import { useStyles } from 'holi-bricks/styles'
import type React from 'react'
import { useWindowDimensions } from 'react-native'
import RenderHTML from 'react-native-render-html'

export interface HtmlRendererProps {
  content: string
  contentWidth?: number
}

export const HtmlRenderer: React.FC<HtmlRendererProps> = ({ content, contentWidth }) => {
  const { theme } = useStyles()
  const { width } = useWindowDimensions()
  if (!content) return null
  const commonTextStyle = {
    color: theme.colors.fill.main,
    fontFamily: fontFamilies.regular,
    fontSize: 16,
    lineHeight: 16 * 1.48,
    letterSpacing: -0.128,
  }

  return (
    <RenderHTML
      contentWidth={contentWidth || width}
      source={{ html: content }}
      systemFonts={[fontFamilies.regular, fontFamilies.bold]}
      tagsStyles={{
        div: {
          ...commonTextStyle,
        },
        span: {
          ...commonTextStyle,
        },
        a: {
          ...commonTextStyle,
          fontFamily: fontFamilies.bold,
          fontVariant: ['lining-nums', 'tabular-nums'],
          fontWeight: '500',
          textDecorationColor: theme.colors.fill.main,
        },
        p: {
          ...commonTextStyle,
          fontVariant: ['lining-nums', 'tabular-nums'],
          fontWeight: '400',
          margin: 0,
        },
        ul: commonTextStyle,
        li: commonTextStyle,
      }}
      enableExperimentalMarginCollapsing
    />
  )
}

import { fontFamilies } from 'holi-bricks/components/text/fontFamilies'
import type React from 'react'
import { useWindowDimensions } from 'react-native'
import RenderHTML, { type HTMLSource } from 'react-native-render-html'
// eslint-disable-next-line no-restricted-imports
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import { useBricks } from 'holi-bricks/foundations/colors/themes/useBricks'
import { Spacing } from 'holi-bricks/foundations'
import { Text } from 'holi-bricks/components/text'

export interface HtmlRendererProps {
  source: HTMLSource
  contentWidth?: number
}

export const HtmlRenderer: React.FC<HtmlRendererProps> = ({ contentWidth, source }) => {
  const { theme } = useBricks()
  const { width } = useWindowDimensions()

  if (!source) return null

  const commonTextStyle = {
    color: theme.colors.fill.main,
    fontFamily: fontFamilies.regular,
    fontSize: 16,
    lineHeight: 16 * 1.48,
    letterSpacing: -0.128,
  }

  return (
    <RenderHTML
      remoteLoadingView={() => <HoliLoader />}
      contentWidth={contentWidth || width}
      source={source}
      systemFonts={[fontFamilies.regular, fontFamilies.bold]}
      remoteErrorView={() => <Text size="md">Error while loading the 📃</Text>}
      tagsStyles={{
        div: {
          ...commonTextStyle,
        },
        span: {
          ...commonTextStyle,
        },
        a: {
          ...commonTextStyle,
          color: theme.colors.fill.informative,
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
        ul: { ...commonTextStyle, marginBottom: Spacing['xxs'], paddingLeft: Spacing.md, margin: 0 },
        li: { ...commonTextStyle, marginBottom: Spacing['4xs'], paddingLeft: Spacing['3xs'] },
        h1: { ...commonTextStyle, fontSize: 20, marginBottom: Spacing['xxs'], marginTop: Spacing['xs'] },
        h2: { ...commonTextStyle, fontSize: 18, marginBottom: Spacing['xxs'], marginTop: Spacing['xs'] },
        h3: {
          ...commonTextStyle,
          fontSize: 16,
          fontWeight: '500',
          marginBottom: Spacing['xxs'],
          marginTop: Spacing['xs'],
        },
        strong: {
          ...commonTextStyle,
          fontWeight: '500',
        },
        body: {
          ...commonTextStyle,
        },
      }}
      enableExperimentalMarginCollapsing
    />
  )
}

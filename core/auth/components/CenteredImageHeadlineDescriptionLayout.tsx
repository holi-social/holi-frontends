import { Text } from 'holi-bricks/components/text/Text'
import React, { useMemo } from 'react'
import { ScrollView, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import CenteredContentLayout, { CenteredContentLayoutProps } from '@holi/core/components/CenteredContentLayout'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import type { StaticImageData } from '@holi/ui/components/atoms/HoliLocalImage.shared'
import Spacing from '@holi/ui/foundations/Spacing'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

export interface CenteredImageHeadlineDescriptionLayoutProps extends CenteredContentLayoutProps {
  imageSource?: StaticImageData
  imageLabelText?: string
  headlineText: string
  descriptionText: string
  contentStyle?: StyleProp<ViewStyle>
}

const CenteredImageHeadlineDescriptionLayout = React.forwardRef<
  ScrollView,
  React.PropsWithChildren<CenteredImageHeadlineDescriptionLayoutProps>
>(
  (
    {
      children,
      imageSource,
      imageLabelText,
      headlineText,
      descriptionText,
      contentStyle,
      testID = 'centered-layout',
      ...props
    },
    ref
  ) => {
    const { theme } = useTheme()
    const styles = useMemo(() => getStyles(theme), [theme])
    const imageLabelValue = imageLabelText ?? headlineText

    return (
      <CenteredContentLayout {...props} ref={ref} testID={testID}>
        <View style={[styles.inner, contentStyle]}>
          {imageSource && (
            <View style={styles.imageContainer}>
              <HoliLocalImage
                imageSource={imageSource}
                isSvg
                width={250}
                height={180}
                label={imageLabelValue}
                resizeMode="contain"
              />
            </View>
          )}
          <View style={contentStyle}>
            <View style={styles.textContainer}>
              <HoliHeading level="1" size="m" align="center" testID={`${testID}-headline`}>
                {headlineText}
              </HoliHeading>

              <Text size={'md'} color={styles.description.color} textAlign="center">
                {descriptionText}
              </Text>
            </View>
            {children}
          </View>
        </View>
      </CenteredContentLayout>
    )
  }
)

CenteredImageHeadlineDescriptionLayout.displayName = 'CenteredImageHeadlineDescriptionLayout'

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    inner: {
      alignItems: 'center',
      gap: Spacing['4xl'],
      width: '100%',
    },
    imageContainer: {
      alignItems: 'center',
      marginTop: Spacing['4xl'],
    },
    description: {
      color: theme.colors.foreground20,
    },
    textContainer: {
      gap: Spacing.xs,
    },
  })

export default CenteredImageHeadlineDescriptionLayout

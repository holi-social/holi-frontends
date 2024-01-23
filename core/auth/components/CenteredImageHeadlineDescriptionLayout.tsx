import React from 'react'
import { ScrollView, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import CenteredContentLayout, { CenteredContentLayoutProps } from '@holi/core/components/CenteredContentLayout'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import type { StaticImageData } from '@holi/ui/components/atoms/HoliLocalImage.shared'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { colors } from '@holi/ui/styles/globalVars'
import { dimensions } from '@holi/ui/styles/globalVars'

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
    const imageLabelValue = imageLabelText ?? headlineText

    return (
      <CenteredContentLayout {...props} ref={ref} testID={testID}>
        <View style={[styles.inner, contentStyle]}>
          {imageSource && (
            <View style={styles.imageContainer}>
              <HoliLocalImage
                imageSource={imageSource}
                isSvg
                width={251}
                height={181}
                label={imageLabelValue}
                resizeMode="contain"
              />
            </View>
          )}

          <HoliHeading
            level="1"
            size="medium"
            style={[styles.headline, !!imageSource && { marginTop: 74 }]}
            testID={`${testID}-headline`}
          >
            {headlineText}
          </HoliHeading>

          <HoliText style={styles.description}>{descriptionText}</HoliText>
        </View>

        {children}
      </CenteredContentLayout>
    )
  }
)

CenteredImageHeadlineDescriptionLayout.displayName = 'CenteredImageHeadlineDescriptionLayout'

const styles = StyleSheet.create({
  inner: {
    alignItems: 'center',
    maxWidth: dimensions.breakpointL,
  },
  imageContainer: {
    alignItems: 'center',
  },
  headline: {
    fontWeight: '400',
    textAlign: 'center',
  },
  description: {
    color: colors.foreground20,
    marginTop: 16,
    textAlign: 'center',
  },
})

export default CenteredImageHeadlineDescriptionLayout

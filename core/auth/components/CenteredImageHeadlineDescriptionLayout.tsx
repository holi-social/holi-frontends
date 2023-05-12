import React from 'react'
import { ScrollView, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import CenteredContentLayout, { CenteredContentLayoutProps } from '@holi/core/components/CenteredContentLayout'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { colors } from '@holi/ui/styles/globalVars'
import { vars } from '@holi/ui/styles/globalVars'

export interface CenteredImageHeadlineDescriptionLayoutProps extends CenteredContentLayoutProps {
  imageSource: StaticImageData
  imageLabelText: string
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
    return (
      <CenteredContentLayout {...props} ref={ref} testID={testID}>
        <View style={[styles.inner, contentStyle]}>
          <View style={styles.imageContainer}>
            <HoliLocalImage
              imageSource={imageSource}
              isSvg
              width={251}
              height={181}
              label={imageLabelText}
              resizeMode="contain"
            />
          </View>

          <HoliHeading level="1" size="medium" style={styles.headline} testID={`${testID}-headline`}>
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
    maxWidth: vars.breakpointL,
  },
  imageContainer: {
    alignItems: 'center',
  },
  headline: {
    fontWeight: '400',
    textAlign: 'center',
    marginTop: 74,
  },
  description: {
    color: colors.foreground20,
    marginTop: 16,
    textAlign: 'center',
  },
})

export default CenteredImageHeadlineDescriptionLayout

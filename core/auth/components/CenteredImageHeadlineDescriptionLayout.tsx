import React, { useMemo } from 'react'
import { ScrollView, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import CenteredContentLayout, { CenteredContentLayoutProps } from '@holi/core/components/CenteredContentLayout'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import type { StaticImageData } from '@holi/ui/components/atoms/HoliLocalImage.shared'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { dimensions } from '@holi/ui/styles/globalVars'
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
                width={251}
                height={181}
                label={imageLabelValue}
                resizeMode="contain"
              />
            </View>
          )}
          {!!imageSource && <HoliBox padding={[74, 0, 0, 0]} />}
          <HoliHeading level="1" size="m" align="center" testID={`${testID}-headline`}>
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

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    inner: {
      alignItems: 'center',
      maxWidth: dimensions.breakpointL,
    },
    imageContainer: {
      alignItems: 'center',
    },
    description: {
      color: theme.colors.foreground20,
      marginTop: 16,
      textAlign: 'center',
    },
  })

export default CenteredImageHeadlineDescriptionLayout

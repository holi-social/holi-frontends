import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, ScrollView, StyleProp, StyleSheet, View, ViewStyle, useWindowDimensions } from 'react-native'

import useRouting from '@holi/core/navigation/hooks/useRouting'
import SpacesSeeMore from '@holi/core/screens/spaces/components/SpacesSeeMore'
import { Topic } from '@holi/core/screens/userprofile/types'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import { colors } from '@holi/ui/styles/globalVars'

type HoliSliderProps = {
  style?: StyleProp<ViewStyle>
  topic: Topic
  isLoading?: boolean
  testID?: string
  children?: React.ReactNode[]
  paddingVertical: number
  slideGap: number
}

const HoliSlider: React.VFC<HoliSliderProps> = ({
  style,
  topic,
  isLoading = false,
  testID = 'holi-slider',
  children,
  paddingVertical,
  slideGap,
}: HoliSliderProps) => {
  const { t } = useTranslation()
  const { width: screenWidth } = useWindowDimensions()
  const styles = getStyles(screenWidth)
  const { navigate } = useRouting()
  const SEE_MORE_IMAGE_HEIGHT = Platform.OS === 'web' ? 160 : screenWidth / 2 - 38

  return (
    <View style={style}>
      <ScrollView style={styles.scrollViewContainer} horizontal testID={testID}>
        {children &&
          children.map((child, index) => (
            <View key={index} style={[{ marginRight: slideGap }, styles.cardContainer]}>
              {child}
            </View>
          ))}
        {isLoading && (
          <View style={[styles.loadingContainer, styles.cardContainer]}>
            <HoliIcon icon="loader-4" size={50} color={colors.fontColorGrey} spinning />
          </View>
        )}
        <SpacesSeeMore
          style={{ paddingVertical, marginRight: 20 }}
          label={t('spaces.seeMore')}
          imageHeight={SEE_MORE_IMAGE_HEIGHT}
          onPress={() => navigate(`/spaces/filter?topicId=${topic.id}`)}
        />
      </ScrollView>
    </View>
  )
}
export default memo(HoliSlider)

const getStyles = (screenWidth: number) =>
  StyleSheet.create({
    cardContainer: {
      width: Platform.OS === 'web' ? 320 : screenWidth / 1.5 - 12,
    },
    scrollViewContainer: {
      paddingVertical: 18,
      marginHorizontal: -20,
      paddingLeft: 20,
    },
    loadingContainer: {
      height: 160,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.backgroundColorGrey,
    },
  })

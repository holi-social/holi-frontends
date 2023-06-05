import React, { memo } from 'react'
import { FlatList, Platform, StyleProp, StyleSheet, View, ViewStyle, useWindowDimensions } from 'react-native'

import { Space, SpaceMember } from '@holi/core/screens/spaces/types'
import HoliBlockItem from '@holi/ui/components/molecules/HoliBlockItem'

type SpacesHorizontalSliderProps = {
  spaces: Space[]
  style?: StyleProp<ViewStyle>
  seeMoreButton?: React.ReactElement
  testID?: string
  slideGap: number
}

const SpacesHorizontalSlider = ({
  spaces,
  style,
  testID = 'holi-slider',
  seeMoreButton,
  slideGap,
}: SpacesHorizontalSliderProps) => {
  const { width: screenWidth } = useWindowDimensions()
  const styles = getStyles(screenWidth)

  return (
    <FlatList
      horizontal
      style={style}
      testID={testID}
      data={spaces}
      ListFooterComponent={seeMoreButton}
      ListFooterComponentStyle={styles.seeMoreCard}
      renderItem={({ item }) => (
        <View style={[{ marginRight: slideGap }, styles.cardContainer]}>
          <HoliBlockItem
            key={item.id}
            label={item.title}
            title={item.title}
            subtitle={item.location}
            description={item.description}
            imageSrc={item.cover}
            users={item.members.data.map((membership: SpaceMember) => membership.user)}
            href={`/spaces/${item.name}`}
            size="large"
            testID="space-link"
            totalUserCount={item.members.totalResults}
          />
        </View>
      )}
    />
  )
}
export default memo(SpacesHorizontalSlider)

const getStyles = (screenWidth: number) =>
  StyleSheet.create({
    cardContainer: {
      width: Platform.OS === 'web' ? 320 : screenWidth / 1.5 - 12,
    },
    seeMoreCard: {
      paddingVertical: 8,
    },
  })

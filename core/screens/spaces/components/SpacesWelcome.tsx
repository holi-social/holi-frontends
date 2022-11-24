import React from 'react'
import { Image, Platform, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import { Space } from '@holi/core/screens/spaces/types'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { colors } from '@holi/ui/styles/globalVars'

type SpacesWelcomeProps = {
  space: Space
  style?: StyleProp<ViewStyle>
}

const SpacesWelcome: React.VFC<SpacesWelcomeProps> = ({ space, style }) => {
  return (
    <View style={style}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: space.mainImage }} style={styles.mainImage} />
      </View>
      <HoliText style={styles.description}>{space.description} </HoliText>
    </View>
  )
}

const styles = StyleSheet.create({
  description: {
    marginTop: 40,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 327 / 210,
    height: Platform.OS === 'web' ? '100%' : 'auto',
    padding: 8,
    borderWidth: 1,
    borderRadius: 16,
    borderColor: colors.borderColorGrey,
    backgroundColor: colors.backgroundColorWhite,
  },
  mainImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 8,
  },
})

export default SpacesWelcome

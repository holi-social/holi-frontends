import React from 'react'
import { GestureResponderEvent, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { colors } from '@holi/ui/styles/globalVars'

export type SpacesFilterTagProps = {
  children?: React.ReactNode
  filter: 'all' | 'topics' | 'location'
  label: string
  style?: StyleProp<ViewStyle>
  onPress: (event: React.SyntheticEvent | GestureResponderEvent) => void
}

const SpacesFilterTag = ({ filter, style, label, onPress, children }: SpacesFilterTagProps) => {
  return (
    <HoliButton label={label} style={[styles.filter, styles[filter], style]} inline onPress={onPress}>
      {filter === 'location' && (
        <View style={styles.locationIcon}>
          <HoliLocalImage
            imageSource={require('@holi/ui/assets/img/icons/location-2.svg')}
            width={34}
            height={34}
            label={''}
            isSvg
          />
        </View>
      )}
      <HoliText size="extralarge">{children}</HoliText>
      {filter === 'all' && <HoliIcon icon="filter-3" size={16} style={styles.filterIcon} />}
    </HoliButton>
  )
}
export default SpacesFilterTag

const styles = StyleSheet.create({
  topics: {
    backgroundColor: '#ABFF8B',
  },
  filter: {
    borderRadius: 48,
    borderColor: colors.borderColorBlack,
    borderWidth: 1,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  filterIcon: {
    marginLeft: 4,
  },
  location: {
    backgroundColor: colors.backgroundColorWhite,
    paddingLeft: 18,
    overflow: 'visible',
  },
  locationIcon: {
    position: 'absolute',
    left: -24,
    top: -12,
  },
  all: {
    backgroundColor: colors.backgroundColorWhite,
  },
})

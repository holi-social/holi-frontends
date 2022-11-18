import React from 'react'
import { GestureResponderEvent, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
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
    <View style={[styles.headerContainer, style]}>
      <HoliButton label={label} style={[styles[filter], styles.filter]} inline onPress={onPress}>
        {filter === 'location' && <HoliIcon icon="location-2" size={34} style={styles.locationIcon} />}
        <HoliText size="extralarge">{children}</HoliText>
        {filter === 'all' && <HoliIcon icon="filter-3" size={16} style={styles.filterIcon} />}
      </HoliButton>
    </View>
  )
}
export default SpacesFilterTag

const styles = StyleSheet.create({
  topics: {
    backgroundColor: '#ABFF8B',
  },
  filter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 48,
    borderColor: colors.borderColorBlack,
    borderWidth: 1,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  filterIcon: {
    marginLeft: 4,
  },
  headerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  location: {
    backgroundColor: colors.backgroundColorWhite,
    paddingLeft: 18,
  },
  locationIcon: {
    marginRight: 5,
    position: 'absolute',
    top: -6,
    left: -6,
    zIndex: 1,
  },
  all: {
    backgroundColor: colors.backgroundColorWhite,
  },
})

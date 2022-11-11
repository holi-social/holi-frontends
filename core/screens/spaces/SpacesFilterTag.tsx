import React from 'react'
import { GestureResponderEvent, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import useRouting from '@holi/core/navigation/hooks/useRouting'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { colors } from '@holi/ui/styles/globalVars'

export type SpacesFilterTagProps = {
  location?: string
  filter: 'create' | 'all' | 'topics' | 'location' | 'text' | 'skills'
  tag?: string
  label: string
  style?: StyleProp<ViewStyle>
  onPress: (event: React.SyntheticEvent | GestureResponderEvent) => void
}

const SpacesFilterTag = ({ location, filter, tag, style, label, onPress }: SpacesFilterTagProps) => {
  const { navigate } = useRouting()

  return (
    <View style={[styles.headerContainer, style]}>
      {filter === 'location' && location && (
        <>
          <HoliIcon icon="location-2" size={34} style={styles.locationIcon} />
          <HoliButton label={label} style={[styles.locationFilter, styles.filter]} inline onPress={onPress}>
            <HoliText size="extralarge">{location}</HoliText>
          </HoliButton>
        </>
      )}
      {filter === 'text' && (
        <HoliButton
          label={label}
          variant="small"
          style={[styles.spacesFilter, styles.filter]}
          inline
          onPress={() => navigate('/apps/donations/')}
        >
          <HoliText size="extralarge">{tag}</HoliText>
        </HoliButton>
      )}
      {filter === 'all' && (
        <HoliButton label={label} variant="small" style={[styles.spacesFilter, styles.filter]} inline onPress={onPress}>
          <HoliText size="extralarge">all</HoliText>
          <HoliIcon icon="filter-3" size={16} style={styles.filterIcon} />
        </HoliButton>
      )}
      {filter === 'topics' && (
        <HoliButton label={label} variant="small" style={[styles.topicsFilter, styles.filter]} inline onPress={onPress}>
          <HoliText size="extralarge">{tag}</HoliText>
        </HoliButton>
      )}
      {filter === 'create' && (
        <HoliButton label={label} variant="small" style={[styles.createSpace, styles.filter]} inline onPress={onPress}>
          <HoliText size="extralarge">create</HoliText>
        </HoliButton>
      )}
      {filter === 'skills' && (
        <HoliButton label={label} variant="small" style={[styles.skillsFilter, styles.filter]} inline onPress={onPress}>
          <HoliText size="extralarge">{tag}</HoliText>
        </HoliButton>
      )}
    </View>
  )
}
export default SpacesFilterTag

const styles = StyleSheet.create({
  createSpace: {
    backgroundColor: colors.backgroundColorYellow,
  },
  topicsFilter: {
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
  font: {
    fontSize: 28,
    lineHeight: 28,
  },
  headerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  locationFilter: {
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
  skillsFilter: {
    backgroundColor: '#90DDFF',
  },
  spacesFilter: {
    backgroundColor: colors.backgroundColorWhite,
  },
})

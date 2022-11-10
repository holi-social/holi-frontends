import React from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import useRouting from '@holi/core/navigation/hooks/useRouting'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { colors } from '@holi/ui/styles/globalVars'

export type SpacesFilterTagProps = {
  location?: string
  filter: 'create' | 'all' | 'interests' | 'location' | 'text' | 'skills'
  tag?: string
  label: string
  style?: StyleProp<ViewStyle>
}

const SpacesFilterTag = ({ location, filter, tag, style, label }: SpacesFilterTagProps) => {
  const { navigate } = useRouting()

  return (
    <View style={[styles.headerContainer, style]}>
      {filter === 'location' && location && (
        <>
          <HoliLocalImage
            imageSource={require('./Brand-Icon.png')}
            style={styles.locationIcon}
            label={''}
            width={32}
            height={32}
          />
          <HoliButton
            label={label}
            variant="small"
            style={[styles.locationFilter, styles.filter]}
            inline
            onPress={() => navigate('/apps/donations/')}
          >
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
        <HoliButton
          label={label}
          variant="small"
          style={[styles.spacesFilter, styles.filter]}
          inline
          onPress={() => navigate('/apps/donations/')}
        >
          <HoliText size="extralarge">all</HoliText>
          <HoliIcon icon="filter-3" size={16} style={styles.filterIcon} />
        </HoliButton>
      )}
      {filter === 'interests' && (
        <HoliButton
          label={label}
          variant="small"
          style={[styles.interestsFilter, styles.filter]}
          inline
          onPress={() => navigate('/apps/donations/')}
        >
          <HoliText size="extralarge">{tag}</HoliText>
        </HoliButton>
      )}
      {filter === 'create' && (
        <HoliButton
          label={label}
          variant="small"
          style={[styles.createSpace, styles.filter]}
          inline
          onPress={() => navigate('/apps/donations/')}
        >
          <HoliText size="extralarge">create</HoliText>
        </HoliButton>
      )}
      {filter === 'skills' && (
        <HoliButton
          label={label}
          variant="small"
          style={[styles.skillsFilter, styles.filter]}
          inline
          onPress={() => navigate('/apps/donations/')}
        >
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
    paddingHorizontal: 10,
  },
  interestsFilter: {
    backgroundColor: '#ABFF8B',
    paddingHorizontal: 10,
  },
  filter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 48,
    borderColor: colors.borderColorBlack,
    borderWidth: 1,
    marginRight: 0,
    paddingVertical: 2,
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
    paddingRight: 10,
    paddingLeft: 18,
  },
  locationIcon: {
    marginRight: 5,
    position: 'absolute',
    top: -4,
    left: -6,
    zIndex: 1,
  },
  skillsFilter: {
    backgroundColor: '#90DDFF',
    paddingHorizontal: 10,
  },
  spacesFilter: {
    backgroundColor: colors.backgroundColorWhite,
    paddingHorizontal: 10,
  },
})

import React from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { colors } from '@holi/ui/styles/globalVars'

export type SpacesFilterHeaderProps = {
  title: string
  location?: string
  style?: StyleProp<ViewStyle>
}

const SpacesFilterHeader: React.VFC<SpacesFilterHeaderProps> = ({ title, location, style }) => {
  return (
    <View style={[styles.headerContainer, style]}>
      <HoliText size="extralarge">Discover </HoliText>
      <HoliButton label={'title'} variant="small" style={[styles.spacesFilter, styles.filter]} inline>
        <HoliText size="extralarge">{title}</HoliText>
        <HoliIcon icon="filter-3" size={16} style={styles.filterIcon} />
      </HoliButton>
      {location ? (
        <>
          <HoliText size="extralarge"> spaces in </HoliText>
          <View>
            <HoliIcon icon="heart" size={32} style={styles.locationIcon} filled />
            <HoliButton label={'title'} variant="small" style={[styles.spacesFilter, styles.filter]} inline>
              <HoliText size="extralarge">{location}</HoliText>
            </HoliButton>
          </View>
          <HoliText size="extralarge"> or </HoliText>
        </>
      ) : (
        <HoliText size="extralarge"> spaces or </HoliText>
      )}
      <HoliButton label={'title'} variant="small" style={[styles.createSpace, styles.filter]} inline>
        <HoliText size="extralarge">create</HoliText>
      </HoliButton>
      <HoliText size="extralarge"> your own</HoliText>
    </View>
  )
}

const styles = StyleSheet.create({
  createSpace: {
    backgroundColor: colors.backgroundColorYellow,
    paddingHorizontal: 10,
  },
  filter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 48,
    borderColor: colors.borderColorBlack,
    borderWidth: 1,
  },
  filterIcon: {
    marginLeft: 4,
  },
  headerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  locationFilter: {
    backgroundColor: colors.backgroundColorGrey,
    paddingHorizontal: 10,
  },
  locationIcon: {
    marginRight: 5,
    color: colors.positivepurple,
    position: 'absolute',
    order: 1,
    left: -6,

    paddingLeft: 18,
    paddingRight: 10,
    flexGrow: 0,
    zIndex: 2,
  },
  spacesFilter: {
    backgroundColor: colors.backgroundColorGrey,
    zIndex: 1,
  },
})

export default SpacesFilterHeader

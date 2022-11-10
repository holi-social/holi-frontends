import React from 'react'
import { useTranslation } from 'react-i18next'
import { GestureResponderEvent, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import SpacesFilterTag from '@holi/core/screens/spaces/SpacesFilterTag'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { colors } from '@holi/ui/styles/globalVars'

export type SpacesFilterHeaderProps = {
  location?: string
  interests?: string[]
  all?: boolean
  onPress?: (event: React.SyntheticEvent | GestureResponderEvent) => void
  style?: StyleProp<ViewStyle>
}

const SpacesFilterHeader: React.VFC<SpacesFilterHeaderProps> = ({ location, interests, all = false, style }) => {
  const { t } = useTranslation()

  return (
    <View style={[styles.headerContainer, style]}>
      {!interests && !location && !all && (
        <>
          <HoliText size="extralarge" style={styles.filterText}>
            Discover
          </HoliText>
          <SpacesFilterTag filter={'all'} style={styles.filter} label={t('spaces:filter.all')} />
          <HoliText size="extralarge" style={styles.filterText}>
            spaces
          </HoliText>
        </>
      )}
      {!interests && location && !all && (
        <>
          <HoliText size="extralarge" style={styles.filterText}>
            Discover
          </HoliText>
          <SpacesFilterTag filter={'all'} style={styles.filter} label={t('spaces:filter.all')} />
          <HoliText size="extralarge" style={styles.filterText}>
            spaces
          </HoliText>
          <HoliText size="extralarge" style={styles.filterText}>
            in
          </HoliText>
          <SpacesFilterTag
            filter={'location'}
            location={location}
            style={styles.filter}
            label={t('spaces:filter.location')}
          />
        </>
      )}
      {all && (
        <>
          <SpacesFilterTag filter={'text'} tag={'All'} style={styles.filter} label={t('spaces:filter.all')} />
          <HoliText size="extralarge" style={styles.filterText}>
            spaces in
          </HoliText>
          <SpacesFilterTag
            filter={'location'}
            location={location}
            style={styles.filter}
            label={t('spaces:filter.location')}
          />
        </>
      )}
      {interests && location && (
        <>
          {interests?.length === 1 &&
            interests?.map((interest, index) => (
              <SpacesFilterTag
                filter={'interests'}
                tag={interest}
                key={index}
                style={styles.filter}
                label={t('spaces:filter.interest')}
              />
            ))}
          {interests?.length === 2 &&
            interests
              ?.slice(0, 1)
              .map((interest, index) => (
                <SpacesFilterTag
                  filter={'interests'}
                  tag={interest}
                  key={index}
                  style={styles.filter}
                  label={t('spaces:filter.interest')}
                />
              ))}
          {interests?.length === 2 && (
            <HoliText size="extralarge" style={styles.filterText}>
              and
            </HoliText>
          )}
          {interests?.length === 2 &&
            interests
              ?.slice(1, 2)
              .map((interest, index) => (
                <SpacesFilterTag
                  filter={'interests'}
                  tag={interest}
                  key={index}
                  style={styles.filter}
                  label={t('spaces:filter.interest')}
                />
              ))}
          {interests?.length > 2 &&
            interests
              ?.slice(0, interests.length - 1)
              .map((interest, index) => (
                <SpacesFilterTag
                  filter={'interests'}
                  tag={interest}
                  key={index}
                  style={styles.filter}
                  label={t('spaces:filter.interest')}
                />
              ))}
          {interests?.length > 2 && (
            <HoliText size="extralarge" style={styles.filterText}>
              or
            </HoliText>
          )}
          {interests?.length > 2 &&
            interests
              ?.slice(interests.length - 1, interests.length)
              .map((interest, index) => (
                <SpacesFilterTag
                  filter={'interests'}
                  tag={interest}
                  key={index}
                  style={styles.filter}
                  label={t('spaces:filter.interest')}
                />
              ))}
          <HoliText size="extralarge" style={styles.filterText}>
            spaces in
          </HoliText>
          <SpacesFilterTag
            filter={'location'}
            location={location}
            style={styles.filter}
            label={t('spaces:filter.interest')}
          />
        </>
      )}
    </View>
  )
}
export default SpacesFilterHeader

const styles = StyleSheet.create({
  createSpace: {
    backgroundColor: colors.backgroundColorYellow,
    paddingHorizontal: 10,
  },
  filter: {
    marginRight: 4,
  },
  filterText: {
    marginRight: 4,
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
})

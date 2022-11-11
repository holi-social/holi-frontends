import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import useRouting from '@holi/core/navigation/hooks/useRouting'
import SpacesFilterTag from '@holi/core/screens/spaces/SpacesFilterTag'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { colors } from '@holi/ui/styles/globalVars'

export type SpacesFilterHeaderProps = {
  location?: string
  topics: string[]
  allTopics?: boolean
  style?: StyleProp<ViewStyle>
}

const SpacesFilterHeader: React.VFC<SpacesFilterHeaderProps> = ({ location, topics, allTopics = false, style }) => {
  const { t } = useTranslation()
  const { navigate } = useRouting()
  const onPress = () => navigate('/apps/donations')

  return (
    <View style={[styles.headerContainer, style]}>
      {topics?.length === 0 && !location && (
        <>
          {allTopics ? (
            <SpacesFilterTag
              filter={'text'}
              tag={'All'}
              style={styles.filter}
              label={t('spaces:filter.all')}
              onPress={onPress}
            />
          ) : (
            <>
              <HoliText size="extralarge" style={styles.filterText}>
                Discover
              </HoliText>
              <SpacesFilterTag filter={'all'} style={styles.filter} label={t('spaces:filter.all')} onPress={onPress} />
            </>
          )}
          <HoliText size="extralarge" style={styles.filterText}>
            spaces
          </HoliText>
        </>
      )}
      {location && topics?.length === 0 && (
        <>
          {allTopics ? (
            <SpacesFilterTag
              filter={'text'}
              tag={'All'}
              style={styles.filter}
              label={t('spaces:filter.all')}
              onPress={onPress}
            />
          ) : (
            <>
              <HoliText size="extralarge" style={styles.filterText}>
                Discover
              </HoliText>
              <SpacesFilterTag filter={'all'} style={styles.filter} label={t('spaces:filter.all')} onPress={onPress} />
            </>
          )}
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
            onPress={onPress}
          />
        </>
      )}
      {topics?.length !== 0 && (
        <>
          {topics?.map((topic, index) => (
            <SpacesFilterTag
              filter={'topics'}
              tag={topic}
              key={index}
              style={styles.filter}
              label={t('spaces:filter.topic')}
              onPress={onPress}
            />
          ))}
          <HoliText size="extralarge" style={styles.filterText}>
            spaces
          </HoliText>
          {location && (
            <>
              <HoliText size="extralarge" style={styles.filterText}>
                in
              </HoliText>
              <SpacesFilterTag
                filter={'location'}
                location={location}
                style={styles.filter}
                label={t('spaces:filter.location')}
                onPress={onPress}
              />
            </>
          )}
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
    marginBottom: 4,
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

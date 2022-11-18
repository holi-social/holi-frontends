import React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { GestureResponderEvent, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import { Platform } from 'react-native'

import SpacesFilterTag from '@holi/core/screens/spaces/SpacesFilterTag'
import HoliText from '@holi/ui/components/atoms/HoliText'

export type SpacesFilterHeaderProps = {
  location?: string
  label: string
  topics: string[]
  allTopics?: boolean
  onPress: (event: React.SyntheticEvent | GestureResponderEvent) => void
  style?: StyleProp<ViewStyle>
}

const SpacesFilterHeader: React.VFC<SpacesFilterHeaderProps> = ({
  location,
  topics,
  allTopics = false,
  onPress,
  style,
}) => {
  const { t } = useTranslation()

  return (
    <View style={[styles.headerContainer, style]}>
      {topics?.length === 0 && !location && (
        <HoliText size="extralarge">
          <Trans t={t} i18nKey="spaces.filter.all.topics" shouldUnescape={true}>
            <SpacesFilterTag
              filter={'text'}
              tag={t('spaces.filter.allTopics')}
              style={styles.filter}
              label={t('spaces.filter.label.allTopics')}
              onPress={onPress}
            />
            <SpacesFilterTag
              filter={'location'}
              location={location}
              style={styles.filter}
              label={t('spaces:filter.label.location')}
              onPress={onPress}
            />
          </Trans>
        </HoliText>
      )}
      {allTopics && location && (
        <>
          <HoliText size="extralarge">
            <Trans t={t} i18nKey="spaces.filter.all.topics.location" shouldUnescape={true}>
              <SpacesFilterTag
                filter={'text'}
                tag={t('spaces.filter.allTopics')}
                style={styles.filter}
                label={t('spaces.filter.label.allTopics')}
                onPress={onPress}
              />
              <SpacesFilterTag
                filter={'location'}
                location={location}
                style={styles.filter}
                label={t('spaces.filter.label.location')}
                onPress={onPress}
              />
            </Trans>
          </HoliText>
        </>
      )}
      {location && topics?.length === 0 && !allTopics && (
        <HoliText size="extralarge">
          <Trans t={t} i18nKey="spaces.filter.discover.location.topics" shouldUnescape={true}>
            <SpacesFilterTag
              filter={'all'}
              label={t('spaces.filter.label.all')}
              style={styles.filter}
              onPress={onPress}
            />
            <SpacesFilterTag
              filter={'location'}
              location={location}
              style={styles.filterBottom}
              label={t('spaces.filter.label.location')}
              onPress={onPress}
            />
          </Trans>
        </HoliText>
      )}
      {topics?.length !== 0 && !location && (
        <>
          {topics?.map((topic, index) => (
            <SpacesFilterTag
              filter={'topics'}
              tag={topic}
              key={index}
              style={[styles.filterMap, styles.filterTopics]}
              label={t('spaces.filter.label.topic')}
              onPress={onPress}
            />
          ))}
          <HoliText size="extralarge">
            <Trans t={t} i18nKey="spaces.filter.topics" shouldUnescape={true} />
          </HoliText>
        </>
      )}
      {topics?.length !== 0 && !allTopics && location && (
        <>
          {topics?.map((topic, index) => (
            <SpacesFilterTag
              filter={'topics'}
              tag={topic}
              key={index}
              style={[styles.filterMap, styles.filterTopics]}
              label={t('spaces.filter.label.topic')}
              onPress={onPress}
            />
          ))}
          <HoliText size="extralarge" style={styles.filterMap}>
            <Trans t={t} i18nKey="spaces.filter.topics.location" shouldUnescape={true}>
              <SpacesFilterTag
                filter={'location'}
                location={location}
                style={styles.filter}
                label={t('spaces.filter.label.location')}
                onPress={onPress}
              />
            </Trans>
          </HoliText>
        </>
      )}
    </View>
  )
}
export default SpacesFilterHeader

const styles = StyleSheet.create({
  filter: {
    marginTop: Platform.OS === 'web' ? 0 : -8,
  },
  filterBottom: {
    marginVertical: Platform.OS === 'web' ? 0 : -8,
  },
  filterMap: {
    marginBottom: 8,
  },
  filterTopics: {
    marginRight: 4,
  },
  headerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
})

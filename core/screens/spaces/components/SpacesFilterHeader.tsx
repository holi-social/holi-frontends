import React, { useCallback, useMemo } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { GestureResponderEvent, StyleProp, StyleSheet, ViewStyle } from 'react-native'
import { Platform } from 'react-native'

import SpacesFilterTag from '@holi/core/screens/spaces/components/SpacesFilterTag'
import { Term } from '@holi/core/screens/userprofile/types'
import HoliText from '@holi/ui/components/atoms/HoliText'

export type SpacesFilterHeaderProps = {
  location?: string
  topics: Term[]
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

  const i18nKey = useMemo(() => {
    if (allTopics) {
      return location ? 'spaces.filter.all.location' : 'spaces.filter.all'
    }
    return location ? 'spaces.filter.topics.location' : 'spaces.filter.topics'
  }, [location, allTopics])
  const topicPlaceholder = '<topicPlaceholder>'
  const escapeTopicPlaceholder = useCallback(
    (value) => {
      if (value === topicPlaceholder) {
        const offset = location ? 1 : 0
        return topics.map((topic, index) => `<${index + offset}>${topic.title}</${index + offset}>`).join('')
      }
      return value
    },
    [location, topics]
  )

  const tags = location
    ? [
        <SpacesFilterTag
          key="location"
          filter={'location'}
          style={styles.filter}
          label={t('spaces.filter.label')}
          onPress={onPress}
        />,
      ]
    : []
  const topicTags = allTopics
    ? [
        <SpacesFilterTag
          key="all"
          filter={'all'}
          style={styles.filter}
          label={t('spaces.filter.label')}
          onPress={onPress}
        />,
      ]
    : topics?.map((topic, index) => (
        <SpacesFilterTag
          filter={'topics'}
          key={topic.id}
          style={[styles.filter, styles.filterTopics, index === topics.length - 1 && styles.filterTopicsLast]}
          label={t('spaces.filter.label')}
          onPress={onPress}
        >
          {topic.title}
        </SpacesFilterTag>
      ))

  return (
    <HoliText size="extralarge" style={[styles.tagContainer, style]}>
      <Trans
        t={t}
        i18nKey={i18nKey}
        values={{ location, topics: topicPlaceholder }}
        tOptions={{ interpolation: { escape: escapeTopicPlaceholder } }}
        shouldUnescape={true}
        components={tags.concat(topicTags)}
      />
    </HoliText>
  )
}
export default SpacesFilterHeader

const styles = StyleSheet.create({
  filter: {
    ...Platform.select({
      native: {
        marginTop: 8,
      },
      web: {
        marginBottom: 8,
      },
    }),
  },
  filterTopics: {
    marginTop: 0,
    marginRight: 4,
  },
  filterTopicsLast: {
    marginRight: 0,
  },
  tagContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    ...Platform.select({
      web: {
        alignItems: 'baseline',
      },
    }),
    backgroundColor: 'yellow',
    ...Platform.select({
      web: {},
      native: {
        marginVertical: -16,
      },
    }),
    alignItems: 'baseline',
  },
})

import React, { useMemo } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { GestureResponderEvent, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
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
  const escape = (value) => {
    if (value === topicPlaceholder) {
      const offset = location ? 1 : 0
      return topics.map((topic, index) => `<${index + offset}>${topic.title}</${index + offset}>`).join('')
    }
    return value
  }

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
  if (allTopics) {
    tags.push(
      <SpacesFilterTag
        key="all"
        filter={'all'}
        style={styles.filter}
        label={t('spaces.filter.label')}
        onPress={onPress}
      />
    )
  }
  const topicTags = allTopics
    ? []
    : topics?.map((topic) => (
        <SpacesFilterTag
          filter={'topics'}
          key={topic.id}
          style={[styles.filterTopics]}
          label={t('spaces.filter.label')}
          onPress={onPress}
        >
          {topic.title}
        </SpacesFilterTag>
      ))

  return (
    <View style={[styles.headerContainer, style]}>
      <HoliText size="extralarge">
        <Trans
          t={t}
          i18nKey={i18nKey}
          values={{ location, topics: topicPlaceholder }}
          style={styles.tagContainer}
          tOptions={{ interpolation: { escape } }}
          shouldUnescape={true}
          components={tags.concat(topicTags)}
        />
      </HoliText>
    </View>
  )
}
export default SpacesFilterHeader

const styles = StyleSheet.create({
  filter: {
    marginTop: Platform.OS === 'web' ? 0 : -8,
    marginVertical: Platform.OS === 'web' ? 0 : -8,
  },
  filterTopics: {
    marginBottom: 8,
    marginRight: 4,
  },
  topicContainer: {
    // flexDirection: 'row',
    // flexWrap: 'wrap',
    // flex: 0,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flexShrink: 0,
  },
  headerContainer: {
    // flexDirection: 'row',
    // flexWrap: 'wrap',
    // alignItems: 'flex-start',
  },
})

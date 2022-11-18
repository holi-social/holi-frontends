import React, { useMemo } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { GestureResponderEvent, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import { Platform } from 'react-native'

import SpacesFilterTag from '@holi/core/screens/spaces/SpacesFilterTag'
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
  const placeholder = '<0></0>'

  return (
    <View style={[styles.headerContainer, style]}>
      <HoliText size="extralarge">
        <Trans
          t={t}
          i18nKey={i18nKey}
          values={{ location, placeholder }}
          style={styles.tagContainer}
          shouldUnescape={true}
        >
          {allTopics ? (
            <SpacesFilterTag filter={'all'} style={styles.filter} label={t('spaces.filter.label')} onPress={onPress} />
          ) : (
            <View style={styles.topicContainer}>
              {topics?.map((topic) => (
                <SpacesFilterTag
                  filter={'topics'}
                  key={topic.id}
                  style={[styles.filterTopics]}
                  label={t('spaces.filter.label')}
                  onPress={onPress}
                >
                  {topic.title}
                </SpacesFilterTag>
              ))}
            </View>
          )}
          {location && (
            <SpacesFilterTag
              filter={'location'}
              style={styles.filter}
              label={t('spaces.filter.label')}
              onPress={onPress}
            />
          )}
        </Trans>
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

import React, { useMemo } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { GestureResponderEvent, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import { Platform } from 'react-native'

import SpacesFilterTag from '@holi/core/screens/spaces/SpacesFilterTag'
import HoliText from '@holi/ui/components/atoms/HoliText'

export type SpacesFilterHeaderProps = {
  location?: string
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

  const i18nKey = useMemo(() => {
    if (allTopics) {
      return location ? 'spaces.filter.all.location' : 'spaces.filter.all'
    }
    return location ? 'spaces.filter.topics.location' : 'spaces.filter.topics'
  }, [location, allTopics])

  return (
    <View style={[styles.headerContainer, style]}>
      <HoliText size="extralarge">
        <Trans t={t} i18nKey={i18nKey} values={{ location }}>
          {allTopics ? (
            <SpacesFilterTag
              filter={'all'}
              style={styles.filter}
              label={t('spaces.filter.label.allTopics')}
              onPress={onPress}
            />
          ) : (
            <>
              {topics?.map((topic, index) => (
                <SpacesFilterTag
                  filter={'topics'}
                  key={index}
                  style={[styles.filterMap, styles.filterTopics]}
                  label={t('spaces.filter.label.topic')}
                  onPress={onPress}
                >
                  {topic}
                </SpacesFilterTag>
              ))}
            </>
          )}
          {location && (
            <SpacesFilterTag
              filter={'location'}
              style={styles.filter}
              label={t('spaces:filter.label.location')}
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

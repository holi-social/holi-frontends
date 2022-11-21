import React, { memo, useMemo } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { GestureResponderEvent, StyleProp, StyleSheet, ViewStyle } from 'react-native'

import { Term } from '@holi/core/screens/userprofile/types'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'

export type SpacesFilterHeaderProps = {
  location?: string
  topics: Term[]
  allTopics?: boolean
  onPress: (event: React.SyntheticEvent | GestureResponderEvent) => void
  style?: StyleProp<ViewStyle>
}

const SpacesFilterHeader: React.VFC<SpacesFilterHeaderProps> = ({ location, topics, style }) => {
  const { t } = useTranslation()

  const i18nKey = useMemo(() => {
    return location ? 'spaces.filter.all.location' : 'spaces.filter.all'
    /*   return location ? 'spaces.filter.topics.location' : 'spaces.filter.topics' */
  }, [location])
  const topicsNames = useMemo(() => topics.map((topic) => topic.title).join(', '), [topics])

  return (
    <HoliHeading level="1" size="large" style={[styles.tagContainer, style]}>
      <Trans t={t} i18nKey={i18nKey} values={{ location, topics: topicsNames }} />
    </HoliHeading>
  )
}
export default memo(SpacesFilterHeader)

const styles = StyleSheet.create({
  tagContainer: {
    fontWeight: '400',
  },
})

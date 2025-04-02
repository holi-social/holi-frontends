import { ChipLabel } from 'holi-bricks/components/chips'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import { useTranslation } from 'react-i18next'

import { HoliGap } from '@holi/ui/components/atoms/HoliGap'

export type TopicLabelsProps = {
  topicSlugs: readonly string[] | undefined
}

export type SkillLabelsProps = {
  skillSlugs: readonly string[] | undefined
}

export type VolunteeringLabelsProps = TopicLabelsProps & SkillLabelsProps & { displayAll: boolean }

const TopicLabelsForListView = ({ topicSlugs }: TopicLabelsProps) => {
  const { t } = useTranslation()
  const label = topicSlugs?.length ? t(`topic.${topicSlugs[0]}`) : undefined
  const count = topicSlugs && topicSlugs.length > 1 ? topicSlugs.length - 1 : undefined

  return (
    !!label && (
      <View style={styles.labelRowListView} testID="topic-labels-list-view">
        <ChipLabel size="sm" color="green">
          {label}
        </ChipLabel>
        {!!count && (
          <ChipLabel size="sm" color="green">
            {'+' + count}
          </ChipLabel>
        )}
      </View>
    )
  )
}

const SkillLabelsForListView = ({ skillSlugs }: SkillLabelsProps) => {
  const { t } = useTranslation()
  const label = skillSlugs?.length ? t(`skill.${skillSlugs[0]}`) : undefined
  const count = skillSlugs && skillSlugs.length > 1 ? skillSlugs.length - 1 : undefined

  return (
    !!label && (
      <View style={styles.labelRowListView}>
        <ChipLabel size="sm" color="blue">
          {label}
        </ChipLabel>
        {!!count && (
          <ChipLabel size="sm" color="blue">
            {'+' + count}
          </ChipLabel>
        )}
      </View>
    )
  )
}

export const VolunteeringLabels = ({ topicSlugs, skillSlugs }: VolunteeringLabelsProps) => {
  return (
    <>
      {topicSlugs && topicSlugs.length > 0 && <TopicLabelsForListView topicSlugs={topicSlugs} />}
      {topicSlugs && topicSlugs.length > 0 && skillSlugs && skillSlugs.length > 0 && <HoliGap size={'xxs'} />}
      {skillSlugs && skillSlugs.length > 0 && <SkillLabelsForListView skillSlugs={skillSlugs} />}
    </>
  )
}

const styles = StyleSheet.create({
  labelRowListView: {
    flexDirection: 'row',
    gap: 6,
  },
  labelRowDetailView: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
})

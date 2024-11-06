import { ChipLabel } from 'holi-bricks/components/chips'
import React from 'react'
import { StyleSheet, View } from 'react-native'

import { useSkills, useTopics } from '@holi/core/domain/shared/hooks'
import { Skill, Topic } from '@holi/core/domain/shared/types'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'

export type TopicLabelsProps = {
  topicSlugs: readonly string[] | undefined
}

export type SkillLabelsProps = {
  skillSlugs: readonly string[] | undefined
}

export type VolunteeringLabelsProps = TopicLabelsProps & SkillLabelsProps & { displayAll: boolean }

const topicNameBySlug = (topicSlug: string, allTopics: readonly Topic[]) =>
  allTopics.find((t) => t.slug === topicSlug)?.title
const skillNameBySlug = (skillSlug: string, allSkills: readonly Skill[]) =>
  allSkills.find((s) => s.slug === skillSlug)?.title

const TopicLabelsForListView = ({ topicSlugs, topics }: TopicLabelsProps & { topics: readonly Topic[] }) => {
  const label = topicSlugs && topicSlugs.length > 0 ? topicNameBySlug(topicSlugs[0], topics) : undefined
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

const SkillLabelsForListView = ({ skillSlugs, skills }: SkillLabelsProps & { skills: readonly Skill[] }) => {
  const label = skillSlugs && skillSlugs.length > 0 ? skillNameBySlug(skillSlugs[0], skills) : undefined
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

const TopicLabelsForDetailView = ({ topicSlugs, topics }: TopicLabelsProps & { topics: readonly Topic[] }) => {
  const labels: string[] | undefined = topicSlugs
    ?.map((slug) => topicNameBySlug(slug, topics))
    .filter((label) => !!label) as string[] | undefined

  return (
    <View style={styles.labelRowDetailView}>
      {labels?.map((label, index) => (
        <ChipLabel key={index} size="sm" color="green">
          {label}
        </ChipLabel>
      ))}
    </View>
  )
}

const SkillLabelsForDetailView = ({ skillSlugs, skills }: SkillLabelsProps & { skills: readonly Skill[] }) => {
  const labels: string[] | undefined = skillSlugs
    ?.map((slug) => skillNameBySlug(slug, skills))
    .filter((label) => !!label) as string[] | undefined

  return (
    <View style={styles.labelRowDetailView}>
      {labels?.map((label, index) => (
        <ChipLabel key={index} size="sm" color="blue">
          {label}
        </ChipLabel>
      ))}
    </View>
  )
}

export const VolunteeringLabels = ({ topicSlugs, skillSlugs, displayAll }: VolunteeringLabelsProps) => {
  const { topics, topicsLoading } = useTopics()
  const { skills, skillsLoading } = useSkills()

  if (topicsLoading || skillsLoading) return null

  if (!displayAll) {
    return (
      <>
        {topicSlugs && topicSlugs.length > 0 && <TopicLabelsForListView topicSlugs={topicSlugs} topics={topics} />}
        {topicSlugs && topicSlugs.length > 0 && skillSlugs && skillSlugs.length > 0 && <HoliGap size={'xxs'} />}
        {skillSlugs && skillSlugs.length > 0 && <SkillLabelsForListView skillSlugs={skillSlugs} skills={skills} />}
      </>
    )
  } else {
    return (
      <>
        {topicSlugs && topicSlugs.length > 0 && <TopicLabelsForDetailView topicSlugs={topicSlugs} topics={topics} />}
        {topicSlugs && topicSlugs.length > 0 && skillSlugs && skillSlugs.length > 0 && <HoliGap size={'xs'} />}
        {skillSlugs && skillSlugs.length > 0 && <SkillLabelsForDetailView skillSlugs={skillSlugs} skills={skills} />}
      </>
    )
  }
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

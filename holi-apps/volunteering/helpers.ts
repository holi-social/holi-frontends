import { Skill, Topic } from '@holi/core/domain/shared/types'

export const labelsForListings = (
  topicsSlugs: readonly string[] | undefined,
  skillsSlugs: readonly string[] | undefined,
  allTopics: readonly Topic[],
  allSkills: readonly Skill[]
): {
  topicLabel: string | undefined
  topicLabelCount: number | undefined
  skillLabel: string | undefined
  skillLabelCount: number | undefined
} => {
  const topicName = (topicSlug: string) => allTopics.find((t) => t.slug === topicSlug)?.title
  const skillName = (skillSlug: string) => allSkills.find((s) => s.slug === skillSlug)?.title

  const forTopics =
    topicsSlugs && topicsSlugs.length > 0
      ? {
          topicLabel: topicName(topicsSlugs[0]),
          topicLabelCount: topicsSlugs.length > 1 ? topicsSlugs.length - 1 : undefined,
        }
      : {
          topicLabel: undefined,
          topicLabelCount: undefined,
        }

  const forSkills =
    skillsSlugs && skillsSlugs.length > 0
      ? {
          skillLabel: skillName(skillsSlugs[0]),
          skillLabelCount: skillsSlugs.length > 1 ? skillsSlugs.length - 1 : undefined,
        }
      : {
          skillLabel: undefined,
          skillLabelCount: undefined,
        }

  return { ...forTopics, ...forSkills }
}

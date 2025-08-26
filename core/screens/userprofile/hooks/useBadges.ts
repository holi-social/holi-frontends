import { useTranslation } from 'react-i18next'
import { useBadgesQuery } from '@holi/api/graphql/graphql-codegen'

export type Badge = {
  title: string
  description: string
  currentStep?: number
  totalSteps?: number
  date?: string
  state: string
  imgSrc: string
  descriptionActive?: string
  descriptionAchieved?: string
  buttonLabel?: string
  buttonLink?: string
}

export const useBadges = () => {
  const { data } = useBadgesQuery()
  const { t } = useTranslation()

  const slugTitleMapping: Record<string, string> = {
    'impact.spark': 'volunteering.starter',
    'impact.explorer': 'volunteering.levelOne',
    'story.spark': 'goodDeedPost.starter',
    'story.explorer': 'goodDeedPost.levelOne',
  }

  const inProgressBadges = data?.rewards_badges.inProgress.map((b) => ({
    title: t(`badge.${slugTitleMapping[b.slug]}.name`),
    description: t(`badge.${slugTitleMapping[b.slug]}.descriptionShort`, {
      totalSteps: b.progressGoal,
      currentSteps: b.progressMade,
    }),
    currentStep: b.progressMade,
    totalSteps: b.progressGoal,
    date: undefined,
    state: b.progressMade && b.progressMade > 0 ? 'active' : 'locked',
    imgSrc: b.slug.includes('spark')
      ? require('@holi/ui/assets/img/illustrations/illustration_badge_placeholder_blue_light.svg')
      : require('@holi/ui/assets/img/illustrations/illustration_badge_placeholder_orange_light.svg'),
    buttonLabel: t(`badge.${b.slug}.button`),
    buttonLink: b.slug.includes('volunteering') ? '/act' : '/',
  }))

  const unlockedBadges = data?.rewards_badges.unlocked.map((b) => ({
    title: slugTitleMapping[b.slug],
    description: t(`badge.${slugTitleMapping[b.slug]}.descriptionShort`),
    currentStep: undefined,
    totalSteps: undefined,
    date: b.unlockedAt,
    state: 'achieved',
    imgSrc: b.slug.includes('spark')
      ? require('@holi/ui/assets/img/illustrations/illustration_badge_placeholder_blue.svg')
      : require('@holi/ui/assets/img/illustrations/illustration_badge_placeholder_orange.svg'),
    imgSrcActive: undefined,
    buttonLabel: t(`badge.${b.slug}.button`),
    buttonLink: b.slug.includes('impact') ? '/act' : '/share',
  }))

  const allBadges: Badge[] = [...(inProgressBadges || []), ...(unlockedBadges || [])]

  return { badges: allBadges }
}

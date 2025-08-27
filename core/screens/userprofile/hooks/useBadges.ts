import { useTranslation } from 'react-i18next'
import { useBadgesQuery } from '@holi/api/graphql/graphql-codegen'

export type Badge = {
  title: string
  description: string
  descriptionActive: string
  descriptionAchieved: string
  buttonLabel: string
  buttonLink: string
  state: BadgeState
  imgSrc: string
  currentStep?: number
  totalSteps?: number
  unlockedAt?: Date
  seenAt?: Date
}

export enum BadgeState {
  active = 'active',
  locked = 'locked',
  achieved = 'achieved',
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
      currentStep: b.progressMade,
    }),
    currentStep: b.progressMade,
    totalSteps: b.progressGoal,
    unlockedAt: undefined,
    state: b.slug.includes('spark') || (b.progressMade && b.progressMade > 0) ? BadgeState.active : BadgeState.locked,
    imgSrc: b.slug.includes('spark')
      ? require('@holi/ui/assets/img/illustrations/illustration_badge_placeholder_blue_light.svg')
      : require('@holi/ui/assets/img/illustrations/illustration_badge_placeholder_orange_light.svg'),
    descriptionActive: t(`badge.${slugTitleMapping[b.slug]}.description.active`),
    descriptionAchieved: t(`badge.${slugTitleMapping[b.slug]}.description.achieved`),
    buttonLabel: t(`badge.${slugTitleMapping[b.slug]}.button`),
    buttonLink: b.slug.includes('volunteering') ? '/act' : '/',
  }))

  const unlockedBadges = data?.rewards_badges.unlocked.map((b) => ({
    title: slugTitleMapping[b.slug],
    description: t(`badge.${slugTitleMapping[b.slug]}.descriptionShort`),
    currentStep: undefined,
    totalSteps: undefined,
    unlockedAt: new Date(b.unlockedAt),
    state: BadgeState.achieved,
    imgSrc: b.slug.includes('spark')
      ? require('@holi/ui/assets/img/illustrations/illustration_badge_placeholder_blue.svg')
      : require('@holi/ui/assets/img/illustrations/illustration_badge_placeholder_orange.svg'),
    descriptionActive: t(`badge.${slugTitleMapping[b.slug]}.description.active`),
    descriptionAchieved: t(`badge.${slugTitleMapping[b.slug]}.description.achieved`),
    buttonLabel: t(`badge.${b.slug}.button`),
    buttonLink: b.slug.includes('impact') ? '/act' : '/share',
  }))

  const allBadges: Badge[] = [...(inProgressBadges || []), ...(unlockedBadges || [])]

  return { badges: allBadges }
}

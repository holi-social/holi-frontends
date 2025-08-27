import { useBadgesQuery } from '@holi/api/graphql/graphql-codegen'

export type Badge = {
  localazyKey: string
  buttonLink: string
  state: BadgeState
  imgSrc: string
  id?: string
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
  const { data, refetch } = useBadgesQuery()

  const slugTitleMapping: Record<string, string> = {
    'impact.spark': 'volunteering.starter',
    'impact.explorer': 'volunteering.levelOne',
    'story.spark': 'goodDeedPost.starter',
    'story.explorer': 'goodDeedPost.levelOne',
  }

  const inProgressBadges = data?.rewards_badges.inProgress.map((b) => ({
    id: undefined,
    currentStep: b.progressMade,
    totalSteps: b.progressGoal,
    unlockedAt: undefined,
    state: b.slug.includes('spark') || (b.progressMade && b.progressMade > 0) ? BadgeState.active : BadgeState.locked,
    imgSrc: b.slug.includes('spark')
      ? require('@holi/ui/assets/img/illustrations/illustration_badge_placeholder_blue_light.svg')
      : require('@holi/ui/assets/img/illustrations/illustration_badge_placeholder_orange_light.svg'),
    localazyKey: slugTitleMapping[b.slug],
    buttonLink: b.slug.includes('volunteering') ? '/act' : '/',
  }))

  const unlockedBadges = data?.rewards_badges.unlocked.map((b) => ({
    id: b.id,
    currentStep: undefined,
    totalSteps: undefined,
    unlockedAt: new Date(b.unlockedAt),
    seenAt: b.seenAt ? new Date(b.seenAt) : undefined,
    state: BadgeState.achieved,
    imgSrc: b.slug.includes('spark')
      ? require('@holi/ui/assets/img/illustrations/illustration_badge_placeholder_blue.svg')
      : require('@holi/ui/assets/img/illustrations/illustration_badge_placeholder_orange.svg'),
    localazyKey: slugTitleMapping[b.slug],
    buttonLink: b.slug.includes('impact') ? '/act' : '/share',
  }))

  const allBadges: Badge[] = [...(inProgressBadges || []), ...(unlockedBadges || [])]

  return { badges: allBadges, refetchBadges: refetch }
}

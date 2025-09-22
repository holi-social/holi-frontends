import { type BadgesQuery, useBadgesQuery } from '@holi/api/graphql/graphql-codegen'
import type { animations } from '@holi/ui/lottie-animations'

export type Badge = {
  localazyKey: string
  state: BadgeState
  imgSrc: string
  imgSrcDetailed: string // todo: remove if unused
  animationName: keyof typeof animations
  buttonLink?: string
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
  const { data, refetch, loading } = useBadgesQuery()

  const slugTitleMapping: Record<string, string> = {
    'impact.spark': 'volunteering.starter',
    'impact.explorer': 'volunteering.levelOne',
    'story.spark': 'goodDeedPost.starter',
    'story.explorer': 'goodDeedPost.levelOne',
  }

  const slugIllustrationMapping: Record<string, string> = {
    'impact.spark': require('@holi/ui/assets/img/badges/badge-impact-starter-small.svg'),
    'impact.explorer': require('@holi/ui/assets/img/badges/badge-impact-explorer-small.svg'),
    'story.spark': require('@holi/ui/assets/img/badges/badge-story-starter-small.svg'),
    'story.explorer': require('@holi/ui/assets/img/badges/badge-story-explorer-small.svg'),
  }

  const slugDetailedIllustrationMapping: Record<string, string> = {
    'impact.spark': require('@holi/ui/assets/img/badges/badge-impact-starter.svg'),
    'impact.explorer': require('@holi/ui/assets/img/badges/badge-impact-explorer.svg'),
    'story.spark': require('@holi/ui/assets/img/badges/badge-story-starter.svg'),
    'story.explorer': require('@holi/ui/assets/img/badges/badge-story-explorer.svg'),
  }

  const slugAnimationMapping: Record<string, keyof typeof animations> = {
    'impact.spark': 'badgeImpactStarter',
    'impact.explorer': 'badgeImpactExplorer',
    'story.spark': 'badgeStoryStarter',
    'story.explorer': 'badgeStoryExplorer',
  }

  const mapBadges = (data?: BadgesQuery): Badge[] => {
    if (!data) return []

    const inProgressBadges = data?.rewards_badges.inProgress.map((b) => ({
      id: undefined,
      currentStep: b.progressMade,
      totalSteps: b.progressGoal,
      unlockedAt: undefined,
      state: b.slug.includes('spark') || (b.progressMade && b.progressMade > 0) ? BadgeState.active : BadgeState.locked, // badges including 'spark' are the starter badges and should be active by default
      imgSrc: slugIllustrationMapping[b.slug],
      imgSrcDetailed: slugDetailedIllustrationMapping[b.slug],
      animationName: slugAnimationMapping[b.slug],
      localazyKey: slugTitleMapping[b.slug],
      buttonLink: b.slug.includes('impact') ? '/act' : '/',
    }))

    const unlockedBadges = data?.rewards_badges.unlocked.map((b) => ({
      id: b.id,
      currentStep: undefined,
      totalSteps: undefined,
      unlockedAt: new Date(b.unlockedAt),
      seenAt: b.seenAt ? new Date(b.seenAt) : undefined,
      state: BadgeState.achieved,
      imgSrc: slugIllustrationMapping[b.slug], // todo: add gray out effect
      imgSrcDetailed: slugDetailedIllustrationMapping[b.slug],
      animationName: slugAnimationMapping[b.slug],
      localazyKey: slugTitleMapping[b.slug],
      buttonLink: undefined,
    }))

    return [...inProgressBadges, ...unlockedBadges]
  }

  const allBadges = mapBadges(data)

  return {
    badges: allBadges,
    refetchBadges: async () => {
      const result = await refetch()
      return mapBadges(result.data)
    },
    loading,
  }
}

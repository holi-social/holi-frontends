import type { HoliStepperItem } from '@holi/ui/components/organisms/HoliStepperV2'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const GoodDeedsOnboardingStepKeys = [
  'GOOD_DEEDS_IMPACT_STARTER',
  'GOOD_DEEDS_YOU_ARE_HERO',
  'GOOD_DEEDS_BECOME_HERO',
  'GOOD_DEEDS_PROGRESS_EXPLANATION',
  'GOOD_DEEDS_CAMPAIGN_EXPLANATION',
] as const
export type GoodDeedsOnboardingStepKey = (typeof GoodDeedsOnboardingStepKeys)[number]

export interface GoodDeedsOnboardingStepItem extends HoliStepperItem {
  key: GoodDeedsOnboardingStepKey
}

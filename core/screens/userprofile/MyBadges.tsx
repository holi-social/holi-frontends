import React from 'react'
import { Text } from 'holi-bricks/components/text'
import { Stack } from 'holi-bricks/components/stack'
import useTracking from '@holi/core/tracking/hooks/useTracking'
import { useFocusEffect } from '@holi/core/helpers/useFocusEffect'
import { TrackingEvent } from '@holi/core/tracking'
import { Image } from 'holi-bricks/components/image'
import { ChipLabel } from 'holi-bricks/components/chips'
import { HoliProgressBar } from '@holi/ui/components/molecules/HoliProgressBar'

const BADGE_WIDTH = 164
const IMAGE_WIDTH = 80

const mockStarterBadges = [
  {
    title: 'Impact Starter',
    description: 'Commit to your first volunteering',
    currentStep: undefined,
    totalSteps: undefined,
    date: '15.07.2025',
    state: 'achieved',
  },
  {
    title: 'Story Starter',
    description: 'Share a "Good Deed" Post',
    currentStep: undefined,
    totalSteps: undefined,
    date: undefined,
    state: 'active',
  },
]

const mockExplorerBadges = [
  {
    title: 'Impact Explorer',
    description: 'Volunteerings',
    currentStep: 1,
    totalSteps: 5,
    date: undefined,
    state: 'active',
  },
  {
    title: 'Story Explorer',
    description: '"Good Deed" Posts',
    currentStep: 5,
    totalSteps: undefined,
    date: undefined,
    state: 'locked',
  },
]

const MyBadges = () => {
  const { track } = useTracking()

  useFocusEffect(() => {
    track(TrackingEvent.UserProfile.badgesPageOpened())
  })

  return (
    <Stack padding={{ top: 'xs', bottom: 'xs' }} gap="xxs">
      <Text size="xxl">Superpowers</Text>

      <Stack backgroundColor="support" padding={{ top: '3xs', bottom: '3xs' }} borderRadius="md">
        <Stack gap="md" direction="row" justifyContent="space-around" wrap="wrap">
          {mockStarterBadges.map((badge) => (
            <Stack
              gap="3xs"
              padding={{ top: 'xs', bottom: 'xs', left: '3xs', right: '3xs' }}
              width={BADGE_WIDTH}
              key={badge.title}
            >
              <Stack alignItems="center">
                <Image
                  source={
                    badge.state === 'locked'
                      ? require('@holi/ui/assets/img/illustrations/badge-placeholder-locked.svg')
                      : badge.state === 'active'
                        ? require('@holi/ui/assets/img/illustrations/badge-placeholder-active.svg')
                        : require('@holi/ui/assets/img/illustrations/badge-placeholder-achieved.svg')
                  }
                  alt="badge illustration"
                  width={IMAGE_WIDTH}
                  height={IMAGE_WIDTH * 0.7}
                  resizeMode="contain"
                />
              </Stack>
              <Stack gap="4xs" alignItems="center">
                <Text size="sm" textAlign="center">
                  {badge.title}
                </Text>
                <Text size="xs" textAlign="center" color="support">
                  {badge.currentStep}
                  {badge.currentStep && badge.totalSteps && '/'}
                  {badge.totalSteps} {badge.description}
                </Text>
                {badge.currentStep && badge.totalSteps && (
                  <HoliProgressBar percentage={(badge.currentStep / badge.totalSteps) * 100 || 0} size="small" />
                )}
                {badge.date && (
                  <Stack alignItems="center">
                    <ChipLabel size="sm" color="mono">
                      {badge.date}
                    </ChipLabel>
                  </Stack>
                )}
              </Stack>
            </Stack>
          ))}
        </Stack>

        <Stack gap="md" direction="row" justifyContent="space-around" wrap="wrap">
          {mockExplorerBadges.map((badge) => (
            <Stack
              gap="3xs"
              padding={{ top: 'xs', bottom: 'xs', left: '3xs', right: '3xs' }}
              width={BADGE_WIDTH}
              key={badge.title}
            >
              <Stack alignItems="center">
                <Image
                  source={
                    badge.state === 'locked'
                      ? require('@holi/ui/assets/img/illustrations/badge-placeholder-locked.svg')
                      : badge.state === 'active'
                        ? require('@holi/ui/assets/img/illustrations/badge-placeholder-active.svg')
                        : require('@holi/ui/assets/img/illustrations/badge-placeholder-achieved.svg')
                  }
                  // source={require('@holi/ui/assets/img/illustrations/illustration_favorites.svg')}
                  alt="badge illustration"
                  width={IMAGE_WIDTH}
                  height={IMAGE_WIDTH * 0.7}
                  resizeMode="contain"
                />
              </Stack>
              <Stack gap="4xs" alignItems="center">
                <Text size="sm" textAlign="center">
                  {badge.title}
                </Text>
                <Text size="xs" textAlign="center" color="support">
                  {badge.currentStep}
                  {badge.currentStep && badge.totalSteps && '/'}
                  {badge.totalSteps} {badge.description}
                </Text>
                {badge.currentStep && badge.totalSteps && (
                  <HoliProgressBar percentage={(badge.currentStep / badge.totalSteps) * 100 || 0} size="small" />
                )}
                {badge.date && (
                  <Stack alignItems="center">
                    <ChipLabel size="sm" color="mono">
                      {badge.date}
                    </ChipLabel>
                  </Stack>
                )}
              </Stack>
            </Stack>
          ))}
        </Stack>
      </Stack>
    </Stack>
  )
}

export default MyBadges

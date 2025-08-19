import React from 'react'
import { Text } from 'holi-bricks/components/text'
import { Stack } from 'holi-bricks/components/stack'
import useTracking from '@holi/core/tracking/hooks/useTracking'
import { useFocusEffect } from '@holi/core/helpers/useFocusEffect'
import { TrackingEvent } from '@holi/core/tracking'
import { Image } from 'holi-bricks/components/image'
import { ChipLabel } from 'holi-bricks/components/chips'
import { HoliProgressBar } from '@holi/ui/components/molecules/HoliProgressBar'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { LockFilled } from '@holi/icons/src/generated'
import { View } from 'react-native'

const PROGRESSBAR_WIDTH = 100
const IMAGE_WIDTH = 80

const mockStarterBadges = [
  {
    title: 'Impact Starter',
    description: 'Commit to your first volunteering',
    currentStep: undefined,
    totalSteps: undefined,
    date: '15.07.2025',
    state: 'achieved',
    imageSrc: require('@holi/ui/assets/img/illustrations/illustration_badge_placeholder_blue.svg'),
  },
  {
    title: 'Story Starter',
    description: 'Share a "Good Deed" Post',
    currentStep: undefined,
    totalSteps: undefined,
    date: undefined,
    state: 'active',
    imageSrc: require('@holi/ui/assets/img/illustrations/illustration_badge_placeholder_blue.svg'),
  },
  {
    title: 'Impact Explorer',
    description: 'Volunteerings',
    currentStep: 1,
    totalSteps: 5,
    date: undefined,
    state: 'active',
    imageSrc: require('@holi/ui/assets/img/illustrations/illustration_badge_placeholder_orange.svg'),
  },
  {
    title: 'Story Explorer',
    description: '"Good Deed" Posts',
    currentStep: 5,
    totalSteps: undefined,
    date: undefined,
    state: 'locked',
    imageSrc: require('@holi/ui/assets/img/illustrations/illustration_badge_placeholder_orange.svg'),
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
              width={'45%'}
              key={badge.title}
            >
              <Stack alignItems="center">
                <View style={{ position: 'relative' }}>
                  <Image
                    source={badge.imageSrc}
                    alt="badge illustration"
                    width={IMAGE_WIDTH}
                    height={IMAGE_WIDTH}
                    resizeMode="contain"
                    dimmed={badge.state === 'active' || badge.state === 'locked'}
                  />
                </View>
                {badge.state === 'locked' && (
                  <View style={{ position: 'absolute', alignSelf: 'center', justifyContent: 'center', height: '100%' }}>
                    <HoliIcon icon={LockFilled} color="muted" />
                  </View>
                )}
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
                  <Stack width={PROGRESSBAR_WIDTH} alignItems="center">
                    <HoliProgressBar percentage={(badge.currentStep / badge.totalSteps) * 100 || 0} size="small" />
                  </Stack>
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

import React, { useState } from 'react'
import { Text } from 'holi-bricks/components/text'
import { Stack } from 'holi-bricks/components/stack'
import useTracking from '@holi/core/tracking/hooks/useTracking'
import { useFocusEffect } from '@holi/core/helpers/useFocusEffect'
import { TrackingEvent } from '@holi/core/tracking'
import { Image } from 'holi-bricks/components/image'
import { ChipLabel } from 'holi-bricks/components/chips'
import { HoliProgressBar } from '@holi/ui/components/molecules/HoliProgressBar'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Close, LockFilled } from '@holi/icons/src/generated'
import { Platform, View } from 'react-native'
import BadgeDetails from '@holi/core/screens/userprofile/BadgeDetails'
import HoliModal from '@holi/ui/components/molecules/HoliModal'
import { ButtonIcon } from 'holi-bricks/components/button'
import { type Badge, useBadges } from '@holi/core/screens/userprofile/hooks/useBadges'

const PROGRESSBAR_WIDTH = 100
const IMAGE_WIDTH = 80

const MyBadges = () => {
  const { track } = useTracking()
  const [detailedBadge, setDetailedBadge] = useState<Badge>()
  const { badges } = useBadges()

  useFocusEffect(() => {
    track(TrackingEvent.UserProfile.badgesPageOpened())
  })

  return (
    <>
      <Stack padding={{ top: 'xs', bottom: 'xs' }} gap="xxs">
        <Text size="xxl">Superpowers</Text>

        <Stack backgroundColor="support" padding={{ top: '3xs', bottom: '3xs' }} borderRadius="md">
          <Stack gap="md" direction="row" justifyContent="space-around" wrap="wrap">
            {badges.map((badge) => (
              <Stack
                gap="3xs"
                padding={{ top: 'xs', bottom: 'xs', left: '3xs', right: '3xs' }}
                width={'45%'}
                key={badge.title}
                onPress={() => setDetailedBadge(badge)}
              >
                <Stack alignItems="center">
                  <View style={{ position: 'relative' }}>
                    <Image source={badge.imgSrc} alt="badge illustration" width={IMAGE_WIDTH} height={IMAGE_WIDTH} />
                  </View>
                  {badge.state === 'locked' && (
                    <View
                      style={{ position: 'absolute', alignSelf: 'center', justifyContent: 'center', height: '100%' }}
                    >
                      <HoliIcon icon={LockFilled} color="muted" />
                    </View>
                  )}
                </Stack>
                <Stack gap="4xs" alignItems="center">
                  <Text size="sm" textAlign="center">
                    {badge.title}
                  </Text>

                  <Text size="xs" textAlign="center" color="support">
                    {badge.description}
                  </Text>

                  {badge.currentStep &&
                    badge.totalSteps &&
                    badge.totalSteps > 1 &&
                    badge.currentStep != badge.totalSteps && (
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

      {Platform.OS == 'web' && detailedBadge && (
        <HoliModal
          shown={!!detailedBadge}
          label="badge details"
          onDismiss={() => setDetailedBadge(undefined)}
          desktop
          style={{ width: 600 }}
        >
          <Stack onPress={() => setDetailedBadge(undefined)}>
            <View style={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }}>
              <ButtonIcon
                label="close"
                icon={Close}
                onPress={() => setDetailedBadge(undefined)}
                variant="tertiary"
                size="lg"
              />
            </View>

            <BadgeDetails badge={detailedBadge} />
          </Stack>
        </HoliModal>
      )}

      {Platform.OS !== 'web' && detailedBadge && (
        <HoliModal shown={!!detailedBadge} label="badge details" onDismiss={() => setDetailedBadge(undefined)}>
          <BadgeDetails badge={detailedBadge} />
        </HoliModal>
      )}
    </>
  )
}

export default MyBadges

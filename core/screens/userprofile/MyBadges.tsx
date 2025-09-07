import React, { useCallback, useState } from 'react'
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
import { type Badge, BadgeState, useBadges } from '@holi/core/screens/userprofile/hooks/useBadges'
import { useTranslation } from 'react-i18next'
import HoliSkeleton from '@holi/ui/components/atoms/HoliSkeleton'

const PROGRESSBAR_WIDTH = 100
const IMAGE_WIDTH = 80

const MyBadges = () => {
  const { track } = useTracking()
  const { t } = useTranslation()
  const [detailedBadge, setDetailedBadge] = useState<Badge>()
  const { badges, loading, refetchBadges } = useBadges()

  useFocusEffect(
    useCallback(() => {
      track(TrackingEvent.UserProfile.badgesPageOpened())
      refetchBadges()
    }, [track, refetchBadges])
  )

  if (loading) {
    return (
      <Stack padding={{ top: 'xs', bottom: 'xs' }} gap="xxs">
        <Text size="xxl">Superpowers</Text>
        <HoliSkeleton aspectRatio={712 / 357} borderRadius={16} height={'auto'} width={'100%'} />
      </Stack>
    )
  }

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
                key={t(`badge.${badge.localazyKey}.name`)}
                onPress={() => setDetailedBadge(badge)}
              >
                <Stack alignItems="center">
                  <View style={{ position: 'relative' }}>
                    <Image source={badge.imgSrc} alt="badge illustration" width={IMAGE_WIDTH} height={IMAGE_WIDTH} />
                  </View>
                  {badge.state === BadgeState.locked && (
                    <View
                      style={{ position: 'absolute', alignSelf: 'center', justifyContent: 'center', height: '100%' }}
                    >
                      <HoliIcon icon={LockFilled} color="muted" />
                    </View>
                  )}
                </Stack>
                <Stack gap="4xs" alignItems="center">
                  <Text size="sm" textAlign="center">
                    {t(`badge.${badge.localazyKey}.name`)}
                  </Text>

                  <Text size="xs" textAlign="center" color="support">
                    {t(`badge.${badge.localazyKey}.descriptionShort`, {
                      totalSteps: badge.totalSteps,
                      currentStep: badge.currentStep,
                    })}
                  </Text>

                  {badge.currentStep &&
                  badge.totalSteps &&
                  badge.totalSteps > 1 &&
                  badge.currentStep != badge.totalSteps ? (
                    <Stack width={PROGRESSBAR_WIDTH} alignItems="center">
                      <HoliProgressBar percentage={(badge.currentStep / badge.totalSteps) * 100 || 0} size="small" />
                    </Stack>
                  ) : null}

                  {badge.unlockedAt && (
                    <Stack alignItems="center">
                      <ChipLabel size="sm" color="mono">
                        {badge.unlockedAt.toLocaleDateString('de-DE', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                        })}
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

            <BadgeDetails badge={detailedBadge} onDismiss={() => setDetailedBadge(undefined)} />
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

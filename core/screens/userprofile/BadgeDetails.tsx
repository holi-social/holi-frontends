import React, {} from 'react'

import { Text } from 'holi-bricks/components/text'
import { BadgeState, type Badge } from '@holi/core/screens/userprofile/hooks/useBadges'
import { Stack } from 'holi-bricks/components/stack'
import { View } from 'react-native'
import { Image } from 'holi-bricks/components/image'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { LockFilled } from '@holi/icons/src/generated'
import { ChipLabel } from 'holi-bricks/components/chips'
import { Button } from 'holi-bricks/components/button'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { HoliProgressBar } from '@holi/ui/components/molecules/HoliProgressBar'
import { useTranslation } from 'react-i18next'
import HoliLottie from '@holi/ui/components/atoms/HoliLottie'
import { Platform } from 'react-native'

export const BADGE_WIDTH = 210
export const BADGE_HEIGHT = 240
const SHINING_SIZE = 293

const BadgeDetails = ({ badge, onDismiss }: { badge: Badge; onDismiss?: () => void }) => {
  const { navigate } = useRouting()
  const { t } = useTranslation()

  return (
    <Stack padding={{ top: 'xs', bottom: 'xs' }} gap="xxs">
      <Stack
        backgroundColor="support"
        padding={{ top: 'xxl', bottom: 'xxl', left: 'xs', right: 'xs' }}
        borderRadius="md"
        alignItems="center"
        gap="xl"
      >
        {/* image */}
        <Stack alignItems="center">
          {badge.state === BadgeState.achieved && (
            <View style={{ position: 'absolute', alignSelf: 'center', justifyContent: 'center', height: '100%' }}>
              <Image
                source={require('@holi/ui/assets/img/illustrations/illustration_shining.svg')}
                alt="shining illustration"
                width={SHINING_SIZE}
                height={SHINING_SIZE}
              />
            </View>
          )}

          <View style={{ position: 'relative', opacity: badge.state !== BadgeState.achieved ? 0.3 : 1 }}>
            {badge.state !== BadgeState.achieved ? (
              <Image
                source={badge.imgSrcDetailed}
                alt="badge illustration"
                width={BADGE_WIDTH}
                height={BADGE_HEIGHT}
                stretch={Platform.OS === 'web'}
                resizeMode="contain"
              />
            ) : (
              <Stack width={BADGE_WIDTH} height={BADGE_HEIGHT}>
                <HoliLottie
                  animType={badge.animationName}
                  style={{ aspectRatio: BADGE_HEIGHT / BADGE_WIDTH }}
                  loop={false}
                />
              </Stack>
            )}
          </View>
        </Stack>

        {/* description */}
        <Stack alignContent="center" gap="xs">
          <Stack alignContent="center" gap="4xs">
            <Stack direction="row" justifyContent="center" gap="4xs">
              {badge.state === BadgeState.locked && <HoliIcon icon={LockFilled} color="muted" />}
              <Text size="xxl" textAlign="center">
                {t(`badge.${badge.localazyKey}.name`)}
              </Text>
            </Stack>

            {badge.currentStep && badge.totalSteps && badge.totalSteps > 1 && badge.currentStep != badge.totalSteps ? (
              <Stack padding={{ bottom: 'xl' }} gap="3xs">
                <Stack alignItems="center">
                  <HoliProgressBar percentage={(badge.currentStep / badge.totalSteps) * 100 || 0} size="small" />
                </Stack>

                <Text size="xs" textAlign="center" color="support">
                  {t(`badge.${badge.localazyKey}.descriptionShort`, {
                    totalSteps: badge.totalSteps,
                    currentStep: badge.currentStep,
                  })}
                </Text>
              </Stack>
            ) : null}

            <Text size="md" textAlign="center">
              {badge.state === BadgeState.active || badge.state === BadgeState.locked
                ? t(`badge.${badge.localazyKey}.description.active`)
                : t(`badge.${badge.localazyKey}.description.achieved`)}
            </Text>
          </Stack>

          {badge.unlockedAt && (
            <Stack alignSelf="center">
              <ChipLabel>
                {badge.unlockedAt.toLocaleDateString('de-DE', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                })}
              </ChipLabel>
            </Stack>
          )}
        </Stack>

        {/* button */}
        {badge.state === BadgeState.active && (
          <Stack>
            <Button
              label={t(`badge.${badge.localazyKey}.button`)}
              onPress={() => {
                navigate(badge.buttonLink ?? '')
                onDismiss?.()
              }}
            />
          </Stack>
        )}
      </Stack>
    </Stack>
  )
}

export default BadgeDetails

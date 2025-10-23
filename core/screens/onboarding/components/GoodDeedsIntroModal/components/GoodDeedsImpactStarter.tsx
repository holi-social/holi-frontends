import type React from 'react'
import { useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { Stack } from 'holi-bricks/components/stack'
import { Text } from 'holi-bricks/components/text'
import { Button } from 'holi-bricks/components/button'
import { Image } from 'holi-bricks/components/image'
import HoliLottie from '@holi/ui/components/atoms/HoliLottie'
import { useSafeAreaInsets } from '@holi/core/helpers/useSafeAreaInsets'
import { useMarkBadgeAsSeenMutation } from '@holi/api/graphql/graphql-codegen'
import { ArrowRight } from '@holi/icons/src/generated'
import { useErrorHandling } from '@holi/core/errors/hooks'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'

import { GoodDeedsIntroFooterNavigation } from './GoodDeedsIntroFooterNavigation'
// eslint-disable-next-line no-restricted-imports
import { useIsDesktopView } from '../helpers/isDesktopView'
// eslint-disable-next-line no-restricted-imports
import { useUnseenImpactStarterBadge } from '../helpers/useUnseenImpactStarterBadge'

const BADGE_WIDTH = 262
const BADGE_HEIGHT = 300

type GoodDeedsImpactStarterProps = {
  onNextPress: () => void
}

export const GoodDeedsImpactStarter = ({ onNextPress }: GoodDeedsImpactStarterProps) => {
  const { t } = useTranslation()
  const isDesktopView = useIsDesktopView()
  const { bottom: safeAreaBottom } = useSafeAreaInsets()

  const { impactStarterBadge, loading } = useUnseenImpactStarterBadge()

  const { displayError } = useErrorHandling()
  const [markBadgeAsSeen] = useMarkBadgeAsSeenMutation()

  const markImpactStarterBadgeAsSeen = useCallback(async () => {
    try {
      if (impactStarterBadge?.id) {
        await markBadgeAsSeen({ variables: { unlockId: impactStarterBadge.id } })
      }
    } catch (err) {
      displayError(err, 'Failed to update badge status', { location: 'goodDeedsIntro.markImpactStarterBadgeAsSeen' })
    }
  }, [impactStarterBadge?.id, displayError, markBadgeAsSeen])

  useEffect(() => {
    // if the badge is not achieved, go to the next Good Deeds intro step
    if (!loading && !impactStarterBadge?.id) {
      onNextPress()
    } else {
      // if the badge is achieved, mark it as seen
      markImpactStarterBadgeAsSeen()
    }
  }, [loading, impactStarterBadge?.id, onNextPress, markImpactStarterBadgeAsSeen])

  if (loading || !impactStarterBadge?.id) {
    return <HoliLoader />
  }

  if (isDesktopView) {
    return (
      <Stack flex={1} maxHeight="100%" overflow="hidden" direction="row">
        <Stack
          flex={375}
          justifyContent="center"
          alignItems="center"
          borderRadius={{ topRight: 'xxl', bottomRight: 'xxl' }}
        >
          <View style={{ position: 'absolute', zIndex: 0 }}>
            <Image
              source={require('@holi/ui/assets/img/badges/illustration_shining.svg')}
              alt="shining illustration"
              width={BADGE_WIDTH * 1.4}
              height={BADGE_HEIGHT * 1.2}
            />
          </View>

          <View style={{ zIndex: 1 }}>
            <Stack width={BADGE_WIDTH} height={BADGE_HEIGHT}>
              <HoliLottie
                animType={'badgeImpactStarter'}
                loop={false}
                style={{ aspectRatio: BADGE_HEIGHT / BADGE_WIDTH }}
              />
            </Stack>
          </View>
        </Stack>

        <Stack flex={425} justifyContent="space-between">
          <Stack flex={1} justifyContent="center">
            <Stack padding={{ top: 'lg', bottom: 'lg', left: 'md', right: 'md' }} gap="xs">
              <Stack gap="3xs">
                <Text size="lg">{t('badge.modal.reward.subtitle')}</Text>

                <Text size="3xl">{t('badge.volunteering.starter.name')}</Text>
              </Stack>

              <Text>{t('badge.volunteering.starter.description.reward')}</Text>
            </Stack>
          </Stack>

          <GoodDeedsIntroFooterNavigation
            onNextPress={onNextPress}
            nextButtonLabel="onboarding.modal.goodDeed.isHero.button"
            nextButtonVariant="secondary"
            isBackButtonAvailable={false}
            backgroundColor="yellowDefault"
          />
        </Stack>
      </Stack>
    )
  }

  return (
    <Stack flex={1}>
      <Stack flex={1} justifyContent="center" alignItems="center" padding={{ left: 'md', right: 'md' }}>
        <Stack justifyContent="center" alignItems="center">
          <Stack gap="3xs" alignItems="center">
            <Text size="lg">{t('badge.modal.reward.subtitle')}</Text>

            <Text size="3xl">{t('badge.volunteering.starter.name')}</Text>
          </Stack>
        </Stack>

        <Stack maxWidth="xs" padding="xxl" justifyContent="center" alignItems="center">
          <View style={{ position: 'absolute', zIndex: 0 }}>
            <Image
              source={require('@holi/ui/assets/img/badges/illustration_shining.svg')}
              alt="shining illustration"
              width={BADGE_WIDTH * 1.4}
              height={BADGE_HEIGHT * 1.2}
            />
          </View>

          <View style={{ zIndex: 1 }}>
            <Stack width={BADGE_WIDTH} height={BADGE_HEIGHT}>
              <HoliLottie
                animType={'badgeImpactStarter'}
                loop={false}
                style={{ aspectRatio: BADGE_HEIGHT / BADGE_WIDTH }}
              />
            </Stack>
          </View>
        </Stack>

        <Text textAlign="center">{t('badge.volunteering.starter.description.reward')}</Text>
      </Stack>

      <View style={{ paddingBottom: safeAreaBottom }}>
        <Stack padding={{ top: 'xxs', bottom: 'xxs', left: 'md', right: 'md' }}>
          <Button
            loading={loading}
            label={t('onboarding.badgeReceived.button')}
            variant={'secondary'}
            size="lg"
            icon={ArrowRight}
            onPress={onNextPress}
          />
        </Stack>
      </View>
    </Stack>
  )
}

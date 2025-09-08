import type React from 'react'
import { View } from 'react-native'
import { useTranslation } from 'react-i18next'

import { Text, TextLink } from 'holi-bricks/components/text'
import { Button } from 'holi-bricks/components/button'
import { Stack } from 'holi-bricks/components/stack'
import { Image } from 'holi-bricks/components/image'
import { ChipLabel } from 'holi-bricks/components/chips'
import { Screen } from '@holi/core/components/Screen'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import type { Badge } from '@holi/core/screens/userprofile/hooks/useBadges'
import useTracking from '@holi/core/tracking/hooks/useTracking'
import { TrackingEvent } from '@holi/core/tracking'
import { createStyleSheet, useStyles } from 'holi-bricks/styles'
import { ScratchMask } from '@holi/core/screens/individualPosts/components/ScratchMask'
import { useCallback, useEffect, useState } from 'react'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { useMarkBadgeAsSeenMutation } from '@holi/api/graphql/graphql-codegen'
import { useScratchEffect } from '@holi/core/screens/individualPosts/components/helpers/useScratchEffect'
import HoliLottie from '@holi/ui/components/atoms/HoliLottie'

interface BadgeMessageProps {
  badge: Badge
  onClaim?: () => void
}

const SHINING_SIZE = 293
export const SCRATCHCARD_WIDTH = 324
export const SCRATCHCARD_HEIGHT = 300
const REVEAL_THRESHOLD = 0.7

export const BadgeMessage = ({ badge, onClaim }: BadgeMessageProps) => {
  const { t } = useTranslation()
  const { navigate } = useRouting()
  const { track } = useTracking()
  const { styles } = useStyles(stylesheet)
  const { displayError } = useErrorHandling()
  const [markBadgeAsSeen] = useMarkBadgeAsSeenMutation()
  const [revealed, setRevealed] = useState(false)
  const scratchProps = useScratchEffect()

  useEffect(() => {
    if (scratchProps.progress >= REVEAL_THRESHOLD) {
      setRevealed(true)
    }
  }, [scratchProps.progress, setRevealed])

  const handleClaim = useCallback(async () => {
    try {
      if (badge?.id) {
        await markBadgeAsSeen({ variables: { unlockId: badge.id } })
      }
      track(TrackingEvent.Rewards.badgeEarned(badge.localazyKey))
    } catch (err) {
      displayError(err, 'Failed to update badge status', { location: 'scratchEffect.handleClaim' })
    } finally {
      onClaim?.()
    }
  }, [badge, displayError, markBadgeAsSeen, onClaim, track])

  const StickyBottomComponent = () =>
    !revealed ? (
      <Stack padding={{ left: 'md', right: 'md', bottom: 'lg' }} alignItems="center" width="100%">
        <Button
          label={t('badge.modal.scratchCard.button')}
          size="lg"
          onPress={() => {
            track(TrackingEvent.Rewards.badgeRevealedButton(badge.localazyKey))
            setRevealed(true)
          }}
        />
      </Stack>
    ) : (
      <Stack padding={{ left: 'md', right: 'md', bottom: 'lg' }} alignItems="center" width="100%" gap="xs">
        <Button label={t('badge.modal.reward.button')} size="lg" onPress={handleClaim} />
        <TextLink onPress={() => navigate('/profile')} size="md">
          {t('badge.modal.reward.link')}
        </TextLink>
      </Stack>
    )

  return (
    <Screen StickyBottomComponent={<StickyBottomComponent />}>
      <Stack alignItems="center" justifyContent="center" gap="lg" padding="xl">
        {!revealed ? (
          <Stack alignItems="center" justifyContent="center">
            <Text size="3xl" textAlign="center">
              {t('badge.modal.scratchCard.title')}
            </Text>
            <Text size="lg" textAlign="center">
              {t('badge.modal.scratchCard.subtitle')}
            </Text>
          </Stack>
        ) : (
          <Stack alignItems="center" justifyContent="center">
            <Text size="lg" textAlign="center">
              {t('badge.modal.reward.subtitle')}
            </Text>
            <Text size="3xl" textAlign="center">
              {t(`badge.${badge.localazyKey}.name`)}
            </Text>
          </Stack>
        )}

        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <View style={styles.cardContainer}>
            <View style={styles.shining}>
              <Image
                source={require('@holi/ui/assets/img/illustrations/illustration_shining.svg')}
                alt="shining illustration"
                width={SHINING_SIZE}
                height={SHINING_SIZE}
              />
            </View>
            <View style={styles.badgeImage}>
              <HoliLottie
                animType={badge.animationName}
                loop={false}
                style={{ aspectRatio: 342 / 130, position: 'relative' }} // todo: to be tested visually
              />
            </View>
          </View>

          {!revealed && (
            <>
              <ScratchMask {...scratchProps} />
              <View style={styles.chipLabel}>
                <ChipLabel color="yellow" blackBorder>
                  {t('scratchCard.pill.label')}
                </ChipLabel>
              </View>
            </>
          )}
        </View>

        {/* Reward description */}
        {revealed && (
          <Stack>
            <Text size="lg" textAlign="center">
              {t(`badge.${badge.localazyKey}.description.reward`)}
            </Text>
          </Stack>
        )}
      </Stack>
    </Screen>
  )
}

const stylesheet = createStyleSheet({
  cardContainer: {
    width: SCRATCHCARD_WIDTH,
    height: SCRATCHCARD_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  shining: {
    position: 'absolute',
    zIndex: 0,
  },
  badgeImage: {
    zIndex: 1,
  },
  chipLabel: {
    zIndex: 10,
    position: 'absolute',
    bottom: -16,
    alignSelf: 'center',
  },
})

export default BadgeMessage

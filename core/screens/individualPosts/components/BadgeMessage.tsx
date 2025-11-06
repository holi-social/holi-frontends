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
import { useEffect, useState } from 'react'
import {
  SCRATCHCARD_HEIGHT,
  SCRATCHCARD_WIDTH,
  useScratchEffect,
} from '@holi/core/screens/individualPosts/components/helpers/useScratchEffect'
import HoliLottie from '@holi/ui/components/atoms/HoliLottie'
import { BADGE_HEIGHT, BADGE_WIDTH } from '@holi/core/screens/userprofile/BadgeDetails'
import { HoliTransition } from '@holi/ui/components/atoms/HoliTransition'

interface BadgeMessageProps {
  badge: Badge
  onClaim?: () => void
}

const SHINING_SIZE = 293
const REVEAL_THRESHOLD = 0.7

export const BadgeMessage = ({ badge, onClaim }: BadgeMessageProps) => {
  const { t } = useTranslation()
  const { navigate } = useRouting()
  const { track } = useTracking()
  const { styles } = useStyles(stylesheet)
  const [revealed, setRevealed] = useState(false)
  const scratchProps = useScratchEffect()

  useEffect(() => {
    if (scratchProps.progress >= REVEAL_THRESHOLD) {
      setRevealed(true)
    }
  }, [scratchProps.progress, setRevealed])

  return (
    <Screen preset="fixed" backgroundColor="support">
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
                source={require('@holi/ui/assets/img/badges/illustration_shining.svg')}
                alt="shining illustration"
                width={SHINING_SIZE}
                height={SHINING_SIZE}
              />
            </View>
            <View style={styles.badgeImage}>
              <Stack width={BADGE_WIDTH} height={BADGE_HEIGHT}>
                <HoliLottie animType={badge.animationName} style={{ aspectRatio: BADGE_HEIGHT / BADGE_WIDTH }} />
              </Stack>
            </View>
          </View>

          <HoliTransition.Fade visible={!revealed} skipInitialEnter style={{ position: 'absolute', zIndex: 10 }}>
            <ScratchMask {...scratchProps} />
          </HoliTransition.Fade>
          {!revealed && (
            <View style={styles.chipLabel}>
              <ChipLabel color="yellow" blackBorder>
                {t('scratchCard.pill.label')}
              </ChipLabel>
            </View>
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

      {!revealed ? (
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
          <Button label={t('badge.modal.reward.button')} size="lg" onPress={onClaim} />
          <TextLink
            onPress={() => {
              onClaim?.()
              navigate('/profile?tab=badges')
            }}
            size="md"
          >
            {t('badge.modal.reward.link')}
          </TextLink>
        </Stack>
      )}
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

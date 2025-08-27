import type React from 'react'
import { useState } from 'react'
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
import { useMarkBadgeAsSeenMutation } from '@holi/api/graphql/graphql-codegen'

interface BadgeMessageProps {
  badge: Badge
  onClaim?: () => void
}

const IMAGE_WIDTH = 240
const SHINING_SIZE = 293
const SCRATCHCARD_WIDTH = 324
const SCRATCHCARD_HEIGHT = 300

const BadgeMessage: React.FC<BadgeMessageProps> = ({ onClaim, badge }) => {
  const { t } = useTranslation()
  const { navigate } = useRouting()
  const [revealed, setRevealed] = useState<boolean>(false)
  const [markBadgeAsSeen] = useMarkBadgeAsSeenMutation()

  const handleClaim = () => {
    if (!badge.id) throw new Error('Badge id is required to mark it as seen')
    markBadgeAsSeen({
      variables: { unlockId: badge.id },
    })
    if (onClaim) {
      onClaim()
    }
  }

  return (
    <Screen
      StickyBottomComponent={
        !revealed ? (
          <Stack
            padding={{ left: 'md', right: 'md', bottom: 'lg' }}
            alignItems="center"
            justifyContent="center"
            alignSelf="center"
            width="100%"
          >
            <Button label={t('badge.modal.scratchCard.button')} size="lg" onPress={() => setRevealed(true)} />
          </Stack>
        ) : (
          <Stack
            padding={{ left: 'md', right: 'md', bottom: 'lg' }}
            alignItems="center"
            justifyContent="center"
            alignSelf="center"
            width="100%"
            gap="xs"
          >
            <Button label={t('badge.modal.reward.button')} size="lg" onPress={handleClaim} />
            <TextLink onPress={() => navigate('/profile')} size="md">
              {t('badge.modal.reward.link')}
            </TextLink>
          </Stack>
        )
      }
    >
      <Stack alignItems="center" justifyContent="center" gap="lg" padding="xl">
        {!revealed ? (
          <Stack alignItems="center" justifyContent="center">
            <Text size="3xl">{t('badge.modal.scratchCard.title')}</Text>
            <Text size="lg">{t('badge.modal.scratchCard.subtitle')}</Text>
          </Stack>
        ) : (
          <Stack alignItems="center" justifyContent="center">
            <Text size="lg">{t('badge.modal.reward.subtitle')}</Text>
            <Text size="3xl">{t(`badge.${badge.localazyKey}.name`)}</Text>
          </Stack>
        )}

        {/* todo: scratching effect */}
        {/* purple overlay plus confetti */}
        <Stack alignItems="center">
          {/* shining */}
          <View style={{ position: 'absolute' }}>
            <Image
              source={require('@holi/ui/assets/img/illustrations/illustration_shining.svg')}
              alt="shining illustration"
              width={SHINING_SIZE}
              height={SHINING_SIZE}
            />
          </View>

          {/* badge */}
          <View
            style={{
              position: 'relative',
              width: SCRATCHCARD_WIDTH,
              height: SCRATCHCARD_HEIGHT,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Image
              source={require('@holi/ui/assets/img/illustrations/illustration_badge_placeholder_blue.svg')}
              alt="badge illustration"
              width={IMAGE_WIDTH}
              height={IMAGE_WIDTH}
            />
          </View>

          {!revealed && (
            <View
              style={{
                position: 'absolute',
                alignSelf: 'center',
                justifyContent: 'center',
                height: SCRATCHCARD_HEIGHT,
                width: SCRATCHCARD_WIDTH,
              }}
            >
              <Image
                source={require('@holi/ui/assets/img/badges/scratch-card.svg')}
                alt="scratch card"
                width={SCRATCHCARD_WIDTH}
                height={SCRATCHCARD_HEIGHT}
              />
            </View>
          )}

          {!revealed && (
            <View
              style={{
                position: 'absolute',
                alignItems: 'center',
                bottom: -16,
              }}
            >
              <ChipLabel color="yellow" blackBorder>
                {t('scratchCard.pill.label')}
              </ChipLabel>
            </View>
          )}
        </Stack>

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

export default BadgeMessage

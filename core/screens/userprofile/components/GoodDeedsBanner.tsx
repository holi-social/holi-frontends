import React from 'react'
import { useTranslation } from 'react-i18next'
import { Linking, View } from 'react-native'

import { ArrowRight, Question } from '@holi/icons/src/generated'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { ChipLabel } from 'holi-bricks/components/chips'
import { Image } from 'holi-bricks/components/image'
import { Stack } from 'holi-bricks/components/stack'
import { Text, TextLink } from 'holi-bricks/components/text'
import { createStyleSheet, useStyles } from 'holi-bricks/styles'
import type { DecorativeColors } from 'holi-bricks/foundations/colors/themes/types'
import { Button } from 'holi-bricks/components/button'
import useRouting from '@holi/core/navigation/hooks/useRouting'

type GoodDeedsBannerProps = {
  counter: number
  hashtag?: {
    position?: 'top' | 'bottom'
    backgroundColor?: DecorativeColors
  }
  variant?: 'informative' | 'action'
}

const HashtagBar = ({
  position = 'bottom',
  backgroundColor = 'yellowDefault',
}: GoodDeedsBannerProps['hashtag'] = {}) => {
  const { t } = useTranslation()

  return (
    <Stack
      backgroundColor={backgroundColor}
      alignContent="center"
      justifyContent="center"
      padding={{ top: '5xs', bottom: '5xs', left: '3xs', right: '3xs' }}
      onPress={() => Linking.openURL('https://holi.social/1million')}
      testID={`good-deeds-banner__hashtag-bar--${position}`}
    >
      <Stack direction="row" justifyContent="center" gap="4xs">
        <Stack justifyContent="center" alignItems="center">
          <TextLink size="sm" textAlign="center">
            {t('oneMioGoodDeeds.hashtag')}
          </TextLink>
        </Stack>
        <HoliIcon icon={Question} />
      </Stack>
    </Stack>
  )
}

export const GoodDeedsBanner = ({
  counter,
  hashtag: { position: hashtagPosition = 'bottom', backgroundColor: hashtagBackgroundColor = 'yellowDefault' } = {},
  variant = 'informative',
}: GoodDeedsBannerProps) => {
  const { t } = useTranslation()
  const { styles } = useStyles(stylesheet)
  const { navigate } = useRouting()

  return (
    <Stack borderRadius="md" overflow="hidden" testID="good-deeds-banner">
      {hashtagPosition === 'top' && <HashtagBar position={hashtagPosition} backgroundColor={hashtagBackgroundColor} />}

      <Stack overflow="hidden" height={205} alignSelf="stretch">
        <View style={styles.container}>
          {/* Background image */}
          <Image
            source={require('@holi/ui/assets/img/goodDeeds/campaignGradient.jpg')}
            height={0}
            width={0}
            stretch
            alt={t('oneMioGoodDeeds.hashtag')}
          />

          {/* Overlay */}
          <View style={styles.overlay}>
            {variant === 'informative' && (
              <Stack>
                {/* Middle element */}
                <Stack
                  backgroundColor="white"
                  borderRadius="md"
                  borderColor="main"
                  borderStyle="solid"
                  borderWidth="sm"
                  width={250}
                  height={100}
                  alignItems="center"
                  justifyContent="center"
                  padding={{ top: '3xs', bottom: '3xs', left: 'xs', right: 'xs' }}
                >
                  <Text size="4xl" color="main">
                    {counter.toLocaleString('de-DE')}
                  </Text>
                  <Text size="xs" color="support">
                    {t('oneMioGoodDeeds.banner.globalCounter.label')}
                  </Text>
                </Stack>

                <View style={styles.topLeft}>
                  <ChipLabel color="yellow" blackBorder>
                    {t('oneMioGoodDeeds.banner.globalCounter.pill.top')}
                  </ChipLabel>
                </View>

                <View style={styles.bottomRight}>
                  <ChipLabel color="yellow" blackBorder>
                    {t('oneMioGoodDeeds.banner.globalCounter.pill.bottom')}
                  </ChipLabel>
                </View>
              </Stack>
            )}

            {variant === 'action' && (
              <Stack>
                <Stack
                  backgroundColor="white"
                  borderRadius="md"
                  borderColor="greyLight"
                  borderStyle="solid"
                  borderWidth="sm"
                  width={250}
                  height={100}
                  alignItems="center"
                  justifyContent="center"
                  padding={{ top: '3xs', bottom: 'lg', left: 'xs', right: 'xs' }}
                  margin={{ bottom: 'sm' }}
                >
                  <Text size="4xl" color="main">
                    {counter.toLocaleString('de-DE')}
                  </Text>

                  <Text size="xs" color="support">
                    {t('feed.banner.globalCounter.label')}
                  </Text>

                  <View style={{ position: 'absolute', bottom: -22 }}>
                    <Button
                      label={t('feed.banner.globalCounter.button')}
                      icon={ArrowRight}
                      onPress={() => navigate('/act')}
                    />
                  </View>
                </Stack>
              </Stack>
            )}
          </View>
        </View>
      </Stack>

      {hashtagPosition === 'bottom' && (
        <HashtagBar position={hashtagPosition} backgroundColor={hashtagBackgroundColor} />
      )}
    </Stack>
  )
}

const stylesheet = createStyleSheet(() => ({
  container: {
    flex: 1,
    position: 'relative',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topLeft: {
    position: 'absolute',
    top: -15,
    left: -40,
    zIndex: 1,
  },
  bottomRight: {
    position: 'absolute',
    bottom: -25,
    right: -22,
    zIndex: 1,
  },
}))

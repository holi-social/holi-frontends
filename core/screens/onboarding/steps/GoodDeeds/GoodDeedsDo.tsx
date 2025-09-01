import React, { useState } from 'react'
import { Platform, useWindowDimensions } from 'react-native'

import { Stack } from 'holi-bricks/components/stack'
import { Text } from 'holi-bricks/components/text'
import { Trans, useTranslation } from 'react-i18next'
import { HoliFigmaSpanPlaceholder } from '@holi/ui/components/atoms/HoliFigmaSpanPlaceholder'
import { useSafeAreaInsets } from '@holi/core/helpers/useSafeAreaInsets'
import { View } from 'react-native'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { GoodDeedsCards, HoliHeroFind } from '@holi/icons/src/generated'
import { WrapperComponent } from './WrapperComponent'
import { breakpoints } from 'holi-bricks/foundations/dimensions/breakpoints'

const isWeb = Platform.OS === 'web'
const GOOD_DEEDS_CARD_ASPECT_RATIO = 353 / 258

export const GoodDeedsDo = () => {
  const { t } = useTranslation()
  const { top: safeAreaTop } = useSafeAreaInsets()
  const { width } = useWindowDimensions()
  const isDesktop = width >= breakpoints.md

  const [goodDeedsCardHeight, setGoodDeedsCardHeight] = useState(0)
  const [heroFindHeight, setHeroFindHeight] = useState(0)

  return (
    <Stack backgroundColor="yellowDefault" flex={1} maxHeight="100%" overflow={isWeb ? 'hidden' : 'visible'}>
      <Stack flex={1}>
        <WrapperComponent>
          <View style={{ paddingTop: safeAreaTop }}>
            <Stack gap="3xs" padding={{ top: 'lg', bottom: 'lg', left: 'md', right: 'md' }}>
              <Text size="3xl">{t('onboarding.modal.step02.title')}</Text>

              <Text size="md">{t('onboarding.modal.step02.text')}</Text>

              <Text size="md">
                <Trans
                  t={t}
                  i18nKey="onboarding.modal.step02.text02"
                  components={{
                    b: <Text size="md" bold />,
                    i: <Text size="md" italic />,
                    span: <HoliFigmaSpanPlaceholder />,
                  }}
                />
              </Text>
            </Stack>
          </View>

          <Stack flex={1} direction={isDesktop ? 'row' : 'column'}>
            <Stack
              alignItems="center"
              flex={5}
              onLayout={(event) =>
                setGoodDeedsCardHeight(
                  event.nativeEvent.layout.height > event.nativeEvent.layout.width
                    ? event.nativeEvent.layout.width / GOOD_DEEDS_CARD_ASPECT_RATIO
                    : event.nativeEvent.layout.height
                )
              }
            >
              <HoliIcon
                icon={GoodDeedsCards}
                size={{
                  width: goodDeedsCardHeight * GOOD_DEEDS_CARD_ASPECT_RATIO,
                  height: goodDeedsCardHeight,
                }}
                style={{
                  position: 'absolute',
                }}
              />
            </Stack>

            <Stack
              flex={4}
              onLayout={(event) =>
                setHeroFindHeight(
                  event.nativeEvent.layout.height > event.nativeEvent.layout.width
                    ? event.nativeEvent.layout.width / GOOD_DEEDS_CARD_ASPECT_RATIO
                    : event.nativeEvent.layout.height
                )
              }
            >
              <HoliIcon
                icon={HoliHeroFind}
                size={{
                  width: heroFindHeight * (isDesktop ? 2 : 1.6) * GOOD_DEEDS_CARD_ASPECT_RATIO,
                  height: heroFindHeight * (isDesktop ? 2 : 1.6),
                }}
                style={
                  isDesktop
                    ? {
                        position: 'absolute',
                        bottom: '-25%',
                        right: '-50%',
                      }
                    : {
                        position: 'absolute',
                        top: 0,
                        left: 0,
                      }
                }
              />
            </Stack>
          </Stack>
        </WrapperComponent>
      </Stack>
    </Stack>
  )
}

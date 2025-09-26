import React, { useState } from 'react'
import { Platform } from 'react-native'
import { Trans, useTranslation } from 'react-i18next'

import { Stack } from 'holi-bricks/components/stack'
import { Text } from 'holi-bricks/components/text'
import { HoliFigmaSpanPlaceholder } from '@holi/ui/components/atoms/HoliFigmaSpanPlaceholder'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'

const isWeb = Platform.OS === 'web'
const GOOD_DEEDS_CARD_ASPECT_RATIO = 353 / 258

export const GoodDeedsDoMobile = () => {
  const { t } = useTranslation()

  const [goodDeedsCardHeight, setGoodDeedsCardHeight] = useState(0)
  const [heroFindHeight, setHeroFindHeight] = useState(0)

  return (
    <Stack backgroundColor="yellowDefault" flex={1} maxHeight="100%" overflow={isWeb ? 'hidden' : 'visible'}>
      <Stack flex={1}>
        <Stack gap="3xs" padding={{ top: 'lg', bottom: 'lg', left: 'md', right: 'md' }}>
          <Text size="3xl">{t('onboarding.modal.step02.title')}</Text>

          <Text>{t('onboarding.modal.step02.text')}</Text>

          <Text>
            <Trans
              t={t}
              i18nKey="onboarding.modal.step02.text02"
              components={{
                b: <Text bold />,
                i: <Text italic />,
                span: <HoliFigmaSpanPlaceholder />,
              }}
            />
          </Text>
        </Stack>

        <Stack flex={1}>
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
            <HoliLocalImage
              imageSource={require('@holi/ui/assets/img/goodDeeds/good-deeds-cards.png')}
              width={goodDeedsCardHeight * GOOD_DEEDS_CARD_ASPECT_RATIO}
              height={goodDeedsCardHeight}
              label={t('navigation.title')}
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
            <HoliLocalImage
              imageSource={require('@holi/ui/assets/img/goodDeeds/holi-hero-find.svg')}
              isSvg
              width={heroFindHeight}
              height={heroFindHeight * GOOD_DEEDS_CARD_ASPECT_RATIO}
              label={t('navigation.title')}
              style={{
                position: 'absolute',
                right: 0,
              }}
            />
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  )
}

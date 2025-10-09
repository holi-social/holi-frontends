import React, { useState } from 'react'
import { Platform, View } from 'react-native'
import { Trans, useTranslation } from 'react-i18next'

import { Stack } from 'holi-bricks/components/stack'
import { Text } from 'holi-bricks/components/text'
import { Image } from 'holi-bricks/components/image'
import { HoliFigmaSpanPlaceholder } from '@holi/ui/components/atoms/HoliFigmaSpanPlaceholder'

import { GoodDeedsIntroFooterNavigation } from './GoodDeedsIntroFooterNavigation'
// eslint-disable-next-line no-restricted-imports
import { useIsDesktopView } from '../helpers/isDesktopView'

const isWeb = Platform.OS === 'web'
const GOOD_DEEDS_CARD_ASPECT_RATIO = 353 / 258

type GoodDeedsDoProps = {
  onNextPress: () => void
  onBackPress: () => void
}

export const GoodDeedsDo = ({ onNextPress, onBackPress }: GoodDeedsDoProps) => {
  const { t } = useTranslation()
  const isDesktopView = useIsDesktopView()

  const [goodDeedsCardDimension, setGoodDeedsCardDimension] = useState(0)
  const [heroFindDimension, setHeroFindDimension] = useState(0)

  const textContent = (
    <>
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
    </>
  )

  if (isDesktopView) {
    return (
      <Stack flex={1} maxHeight="100%" overflow="hidden" direction="row">
        <Stack
          flex={353}
          padding={{ top: 'xxs' }}
          borderRadius={{ topRight: 'xxl', bottomRight: 'xxl' }}
          backgroundColor="yellowDefault"
        >
          <Stack
            alignItems="center"
            flex={5}
            onLayout={(event) => setGoodDeedsCardDimension(event.nativeEvent.layout.width - 48)}
          >
            <Image
              source={require('@holi/ui/assets/img/goodDeeds/good-deeds-cards.svg')}
              width={goodDeedsCardDimension}
              height={goodDeedsCardDimension / GOOD_DEEDS_CARD_ASPECT_RATIO}
              alt={t('navigation.title')}
            />
          </Stack>

          <Stack flex={4} onLayout={(event) => setHeroFindDimension(event.nativeEvent.layout.height)}>
            <View style={{ position: 'absolute', right: 24 }}>
              <Image
                source={require('@holi/ui/assets/img/goodDeeds/holi-hero-find.svg')}
                width={heroFindDimension}
                height={heroFindDimension * GOOD_DEEDS_CARD_ASPECT_RATIO}
                alt={t('navigation.title')}
              />
            </View>
          </Stack>
        </Stack>

        <Stack flex={447} justifyContent="space-between" backgroundColor="white">
          <Stack gap="3xs" padding={{ left: 'md', right: 'md' }}>
            <Stack padding={{ top: 'lg', bottom: 'lg' }}>{textContent}</Stack>
          </Stack>

          <Stack padding={{ right: 'md' }}>
            <GoodDeedsIntroFooterNavigation
              isBackButtonAvailable
              nextButtonLabel="onboarding.modal.step02.buttonPrimary"
              onNextPress={onNextPress}
              onBackPress={onBackPress}
            />
          </Stack>
        </Stack>
      </Stack>
    )
  }

  return (
    <Stack backgroundColor="yellowDefault" flex={1} maxHeight="100%" overflow={isWeb ? 'hidden' : 'visible'}>
      <Stack flex={1}>
        <Stack gap="3xs" padding={{ top: 'lg', bottom: 'lg', left: 'md', right: 'md' }}>
          {textContent}
        </Stack>

        <Stack flex={1}>
          <Stack
            alignItems="center"
            flex={5}
            onLayout={(event) =>
              setGoodDeedsCardDimension(
                event.nativeEvent.layout.height > event.nativeEvent.layout.width
                  ? event.nativeEvent.layout.width / GOOD_DEEDS_CARD_ASPECT_RATIO
                  : event.nativeEvent.layout.height
              )
            }
          >
            <View style={{ position: 'absolute' }}>
              <Image
                source={require('@holi/ui/assets/img/goodDeeds/good-deeds-cards.png')}
                width={goodDeedsCardDimension * GOOD_DEEDS_CARD_ASPECT_RATIO}
                height={goodDeedsCardDimension}
                alt={t('navigation.title')}
              />
            </View>
          </Stack>

          <Stack
            flex={4}
            onLayout={(event) =>
              setHeroFindDimension(
                event.nativeEvent.layout.height > event.nativeEvent.layout.width
                  ? event.nativeEvent.layout.width / GOOD_DEEDS_CARD_ASPECT_RATIO
                  : event.nativeEvent.layout.height
              )
            }
          >
            <View style={{ position: 'absolute', right: 0 }}>
              <Image
                source={require('@holi/ui/assets/img/goodDeeds/holi-hero-find.svg')}
                width={heroFindDimension}
                height={heroFindDimension * GOOD_DEEDS_CARD_ASPECT_RATIO}
                alt={t('navigation.title')}
              />
            </View>
          </Stack>
        </Stack>
      </Stack>

      <GoodDeedsIntroFooterNavigation
        isBackButtonAvailable
        nextButtonLabel="onboarding.modal.step02.buttonPrimary"
        onNextPress={onNextPress}
        onBackPress={onBackPress}
      />
    </Stack>
  )
}

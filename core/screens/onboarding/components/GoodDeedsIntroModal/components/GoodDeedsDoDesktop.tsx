import React, { useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'

import { Stack } from 'holi-bricks/components/stack'
import { Text } from 'holi-bricks/components/text'
import { HoliFigmaSpanPlaceholder } from '@holi/ui/components/atoms/HoliFigmaSpanPlaceholder'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import type { NavigationButtonsProps } from '@holi/ui/components/organisms/HoliStepperV2/NavigationButtons'

import { GoodDeedsIntroFooterNavigation } from './GoodDeedsIntroFooterNavigation'

const GOOD_DEEDS_CARD_ASPECT_RATIO = 353 / 258

type GoodDeedsDoDesktopProps = Pick<NavigationButtonsProps, 'onNextPress' | 'onBackPress'>

export const GoodDeedsDoDesktop = ({ onNextPress, onBackPress }: GoodDeedsDoDesktopProps) => {
  const { t } = useTranslation()

  const [goodDeedsCardWidth, setGoodDeedsCardWidth] = useState(0)
  const [heroFindWidth, setHeroFindWidth] = useState(0)

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
          onLayout={(event) => setGoodDeedsCardWidth(event.nativeEvent.layout.width - 48)}
        >
          <HoliLocalImage
            imageSource={require('@holi/ui/assets/img/goodDeeds/good-deeds-cards.svg')}
            isSvg
            width={goodDeedsCardWidth}
            height={goodDeedsCardWidth / GOOD_DEEDS_CARD_ASPECT_RATIO}
            label={t('navigation.title')}
            style={{
              position: 'absolute',
            }}
          />
        </Stack>

        <Stack flex={4} onLayout={(event) => setHeroFindWidth(event.nativeEvent.layout.height)}>
          <HoliLocalImage
            imageSource={require('@holi/ui/assets/img/goodDeeds/holi-hero-find.svg')}
            isSvg
            width={heroFindWidth}
            height={heroFindWidth * GOOD_DEEDS_CARD_ASPECT_RATIO}
            label={t('navigation.title')}
            style={{
              position: 'absolute',
              right: 24,
            }}
          />
        </Stack>
      </Stack>

      <Stack flex={447} justifyContent="space-between">
        <Stack gap="3xs" padding={{ left: 'md', right: 'md' }}>
          <Stack padding={{ top: 'lg', bottom: 'lg' }}>
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

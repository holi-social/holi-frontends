import type React from 'react'
import { useState } from 'react'
import { View } from 'react-native'
import { useTranslation } from 'react-i18next'

import { Stack } from 'holi-bricks/components/stack'
import { Image } from 'holi-bricks/components/image'
import { Text } from 'holi-bricks/components/text'
import { breakpoints } from 'holi-bricks/foundations'
import { useSafeAreaInsets } from '@holi/core/helpers/useSafeAreaInsets'

import { GoodDeedsIntroFooterNavigation } from './GoodDeedsIntroFooterNavigation'
// eslint-disable-next-line no-restricted-imports
import { useIsDesktopView } from '../helpers/isDesktopView'

const SVG_ASPECT_RATIO = 351 / 393

type GoodDeedsProgressExplanationProps = {
  onNextPress: () => void
  onBackPress: () => void
}

export const GoodDeedsProgressExplanation = ({ onNextPress, onBackPress }: GoodDeedsProgressExplanationProps) => {
  const { t } = useTranslation()
  const { top: safeAreaTop } = useSafeAreaInsets()
  const isDesktopView = useIsDesktopView()

  const [heroExplanaitonHeight, setHeroExplanaitonHeight] = useState(0)

  // resusable elements
  const textContent = (
    <Stack padding={{ top: 'lg', bottom: 'lg', left: 'md', right: 'md' }} gap="xs">
      <Text size="3xl">{t('onboarding.modal.goodDeed.progressExplanation.title')}</Text>

      <Text>{t('onboarding.modal.goodDeed.progressExplanation.text01')}</Text>
    </Stack>
  )

  const navigation = (
    <GoodDeedsIntroFooterNavigation
      isBackButtonAvailable
      onBackPress={onBackPress}
      onNextPress={onNextPress}
      nextButtonLabel="onboarding.modal.goodDeedTracked.step02.button"
    />
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
          <View
            style={{
              paddingTop: safeAreaTop,
              flex: 1,
              justifyContent: 'center',
            }}
            onLayout={(event) => setHeroExplanaitonHeight(event.nativeEvent.layout.width)}
          >
            <Image
              source={require('@holi/ui/assets/img/goodDeeds/holi-hero-explanation.svg')}
              width={heroExplanaitonHeight * SVG_ASPECT_RATIO}
              height={heroExplanaitonHeight}
              alt={t('navigation.title')}
            />
          </View>
        </Stack>

        <Stack flex={447} justifyContent="space-between" backgroundColor="white">
          {textContent}
          {navigation}
        </Stack>
      </Stack>
    )
  }

  return (
    <Stack justifyContent="space-between" flex={1} backgroundColor="yellowDefault">
      <Stack justifyContent="space-between">{textContent}</Stack>

      <Stack flex={1} backgroundColor="yellowDefault" borderRadius={{ bottomLeft: 'xxl', bottomRight: 'xxl' }}>
        <View
          style={{
            flex: 1,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
          onLayout={(event) => setHeroExplanaitonHeight(Math.min(event.nativeEvent.layout.width, breakpoints.sm) - 24)}
        >
          <Image
            source={require('@holi/ui/assets/img/goodDeeds/holi-hero-explanation.svg')}
            width={heroExplanaitonHeight}
            height={heroExplanaitonHeight / SVG_ASPECT_RATIO}
            alt={t('navigation.title')}
          />
        </View>
      </Stack>

      {navigation}
    </Stack>
  )
}

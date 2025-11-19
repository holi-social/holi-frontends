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

const SVG_ASPECT_RATIO = 376 / 409

type GoodDeedsYouAreHeroProps = {
  onNextPress: () => void
}

export const GoodDeedsYouAreHero = ({ onNextPress }: GoodDeedsYouAreHeroProps) => {
  const { t } = useTranslation()
  const { top: safeAreaTop } = useSafeAreaInsets()
  const isDesktopView = useIsDesktopView()

  const [heroBecomeHeight, setHeroBecomeHeight] = useState(0)

  return (
    <Stack justifyContent="space-between" flex={1} backgroundColor="white" direction={isDesktopView ? 'row' : 'column'}>
      <Stack
        backgroundColor="yellowDefault"
        // padding={{ bottom: 'sm' }}
        borderRadius={
          isDesktopView ? { topRight: 'xxl', bottomRight: 'xxl' } : { bottomLeft: 'xxl', bottomRight: 'xxl' }
        }
        flex={isDesktopView ? 353 : undefined}
      >
        <View
          style={{ paddingTop: safeAreaTop, flex: 1, alignItems: 'flex-start', justifyContent: 'flex-end' }}
          onLayout={(event) =>
            setHeroBecomeHeight(
              Math.min(
                isDesktopView
                  ? Math.min(event.nativeEvent.layout.height, event.nativeEvent.layout.width)
                  : event.nativeEvent.layout.width,
                breakpoints.xs
              )
            )
          }
        >
          <Image
            source={require('@holi/ui/assets/img/goodDeeds/holi-hero-you-are.svg')}
            width={heroBecomeHeight}
            height={heroBecomeHeight / SVG_ASPECT_RATIO}
            alt={t('navigation.title')}
          />
        </View>
      </Stack>

      <Stack flex={isDesktopView ? 447 : 1} justifyContent="space-between">
        <Stack gap="3xs" padding={{ top: 'lg', bottom: 'lg', left: 'md', right: 'md' }}>
          <Text size="3xl">{t('onboarding.modal.goodDeed.isHero.title')}</Text>
          <Text>{t('onboarding.modal.goodDeed.isHero.text')}</Text>
        </Stack>

        <GoodDeedsIntroFooterNavigation
          isBackButtonAvailable={false}
          nextButtonLabel="onboarding.modal.goodDeed.isHero.button"
          onNextPress={onNextPress}
        />
      </Stack>
    </Stack>
  )
}

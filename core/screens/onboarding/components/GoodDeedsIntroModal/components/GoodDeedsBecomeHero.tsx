import type React from 'react'
import { useState } from 'react'
import { View } from 'react-native'
import { Trans, useTranslation } from 'react-i18next'

import { Stack } from 'holi-bricks/components/stack'
import { Image } from 'holi-bricks/components/image'
import { Text } from 'holi-bricks/components/text'
import { breakpoints } from 'holi-bricks/foundations'
import { useSafeAreaInsets } from '@holi/core/helpers/useSafeAreaInsets'
import { HoliFigmaSpanPlaceholder } from '@holi/ui/components/atoms/HoliFigmaSpanPlaceholder'

import { GoodDeedsIntroFooterNavigation } from './GoodDeedsIntroFooterNavigation'
// eslint-disable-next-line no-restricted-imports
import { useIsDesktopView } from '../helpers/isDesktopView'
// eslint-disable-next-line no-restricted-imports
import type { IntroFlowType } from '../helpers/useGoodDeedsIntroModalState'

type GoodDeedsBecomeHeroProps = {
  type: IntroFlowType
  onNextPress: () => void
}

export const GoodDeedsBecomeHero = ({ type, onNextPress }: GoodDeedsBecomeHeroProps) => {
  const { t } = useTranslation()
  const { top: safeAreaTop } = useSafeAreaInsets()
  const isDesktopView = useIsDesktopView()

  const [heroBecomeHeight, setHeroBecomeHeight] = useState(0)

  return (
    <Stack justifyContent="space-between" flex={1} backgroundColor="white" direction={isDesktopView ? 'row' : 'column'}>
      <Stack
        backgroundColor="yellowDefault"
        padding={{ bottom: 'sm' }}
        borderRadius={
          isDesktopView ? { topRight: 'xxl', bottomRight: 'xxl' } : { bottomLeft: 'xxl', bottomRight: 'xxl' }
        }
        flex={isDesktopView ? 353 : undefined}
      >
        <View
          style={{ paddingTop: safeAreaTop, flex: 1, alignItems: 'center', justifyContent: 'center' }}
          onLayout={(event) =>
            setHeroBecomeHeight(
              Math.min(
                isDesktopView
                  ? Math.min(event.nativeEvent.layout.height, event.nativeEvent.layout.width) * 0.9
                  : event.nativeEvent.layout.width - 24,
                breakpoints.sm - 24
              )
            )
          }
        >
          <Image
            source={require('@holi/ui/assets/img/goodDeeds/holi-hero-become.svg')}
            width={heroBecomeHeight}
            height={heroBecomeHeight}
            alt={t('navigation.title')}
          />
        </View>
      </Stack>

      <Stack flex={isDesktopView ? 447 : undefined} justifyContent="space-between">
        <Stack gap="3xs" padding={{ top: 'lg', bottom: 'lg', left: 'md', right: 'md' }}>
          <Text size="3xl">
            <Trans
              t={t}
              i18nKey="onboarding.modal.step01.title"
              components={{
                i: <Text size="3xl" italic />,
                span: <HoliFigmaSpanPlaceholder />,
              }}
            />
          </Text>

          {type === 'onboarding' ? (
            <>
              <Text>{t('onboarding.modal.step01.text')}</Text>
              <Text>
                <Trans
                  t={t}
                  i18nKey="onboarding.modal.step01.text02"
                  components={{
                    i: <Text italic />,
                    span: <HoliFigmaSpanPlaceholder />,
                  }}
                />
              </Text>
            </>
          ) : (
            <Text>{t('onboarding.modal.goodDeed.becomeHero.favorited.text')}</Text>
          )}
        </Stack>

        <GoodDeedsIntroFooterNavigation
          isBackButtonAvailable={false}
          nextButtonLabel="onboarding.modal.step01.buttonPrimary"
          onNextPress={onNextPress}
        />
      </Stack>
    </Stack>
  )
}

import type React from 'react'
import { useState } from 'react'
import { View } from 'react-native'
import { Trans, useTranslation } from 'react-i18next'

import { Stack } from 'holi-bricks/components/stack'
import { Image } from 'holi-bricks/components/image'
import { Text } from 'holi-bricks/components/text'
import { useSafeAreaInsets } from '@holi/core/helpers/useSafeAreaInsets'
import { HoliFigmaSpanPlaceholder } from '@holi/ui/components/atoms/HoliFigmaSpanPlaceholder'
import type { NavigationButtonsProps } from '@holi/ui/components/organisms/HoliStepperV2/NavigationButtons'

import { GoodDeedsIntroFooterNavigation } from './GoodDeedsIntroFooterNavigation'

type GoodDeedsExplainDesktopProps = Pick<NavigationButtonsProps, 'onNextPress'>

export const GoodDeedsExplainDesktop = ({ onNextPress }: GoodDeedsExplainDesktopProps) => {
  const { t } = useTranslation()
  const { top: safeAreaTop } = useSafeAreaInsets()

  const [heroBecomeHeight, setHeroBecomeHeight] = useState(0)

  return (
    <Stack justifyContent="space-between" flex={1} backgroundColor="white" direction="row">
      <Stack
        backgroundColor="yellowDefault"
        padding={{ bottom: 'sm' }}
        borderRadius={{ topRight: 'xxl', bottomRight: 'xxl' }}
        flex={353}
      >
        <View
          style={{ paddingTop: safeAreaTop, flex: 1, alignItems: 'center', justifyContent: 'center' }}
          onLayout={(event) =>
            setHeroBecomeHeight(Math.min(event.nativeEvent.layout.height, event.nativeEvent.layout.width) * 0.9)
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

      <Stack flex={447} justifyContent="space-between">
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
        </Stack>

        <Stack padding={{ right: 'md' }}>
          <GoodDeedsIntroFooterNavigation
            isBackButtonAvailable={false}
            nextButtonLabel="onboarding.modal.step01.buttonPrimary"
            onNextPress={onNextPress}
          />
        </Stack>
      </Stack>
    </Stack>
  )
}

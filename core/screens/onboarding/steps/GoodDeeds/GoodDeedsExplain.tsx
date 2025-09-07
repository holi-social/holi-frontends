import type React from 'react'
import { useState } from 'react'
import { Platform, View } from 'react-native'

import { useSafeAreaInsets } from '@holi/core/helpers/useSafeAreaInsets'
import { Stack } from 'holi-bricks/components/stack'
import { Text } from 'holi-bricks/components/text'
import { Trans, useTranslation } from 'react-i18next'
import { HoliFigmaSpanPlaceholder } from '@holi/ui/components/atoms/HoliFigmaSpanPlaceholder'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { HoliHeroBecome } from '@holi/icons/src/generated'
import { WrapperComponent } from './WrapperComponent'

const isWeb = Platform.OS === 'web'

export const GoodDeedsExplain = () => {
  const { t } = useTranslation()
  const { top: safeAreaTop } = useSafeAreaInsets()

  const [heroBecomeHeight, setHeroBecomeHeight] = useState(0)

  return (
    <Stack justifyContent="space-between" flex={1} backgroundColor="white">
      <Stack
        backgroundColor="yellowDefault"
        padding={{ bottom: 'sm' }}
        borderRadius={isWeb ? { bottomLeft: 'xxl', bottomRight: 'xxl' } : 'xxl'}
        flex={5}
      >
        <WrapperComponent>
          <View
            style={{ paddingTop: safeAreaTop, flex: 1, alignItems: 'center' }}
            onLayout={(event) =>
              setHeroBecomeHeight(Math.min(event.nativeEvent.layout.height, event.nativeEvent.layout.width))
            }
          >
            <HoliIcon icon={HoliHeroBecome} size={heroBecomeHeight} />
          </View>
        </WrapperComponent>
      </Stack>

      <Stack
        gap="3xs"
        padding={isWeb ? { top: 'lg', bottom: 'lg' } : { top: 'lg', bottom: 'lg', left: 'md', right: 'md' }}
        flex={3}
      >
        <WrapperComponent>
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

          <Text size="md">{t('onboarding.modal.step01.text')}</Text>

          <Text size="md">
            <Trans
              t={t}
              i18nKey="onboarding.modal.step01.text02"
              components={{
                i: <Text size="md" italic />,
                span: <HoliFigmaSpanPlaceholder />,
              }}
            />
          </Text>
        </WrapperComponent>
      </Stack>
    </Stack>
  )
}

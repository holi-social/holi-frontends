import React from 'react'
import { useWindowDimensions, View } from 'react-native'

import { useSafeAreaInsets } from '@holi/core/helpers/useSafeAreaInsets'
import { Stack } from 'holi-bricks/components/stack'
import { Text } from 'holi-bricks/components/text'
import { Trans, useTranslation } from 'react-i18next'
import { HoliFigmaSpanPlaceholder } from '@holi/ui/components/atoms/HoliFigmaSpanPlaceholder'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { HoliHeroBecome } from '@holi/icons/src/generated'

export const GoodDeedsExplain = () => {
  const { t } = useTranslation()
  const { width } = useWindowDimensions()
  const { top: safeAreaTop } = useSafeAreaInsets()

  return (
    <Stack justifyContent="space-between" flex={1} backgroundColor="white">
      <Stack backgroundColor="yellowDefault" padding={{ bottom: 'sm' }} borderRadius="xxl">
        <View style={{ paddingTop: safeAreaTop }}>
          <HoliIcon icon={HoliHeroBecome} size={width} />
        </View>
      </Stack>

      <Stack gap="3xs" padding={{ top: 'lg', bottom: 'lg', left: 'md', right: 'md' }} flex={1}>
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
      </Stack>
    </Stack>
  )
}

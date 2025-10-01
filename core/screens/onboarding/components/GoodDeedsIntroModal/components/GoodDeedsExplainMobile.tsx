import type React from 'react'
import { useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'

import { Stack } from 'holi-bricks/components/stack'
import { Text } from 'holi-bricks/components/text'
import { Image } from 'holi-bricks/components/image'
import { HoliFigmaSpanPlaceholder } from '@holi/ui/components/atoms/HoliFigmaSpanPlaceholder'

export const GoodDeedsExplainMobile = () => {
  const { t } = useTranslation()

  const [heroBecomeHeight, setHeroBecomeHeight] = useState(0)

  return (
    <Stack justifyContent="space-between" flex={1} backgroundColor="white">
      <Stack
        backgroundColor="yellowDefault"
        padding={{ bottom: 'sm' }}
        borderRadius={{ bottomLeft: 'xxl', bottomRight: 'xxl' }}
      >
        <Stack
          flex={1}
          alignItems="center"
          onLayout={(event) => setHeroBecomeHeight(event.nativeEvent.layout.width - 24)}
        >
          <Image
            source={require('@holi/ui/assets/img/goodDeeds/holi-hero-become.svg')}
            width={heroBecomeHeight}
            height={heroBecomeHeight}
            alt={t('navigation.title')}
          />
        </Stack>
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
    </Stack>
  )
}

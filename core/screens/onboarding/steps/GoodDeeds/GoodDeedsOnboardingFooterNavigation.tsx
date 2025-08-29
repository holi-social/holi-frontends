import React from 'react'

import { Stack } from 'holi-bricks/components/stack'
import { useTranslation } from 'react-i18next'
import { useSafeAreaInsets } from '@holi/core/helpers/useSafeAreaInsets'
import { View } from 'react-native'
import { ArrowRight, ArrowLeft } from '@holi/icons/src/generated'
import { Button, ButtonIcon } from 'holi-bricks/components/button'
import type { NavigationButtonsProps } from '@holi/ui/components/organisms/HoliStepperV2/NavigationButtons'

type Props = Pick<NavigationButtonsProps, 'onNextPress' | 'onBackPress' | 'isBackButtonAvailable' | 'nextButtonLabel'>

export const GoodDeedsExplanationFooterNavigation = ({
  onNextPress,
  onBackPress,
  isBackButtonAvailable = true,
  nextButtonLabel = '',
}: Props) => {
  const { t } = useTranslation()
  const { bottom: safeAreaBottom } = useSafeAreaInsets()

  return (
    <Stack backgroundColor="white" padding="xxs" borderRadius={{ topLeft: 'xxl', topRight: 'xxl' }} flex={0}>
      <View style={{ paddingBottom: safeAreaBottom }}>
        <Stack direction="row" justifyContent="space-between">
          <Stack>
            {isBackButtonAvailable && (
              <ButtonIcon icon={ArrowLeft} label={''} size="lg" variant="secondary" onPress={onBackPress} />
            )}
          </Stack>

          <Stack>
            <Button label={t(nextButtonLabel) ?? nextButtonLabel} size="lg" icon={ArrowRight} onPress={onNextPress} />
          </Stack>
        </Stack>
      </View>
    </Stack>
  )
}

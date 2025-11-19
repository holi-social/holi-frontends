import React from 'react'

import { Stack } from 'holi-bricks/components/stack'
import { useTranslation } from 'react-i18next'
import { useSafeAreaInsets } from '@holi/core/helpers/useSafeAreaInsets'
import { View } from 'react-native'
import { ArrowRight, ArrowLeft } from '@holi/icons/src/generated'
import { Button, ButtonIcon, type ButtonVariant } from 'holi-bricks/components/button'
import type { NavigationButtonsProps } from '@holi/ui/components/organisms/HoliStepperV2/NavigationButtons'
import type { DecorativeColors } from 'holi-bricks/foundations/colors/themes/types'

type Props = Pick<
  NavigationButtonsProps,
  'onNextPress' | 'onBackPress' | 'isBackButtonAvailable' | 'nextButtonLabel'
> & {
  nextButtonVariant?: ButtonVariant
  backgroundColor?: DecorativeColors
}
export const GoodDeedsIntroFooterNavigation = ({
  onNextPress,
  onBackPress,
  isBackButtonAvailable = true,
  nextButtonLabel = '',
  nextButtonVariant = 'primary',
  backgroundColor = 'white',
}: Props) => {
  const { t } = useTranslation()
  const { bottom: safeAreaBottom } = useSafeAreaInsets()

  return (
    <Stack backgroundColor={backgroundColor} padding="xs" borderRadius={{ topLeft: 'xxl', topRight: 'xxl' }} flex={0}>
      <View style={{ paddingBottom: safeAreaBottom }}>
        <Stack direction="row" justifyContent="space-between">
          <Stack>
            {isBackButtonAvailable && (
              <ButtonIcon icon={ArrowLeft} label={''} size="lg" variant="secondary" onPress={onBackPress} />
            )}
          </Stack>

          <Stack>
            <Button
              label={t(nextButtonLabel) ?? nextButtonLabel}
              variant={nextButtonVariant}
              size="lg"
              icon={ArrowRight}
              onPress={onNextPress}
            />
          </Stack>
        </Stack>
      </View>
    </Stack>
  )
}

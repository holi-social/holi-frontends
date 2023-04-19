import React from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { useSafeAreaInsets } from '@holi/core/helpers/useSafeAreaInsets'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliButton, { HoliButtonProps } from '@holi/ui/components/molecules/HoliButton'
import HoliModal from '@holi/ui/components/molecules/HoliModal'
import { colors } from '@holi/ui/styles/globalVars'

export interface MoreOptionsButtonWithModalProps extends HoliButtonProps {
  showOptions?: boolean
  onModalDismiss: () => void
  tintColor?: string
  iconSize?: number
}

const MoreOptionsButtonWithModal = ({
  showOptions = false,
  onModalDismiss,
  tintColor = colors.foreground20,
  // HoliButton specific props
  label,
  onPress,
  children,
  iconSize,
  ...buttonProps
}: React.PropsWithChildren<MoreOptionsButtonWithModalProps>) => {
  const { t } = useTranslation()
  const { bottom: safeAreaBottom } = useSafeAreaInsets()

  return (
    <>
      <HoliButton transparent inline label={label} onPress={onPress} {...buttonProps}>
        <HoliIcon icon="more" color={tintColor} {...(iconSize ? { size: iconSize } : {})} />
      </HoliButton>

      <HoliModal
        show={showOptions}
        onDismiss={onModalDismiss}
        testID="more-options-modal"
        label={t('global.moreOptions')}
        style={{ paddingHorizontal: 24 }}
      >
        <View style={{ marginBottom: safeAreaBottom || 50 }}>{children}</View>
      </HoliModal>
    </>
  )
}

export default MoreOptionsButtonWithModal

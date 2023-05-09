import React from 'react'
import type { PropsWithChildren } from 'react'
import { useTranslation } from 'react-i18next'

import { useSafeAreaInsets } from '@holi/core/helpers/useSafeAreaInsets'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliButton, { HoliButtonProps } from '@holi/ui/components/molecules/HoliButton'
import HoliModal from '@holi/ui/components/molecules/HoliModal'
import { colors } from '@holi/ui/styles/globalVars'

export interface Drawer extends Omit<HoliButtonProps, 'style'> {
  showOptions?: boolean
  onModalDismiss: () => void
  tintColor?: string
  iconSize?: number
}

export const Drawer = ({
  showOptions = false,
  onModalDismiss,
  tintColor = colors.foreground20,
  // HoliButton specific props
  label,
  onPress,
  children,
  iconSize,
  ...buttonProps
}: PropsWithChildren<Drawer>) => {
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
        style={{ display: 'flex', alignItems: 'center', paddingHorizontal: 24, paddingBottom: safeAreaBottom || 18 }}
      >
        {children}
      </HoliModal>
    </>
  )
}

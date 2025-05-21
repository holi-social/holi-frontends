import type { PropsWithChildren, ReactNode } from 'react'
import type React from 'react'
import { createContext, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet } from 'react-native'

import { useSafeAreaInsets } from '@holi/core/helpers/useSafeAreaInsets'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { More } from '@holi/icons/src/generated'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import HoliButton, { type HoliButtonProps } from '@holi/ui/components/molecules/HoliButton'
import HoliModal, { useModalState } from '@holi/ui/components/molecules/HoliModal'
import { useTheme } from '@holi/ui/styles/theme'

interface ActionDrawerContentProps {
  hideDrawer: () => void
}

const ActionDrawerContext = createContext<ActionDrawerContentProps | null>(null)

export const useActionDrawerContext = () => {
  const context = useContext(ActionDrawerContext)
  if (!context) {
    throw new Error('HoliActionDrawer compound components cannot be rendered outside the Drawer component')
  }

  return context
}

export interface ActionDrawerProps {
  label: string
  testID?: string
  variant?: 'default' | 'dark'
  buttonElement?: React.ReactNode
  buttonProps?: Partial<HoliButtonProps>
  renderCustomButton?: (onPress: () => void, testID?: string) => ReactNode
  onShow?: CallableFunction
  onHide?: CallableFunction
}

export const Drawer = ({
  children,
  label,
  testID,
  variant,
  buttonElement,
  buttonProps,
  renderCustomButton,
  onHide,
}: PropsWithChildren<ActionDrawerProps>): JSX.Element => {
  const { t } = useTranslation()
  const { bottom: safeAreaBottom } = useSafeAreaInsets()
  const { show: showModal, hide: hideModal, props: modalProps } = useModalState()
  const { theme } = useTheme()
  const { colors } = theme

  const handleHide = () => {
    hideModal()
    if (onHide) onHide()
  }

  const contextValue = {
    hideDrawer: handleHide,
  }

  return (
    <ActionDrawerContext.Provider value={contextValue}>
      {renderCustomButton ? (
        renderCustomButton(showModal, testID)
      ) : (
        <HoliButton transparent inline label={label} onPress={showModal} testID={testID} {...buttonProps}>
          {buttonElement || (
            <HoliIcon icon={More} colorOverride={variant === 'dark' ? colors.foreground30 : colors.foreground20} />
          )}
        </HoliButton>
      )}

      <HoliModal
        {...modalProps}
        testID="more-options-modal"
        label={t('global.moreOptions')}
        style={StyleSheet.flatten([{ paddingBottom: safeAreaBottom || 18 }])}
        onDismiss={handleHide}
      >
        <HoliContainer>{children}</HoliContainer>
      </HoliModal>
    </ActionDrawerContext.Provider>
  )
}

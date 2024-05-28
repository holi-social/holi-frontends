import type { PropsWithChildren } from 'react'
import React, { createContext, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { GestureResponderEvent, StyleSheet } from 'react-native'

import { useSafeAreaInsets } from '@holi/core/helpers/useSafeAreaInsets'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { More } from '@holi/icons/src/generated'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import HoliButton, { HoliButtonProps } from '@holi/ui/components/molecules/HoliButton'
import HoliModal, { useModalState } from '@holi/ui/components/molecules/HoliModal'
import { useTheme } from '@holi/ui/styles/theme'

interface ActionDrawerContentProps {
  showDrawer: () => void
  hideDrawer: () => void
  isVisibleDrawer: boolean
}

const ActionDrawerContext = createContext<ActionDrawerContentProps>({} as ActionDrawerContentProps)

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
  onShow?: CallableFunction
  onHide?: CallableFunction
}

const safeSideEffect = (
  fn: (event?: React.SyntheticEvent | GestureResponderEvent) => unknown | Promise<unknown>,
  sideEffectFn?: CallableFunction
): ((event?: React.SyntheticEvent | GestureResponderEvent) => unknown | Promise<unknown>) => {
  return (e) => {
    try {
      sideEffectFn?.()
    } catch (e) {
      // console.error will be picked up by Sentry, so this does not go unnoticed to the programmer, but to the user.
      // eslint-disable-next-line no-console
      console.error('Error during evaluation of onTrack callback', e)
    } finally {
      fn(e)
    }
  }
}

export const Drawer = ({
  children,
  label,
  testID,
  variant,
  buttonElement,
  buttonProps,
  onShow,
  onHide,
}: PropsWithChildren<ActionDrawerProps>): JSX.Element => {
  const { t } = useTranslation()
  const { bottom: safeAreaBottom } = useSafeAreaInsets()
  const { visible: visibleModal, show: showModal, hide: hideModal } = useModalState()
  const { theme } = useTheme()
  const { colors } = theme

  const contextValue = {
    isVisibleDrawer: visibleModal,
    hideDrawer: hideModal,
    showDrawer: showModal,
  }

  return (
    <ActionDrawerContext.Provider value={contextValue}>
      <HoliButton
        transparent
        inline
        label={label}
        onPress={safeSideEffect(showModal, onShow)}
        testID={testID}
        {...buttonProps}
      >
        {buttonElement || (
          <HoliIcon icon={More} color={variant === 'dark' ? colors.foreground30 : colors.foreground20} />
        )}
      </HoliButton>

      <HoliModal
        show={visibleModal}
        onDismiss={safeSideEffect(hideModal, onHide)}
        testID="more-options-modal"
        label={t('global.moreOptions')}
        style={StyleSheet.flatten([styles.modal, { paddingBottom: safeAreaBottom || 18 }])}
      >
        <HoliContainer>{children}</HoliContainer>
      </HoliModal>
    </ActionDrawerContext.Provider>
  )
}

const styles = StyleSheet.create({
  modal: {
    paddingHorizontal: 24,
  },
})

import { PropsWithChildren, ReactNode } from 'react'
import type React from 'react'
import { createContext, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { type GestureResponderEvent, StyleSheet } from 'react-native'

import { useSafeAreaInsets } from '@holi/core/helpers/useSafeAreaInsets'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { More } from '@holi/icons/src/generated'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import HoliButton, { type HoliButtonProps } from '@holi/ui/components/molecules/HoliButton'
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
  renderCustomButton?: (onPress: () => void, testID?: string) => ReactNode
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
  renderCustomButton,
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

  const onPressHandler = safeSideEffect(showModal, onShow)
  const onDismissHandler = safeSideEffect(hideModal, onHide)

  return (
    <ActionDrawerContext.Provider value={contextValue}>
      {renderCustomButton ? (
        renderCustomButton(onPressHandler, testID)
      ) : (
        <HoliButton transparent inline label={label} onPress={onPressHandler} testID={testID} {...buttonProps}>
          {buttonElement || (
            <HoliIcon icon={More} color={variant === 'dark' ? colors.foreground30 : colors.foreground20} />
          )}
        </HoliButton>
      )}

      <HoliModal
        shown={visibleModal}
        onDismiss={onDismissHandler}
        testID="more-options-modal"
        label={t('global.moreOptions')}
        style={StyleSheet.flatten([{ paddingBottom: safeAreaBottom || 18 }])}
      >
        <HoliContainer>{children}</HoliContainer>
      </HoliModal>
    </ActionDrawerContext.Provider>
  )
}

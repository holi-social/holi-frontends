import React, { createContext, useContext } from 'react'
import type { Dispatch, PropsWithChildren, SetStateAction, SyntheticEvent } from 'react'
import { StyleSheet } from 'react-native'
import type { GestureResponderEvent } from 'react-native'

import HoliBox from '@holi/ui/components/atoms/HoliBox'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import type { UseConfirmationProps } from '@holi/ui/components/molecules/HoliConfirmation'
import { useConfirmationState } from '@holi/ui/components/molecules/HoliConfirmation'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import { colors } from '@holi/ui/styles/globalVars'

import { actions, mapActionIcons } from './utils'
import type { ActionType } from './utils'

const ICON_MAP = mapActionIcons(actions)

interface ActionContextProps {
  isVisibleConfirmation: boolean
  setShowConfirmation: Dispatch<SetStateAction<boolean>>
  confirmationProps: UseConfirmationProps
}

const ActionContext = createContext<ActionContextProps>({} as ActionContextProps)

export const useActionContext = () => {
  const context = useContext(ActionContext)
  if (!context) {
    throw new Error(
      'HoliActionDrawer compound components cannot be rendered outside the HoliActionDrawer.Action component'
    )
  }

  return context
}

export interface ActionProps {
  action: ActionType
  title: string
  isLoading?: boolean
  variant?: 'default' | 'danger'
  showConfirmation?: boolean
  handleAction?: (event: SyntheticEvent | GestureResponderEvent) => void
  testID?: string
}

export const Action = ({
  action,
  children,
  handleAction,
  isLoading,
  title,
  showConfirmation,
  testID,
  variant = 'default',
}: PropsWithChildren<ActionProps>) => {
  const { show: isVisibleConfirmation, setShow: setShowConfirmation, props: confirmationProps } = useConfirmationState()

  const iconName = ICON_MAP.get(action) ?? 'edit'
  const isDanger = variant === 'danger'
  const variantColor = isDanger ? colors.error20 : colors.foreground30
  const colorName = isDanger ? 'error200' : 'black300'

  const handleOnPress = (e: SyntheticEvent | GestureResponderEvent) => {
    if (showConfirmation) setShowConfirmation(showConfirmation)
    handleAction?.(e)
  }

  const contextValue = {
    isVisibleConfirmation,
    setShowConfirmation,
    confirmationProps,
  }

  return (
    <ActionContext.Provider value={contextValue}>
      <HoliBox padding={[0, 0, 32, 0]}>
        <HoliButton
          inline
          transparent
          label={title}
          contentStyle={styles.buttonContent}
          onPress={handleOnPress}
          testID={testID}
        >
          <HoliBox padding={[0, 13, 0, 0]}>
            <HoliIcon icon={iconName} size={18} filled={false} color={variantColor} />
          </HoliBox>

          <HoliText color={colorName}>{title}</HoliText>
        </HoliButton>
        {isLoading && <HoliLoader style={{ backgroundColor: colors.background10 }} />}
      </HoliBox>
      {children}
    </ActionContext.Provider>
  )
}

const styles = StyleSheet.create({
  buttonContent: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  iconRight: {
    marginLeft: 'auto',
  },
})

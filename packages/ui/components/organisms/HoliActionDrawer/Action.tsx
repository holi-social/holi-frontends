import type { Dispatch, PropsWithChildren, SetStateAction, SyntheticEvent } from 'react'
import React, { createContext, useContext } from 'react'
import type { GestureResponderEvent } from 'react-native'
import { StyleSheet } from 'react-native'

import { HoliIcon } from '@holi/icons/src/HoliIcon'
import type { HoliIconType } from '@holi/icons/src/HoliIconType'
import { Edit2 } from '@holi/icons/src/generated'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import type { UseConfirmationProps } from '@holi/ui/components/molecules/HoliConfirmation'
import { useConfirmationState } from '@holi/ui/components/molecules/HoliConfirmation'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import { useActionDrawerContext } from '@holi/ui/components/organisms/HoliActionDrawer/Drawer'
import { useTheme } from '@holi/ui/styles/theme'

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
  icon?: HoliIconType
  title: string
  isLoading?: boolean
  variant?: 'default' | 'danger'
  showConfirmation?: boolean
  handleAction?: (event: SyntheticEvent | GestureResponderEvent) => Promise<void | unknown> | void
  testID?: string
  iconColor?: string
}

export const Action = ({
  icon = Edit2,
  children,
  handleAction,
  isLoading,
  title,
  showConfirmation,
  testID,
  iconColor,
  variant = 'default',
}: PropsWithChildren<ActionProps>) => {
  const { show: isVisibleConfirmation, setShow: setShowConfirmation, props: confirmationProps } = useConfirmationState()
  const { hideDrawer } = useActionDrawerContext()

  const { theme } = useTheme()
  const { colors } = theme

  const isDanger = variant === 'danger'
  const variantColor = isDanger ? colors.error20 : colors.foreground30
  const colorName = isDanger ? 'error200' : 'black300'

  const handleOnPress = async (e: SyntheticEvent | GestureResponderEvent) => {
    if (showConfirmation) setShowConfirmation(showConfirmation)
    await handleAction?.(e)
    if (!showConfirmation) hideDrawer() // necessary to avoid drawer staying open when the action is a navigation (mobile)
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
            <HoliIcon icon={icon} size={18} colorOverride={iconColor || variantColor} />
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

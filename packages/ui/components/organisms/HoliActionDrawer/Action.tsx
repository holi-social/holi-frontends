import type { Dispatch, PropsWithChildren, SetStateAction, SyntheticEvent } from 'react'
import React, { createContext, useContext } from 'react'
import type { GestureResponderEvent } from 'react-native'
import { StyleSheet } from 'react-native'

import { HoliIcon } from '@holi/icons/src/HoliIcon'
import {
  ArrowRightUp,
  CloseCircle,
  Delete,
  DoorClosed,
  Edit2,
  Flag,
  Share,
  UserSettings,
} from '@holi/icons/src/generated'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import type { UseConfirmationProps } from '@holi/ui/components/molecules/HoliConfirmation'
import { useConfirmationState } from '@holi/ui/components/molecules/HoliConfirmation'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import { useActionDrawerContext } from '@holi/ui/components/organisms/HoliActionDrawer/Drawer'
import { colors } from '@holi/ui/styles/globalVars'

const IconByActionName = {
  delete: Delete,
  edit: Edit2,
  report: Flag,
  share: Share,
  block: CloseCircle,
  leave: DoorClosed,
  collaborators: UserSettings,
  external: ArrowRightUp,
}

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
  action: 'block' | 'delete' | 'edit' | 'report' | 'share' | 'leave' | 'collaborators' | 'external'
  title: string
  isLoading?: boolean
  variant?: 'default' | 'danger'
  showConfirmation?: boolean
  handleAction?: (event: SyntheticEvent | GestureResponderEvent) => Promise<void> | void
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
  const { hideDrawer } = useActionDrawerContext()

  const iconName = IconByActionName[action] ?? Edit2
  const isDanger = variant === 'danger'
  const variantColor = isDanger ? colors.error20 : colors.foreground30
  const colorName = isDanger ? 'error200' : 'black300'

  const handleOnPress = async (e: SyntheticEvent | GestureResponderEvent) => {
    if (showConfirmation) setShowConfirmation(showConfirmation)
    await handleAction?.(e)
    !showConfirmation && hideDrawer() // necessary to avoid drawer staying open when the action is a navigation (mobile)
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
            <HoliIcon icon={iconName} size={18} color={variantColor} />
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

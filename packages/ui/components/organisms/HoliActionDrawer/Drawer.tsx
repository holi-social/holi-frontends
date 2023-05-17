import React, { createContext, useContext } from 'react'
import type { PropsWithChildren } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet } from 'react-native'

import { useSafeAreaInsets } from '@holi/core/helpers/useSafeAreaInsets'
import { useLoggedInUser } from '@holi/core/screens/userprofile/useLoggedInUser'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliModal, { useModalState } from '@holi/ui/components/molecules/HoliModal'
import { colors } from '@holi/ui/styles/globalVars'

interface ActionDrawerContentProps {
  showDrawer: () => void
  hideDrawer: () => void
  isLoggedIn: boolean
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
}

export const Drawer = ({ children, label, testID }: PropsWithChildren<ActionDrawerProps>): JSX.Element => {
  const { t } = useTranslation()
  const { bottom: safeAreaBottom } = useSafeAreaInsets()
  const { isLoggedIn } = useLoggedInUser()
  const { visible: visibleModal, show: showModal, hide: hideModal } = useModalState()

  const contextValue = {
    isVisibleDrawer: visibleModal,
    hideDrawer: hideModal,
    showDrawer: showModal,
    isLoggedIn,
  }

  return (
    <ActionDrawerContext.Provider value={contextValue}>
      <HoliButton transparent inline label={label} onPress={showModal} testID={testID}>
        <HoliIcon icon="more" color={colors.foreground20} />
      </HoliButton>

      <HoliModal
        show={visibleModal}
        onDismiss={hideModal}
        testID="more-options-modal"
        label={t('global.moreOptions')}
        style={StyleSheet.flatten([styles.modal, { paddingBottom: safeAreaBottom || 18 }])}
      >
        {children}
      </HoliModal>
    </ActionDrawerContext.Provider>
  )
}

const styles = StyleSheet.create({
  modal: {
    paddingHorizontal: 24,
  },
})

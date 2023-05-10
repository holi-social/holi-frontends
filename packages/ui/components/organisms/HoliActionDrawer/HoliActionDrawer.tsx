import React, { createContext } from 'react'
import type { PropsWithChildren } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet } from 'react-native'

import { useSafeAreaInsets } from '@holi/core/helpers/useSafeAreaInsets'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliModal, { useModalState } from '@holi/ui/components/molecules/HoliModal'
import { colors } from '@holi/ui/styles/globalVars'

interface ContextProps {
  show: () => void
  hide: () => void
  visible: boolean
}

const ActionDrawerContext = createContext<ContextProps>({} as ContextProps)

export interface ActionDrawerProps {
  btnLabel: string
  showOptions?: boolean
  iconSize?: number
}

export const HoliActionDrawer = ({ btnLabel, children }: PropsWithChildren<ActionDrawerProps>) => {
  const { t } = useTranslation()
  const { bottom: safeAreaBottom } = useSafeAreaInsets()
  const { visible, show, hide } = useModalState()

  return (
    <ActionDrawerContext.Provider value={{ visible, show, hide }}>
      <HoliButton transparent inline label={btnLabel} onPress={show}>
        <HoliIcon icon="more" color={colors.foreground20} />
      </HoliButton>

      <HoliModal
        show={visible}
        onDismiss={hide}
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
    display: 'flex',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
})

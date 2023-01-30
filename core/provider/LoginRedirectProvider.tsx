import React, { createContext, useCallback, useContext, useState } from 'react'

import { HoliConfirmationProps } from '@holi/ui/components/molecules/HoliConfirmation'
import {
  HoliLoginGuardModal,
  HoliLoginGuardModalProps,
  useLoginGuardModalState,
} from '@holi/ui/components/molecules/HoliLoginGuardModal'

export type LoginRedirectContextType = {
  openLoginDialog: (props?: Partial<HoliConfirmationProps>) => void
}

export const LoginRedirectContext = createContext<LoginRedirectContextType>({
  openLoginDialog: () => null,
})

export const LoginRedirectProvider: React.FC = ({ children }) => {
  const [props, setProps] = useState<HoliLoginGuardModalProps>({})
  const { setShow, props: loginGuardModalProps } = useLoginGuardModalState(props)

  const openLoginDialog = useCallback(
    (dialogProps?: HoliLoginGuardModalProps) => {
      setProps((currentProps) => ({ ...currentProps, ...dialogProps }))
      setShow(true)
    },
    [setShow, setProps]
  )

  return (
    <LoginRedirectContext.Provider value={{ openLoginDialog }}>
      {children}

      <HoliLoginGuardModal {...loginGuardModalProps} />
    </LoginRedirectContext.Provider>
  )
}

export default LoginRedirectProvider

export const useLoginRedirect = () => useContext(LoginRedirectContext)

import React, { createContext, useCallback, useContext, useState } from 'react'

import { LoginGuardModal, LoginGuardModalProps } from '@holi/core/components/LoginGuardModal'
import { HoliConfirmationProps, useConfirmationState } from '@holi/ui/components/molecules/HoliConfirmation'

export type LoginRedirectContextType = {
  openLoginDialog: (props?: Partial<HoliConfirmationProps>) => void
}

export const LoginRedirectContext = createContext<LoginRedirectContextType>({
  openLoginDialog: () => null,
})

export const LoginRedirectProvider = ({ children }: React.PropsWithChildren<unknown>) => {
  const [props, setProps] = useState<LoginGuardModalProps>({})
  const { setShow, props: loginGuardModalProps } = useConfirmationState(props)

  const openLoginDialog = useCallback(
    (dialogProps?: LoginGuardModalProps) => {
      setProps((currentProps) => ({ ...currentProps, ...dialogProps }))
      setShow(true)
    },
    [setShow, setProps]
  )

  return (
    <LoginRedirectContext.Provider value={{ openLoginDialog }}>
      {children}

      <LoginGuardModal {...props} {...loginGuardModalProps} />
    </LoginRedirectContext.Provider>
  )
}

export default LoginRedirectProvider

export const useLoginRedirect = () => useContext(LoginRedirectContext)

import React, { createContext, useContext, useState } from 'react'

import { LoginGuardModal } from '@holi/core/components/LoginGuardModal'
import { useConfirmationState } from '@holi/ui/components/molecules/HoliConfirmation'

export type LoginModalProps = {
  label?: string
  title?: string
  description?: string
  confirmText?: string
  dismissText?: string
}

export interface LoginModalContext {
  customProps: LoginModalProps
  openLoginModal: (props?: LoginModalProps) => void
}

export const LoginModalContext = createContext<LoginModalContext>({} as LoginModalContext)

export const useLoginModal = () => useContext(LoginModalContext)

export const LoginModalProvider = ({ children }: React.PropsWithChildren<unknown>) => {
  const [customProps, setCustomProps] = useState<LoginModalProps>({})
  const { setShow: setShowLoginGuard, props: loginGuardModalProps } = useConfirmationState()

  const openLoginModal = (props: LoginModalProps = {}) => {
    setCustomProps((currentProps) => ({ ...currentProps, ...props }))
    setShowLoginGuard(true)
  }

  return (
    <LoginModalContext.Provider value={{ customProps, openLoginModal }}>
      {children}
      <LoginGuardModal {...loginGuardModalProps} {...customProps} />
    </LoginModalContext.Provider>
  )
}

export default LoginModalProvider

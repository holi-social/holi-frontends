import React, { createContext, useContext, useState } from 'react'

import { LoginGuardModal } from '@holi/core/components/LoginGuardModal'

export type LoginModalProps = {
  label?: string
  title?: string
  description?: string
  confirmText?: string
  dismissText?: string
}

// *** Context ***
export interface LoginModalContext {
  modalProps: LoginModalProps
  openLoginModal: (props?: LoginModalProps) => void
}

export const LoginModalContext = createContext<LoginModalContext>({} as LoginModalContext)

// *** Context Hook ***
export const useLoginModal = () => useContext(LoginModalContext)

// *** Provider ***
export const LoginModalProvider = ({ children }: React.PropsWithChildren<unknown>) => {
  const [modalProps, setModalProps] = useState<LoginModalProps>({})
  // TODO: cannot reuse ConfirmationContext here. show is not reactive ?!
  const [showLoginModal, setShowLoginModal] = useState(false)

  const openLoginModal = (props: LoginModalProps = {}) => {
    setModalProps((currentProps) => ({ ...currentProps, ...props }))
    setShowLoginModal(true)
  }

  return (
    <LoginModalContext.Provider value={{ modalProps, openLoginModal }}>
      {children}
      <LoginGuardModal
        show={showLoginModal}
        {...modalProps}
        onConfirm={() => setShowLoginModal(false)}
        onDismiss={() => setShowLoginModal(false)}
      />
    </LoginModalContext.Provider>
  )
}
export default LoginModalProvider

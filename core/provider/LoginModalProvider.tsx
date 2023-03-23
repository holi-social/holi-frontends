import React, { createContext, useCallback, useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { LoginGuardModal } from '@holi/core/components/LoginGuardModal'

// *** Context ***
export interface LoginModalContext {
  uschi: string
  openLoginModal: () => void
}

export const LoginModalContext = createContext<LoginModalContext>({} as LoginModalContext)

// *** Context Hook ***
export const useLoginModal = () => useContext(LoginModalContext)

// *** Provider ***
export const LoginModalProvider = ({ children }: React.PropsWithChildren<unknown>) => {
  const { t } = useTranslation()
  const [uschi] = useState('Uschi')
  // TODO: cannot reuse ConfirmationContext here. show is not reactive ?!
  const [showLoginModal, setShowLoginModal] = useState(false)

  const openLoginModal = () => {
    console.log('[LoginModalProvider] openLoginModal()')
    setShowLoginModal(true)
  }

  const onConfirm = useCallback(() => {
    console.log('[LoginModalProvider] confirm()')
    setShowLoginModal(false)
  }, [])

  const onDismiss = useCallback(() => {
    console.log('[LoginModalProvider] dismiss()')
    setShowLoginModal(false)
  }, [])

  return (
    <LoginModalContext.Provider value={{ uschi, openLoginModal }}>
      {children}
      <LoginGuardModal
        show={showLoginModal}
        description={t('user.profileView.connection.notLoggedIn.message')}
        onConfirm={onConfirm}
        onDismiss={onDismiss}
      />
    </LoginModalContext.Provider>
  )
}
export default LoginModalProvider

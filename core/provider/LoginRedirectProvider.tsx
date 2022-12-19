import React, { createContext, useCallback, useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'

import useRouting from '@holi/core/navigation/hooks/useRouting'
import HoliConfirmation from '@holi/ui/components/molecules/HoliConfirmation'

export type LoginRedirectProps = {
  title?: string
  text?: string
  btnTextConfirm?: string
  btnTextDismiss?: string
  onConfirm?: () => boolean
  onDismiss?: () => boolean
}

export type LoginRedirectContextType = {
  openLoginDialog: (props?: LoginRedirectProps) => void
}

export const LoginRedirectContext = createContext<LoginRedirectContextType>({
  openLoginDialog: () => null,
})

export const LoginRedirectProvider: React.FC = ({ children }) => {
  const { t } = useTranslation()
  const { navigate } = useRouting()
  const [dialogIsOpen, setDialogIsOpen] = useState(false)
  const [props, setProps] = useState<LoginRedirectProps>({
    title: t('loginRedirect.title'),
    text: t('loginRedirect.text'),
    btnTextConfirm: t('loginRedirect.btnConfirm'),
    btnTextDismiss: t('global.decline'),
    onConfirm: () => true,
    onDismiss: () => true,
  })

  const openLoginDialog = useCallback(
    (dialogProps: LoginRedirectProps) => {
      setProps({ ...props, ...dialogProps })
      setDialogIsOpen(true)
    },
    [props, setProps]
  )

  const onConfirm = useCallback(() => {
    const confirmPropagation = props.onConfirm?.()
    if (confirmPropagation !== false) {
      setDialogIsOpen(false)
      navigate('/login')
    }
  }, [navigate, props])

  const onDismiss = useCallback(() => {
    const confirmPropagation = props.onDismiss?.()
    if (confirmPropagation !== false) {
      setDialogIsOpen(false)
    }
  }, [props])

  return (
    <LoginRedirectContext.Provider value={{ openLoginDialog }}>
      {children}

      <HoliConfirmation
        show={dialogIsOpen}
        label={props.title || ''}
        title={props.title || ''}
        description={props.text || ''}
        confirmText={props.btnTextConfirm}
        dismissText={props.btnTextDismiss}
        onConfirm={onConfirm}
        onDismiss={onDismiss}
      />
    </LoginRedirectContext.Provider>
  )
}

export default LoginRedirectProvider

export const useLoginRedirect = () => useContext(LoginRedirectContext)

import type React from 'react'
import { createContext, useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { SignupGuardModal } from '@holi/core/components/SignupGuardModal'
import { setPathToRedirect } from '@holi/core/navigation/hooks/useRedirect'
import type { SignupModalPressedTrigger } from '@holi/core/tracking/types'
import { useConfirmationState } from '@holi/ui/components/molecules/HoliConfirmation'
import { usePathname } from '@holi/core/navigation/hooks/usePathname'

export type SignupModalProps = {
  label?: string
  title?: string
  description?: string
  secondDescription?: string | React.ReactNode
  confirmText?: string
  dismissText?: string
  redirectPath?: string
  trackTrigger?: SignupModalPressedTrigger
}

export interface SignupModalContext {
  customProps: SignupModalProps
  openSignupModal: (props?: SignupModalProps) => void
}

export const SignupModalContext = createContext<SignupModalContext>({} as SignupModalContext)

export const useSignupModal = () => useContext(SignupModalContext)

export const SignupModalProvider = ({ children }: React.PropsWithChildren<unknown>) => {
  const { t } = useTranslation()
  const pathname = usePathname()

  const [customProps, setCustomProps] = useState<SignupModalProps>({})
  const { setShow: setShowLoginGuard, props: signupGuardModalProps } = useConfirmationState()
  const enableRedirect = () => setPathToRedirect(customProps.redirectPath ?? pathname)

  const openSignupModal = (props: SignupModalProps = {}) => {
    // setting the defaults if nothing is set
    if (!props.title) props.title = t('loginRedirect.title')
    if (!props.description) props.description = t('loginRedirect.text')
    if (!props.label) props.label = props.description

    setCustomProps(props) // Override previous props
    setShowLoginGuard(true)
  }

  return (
    <SignupModalContext.Provider value={{ customProps, openSignupModal }}>
      {children}
      <SignupGuardModal enableRedirect={enableRedirect} {...signupGuardModalProps} {...customProps} />
    </SignupModalContext.Provider>
  )
}

export default SignupModalProvider

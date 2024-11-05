import { useCallback } from 'react'

import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSignupModal } from '@holi/core/providers/SignupModalProvider'
import type { SignupModalPressedTrigger } from '@holi/core/tracking/types'

interface NavigateWithAuthOptions {
  title?: string
  description?: string
  trackTrigger?: SignupModalPressedTrigger
  redirectPath?: string
}

export const useAuthRequiredNavigation = () => {
  const { navigate } = useRouting()
  const { isLoggedIn } = useLoggedInUser()
  const { openSignupModal } = useSignupModal()

  const navigateWithAuth = useCallback(
    (path: string, options: NavigateWithAuthOptions = {}) => {
      if (!isLoggedIn) {
        openSignupModal({
          title: options.title,
          description: options.description,
          trackTrigger: options.trackTrigger,
          redirectPath: options.redirectPath || path,
        })
      } else {
        navigate(path)
      }
    },
    [isLoggedIn, navigate, openSignupModal]
  )

  return { navigateWithAuth }
}

export default useAuthRequiredNavigation

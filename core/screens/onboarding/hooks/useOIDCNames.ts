import { getSessionFromStorage } from '@holi/core/auth/helpers/auth'
import type { AuthenticatedUser } from '@holi/core/domain/shared/types'
import type { NamesSelectionData } from '@holi/core/screens/onboarding/hooks/useNamesSelection'
import { useEffect } from 'react'

interface UseOIDCNamesProps {
  user?: AuthenticatedUser
  onNamesChange: (fieldName: keyof NamesSelectionData, value: string) => void
  names: NamesSelectionData
}

export const useOIDCNames = ({ user, names, onNamesChange }: UseOIDCNamesProps) => {
  useEffect(() => {
    if (user?.isOidc && !names.firstName && !names.lastName) {
      getSessionFromStorage().then((session) => {
        const traits = session?.session?.identity?.traits
        if (traits?.given_name) {
          onNamesChange('firstName', traits.given_name)
        }
        if (traits?.family_name) {
          onNamesChange('lastName', traits.family_name)
        }
      })
    }
  }, [names.firstName, names.lastName, onNamesChange, user?.isOidc])
}

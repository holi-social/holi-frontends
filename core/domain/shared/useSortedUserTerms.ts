import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import type { TermType } from '@holi/core/domain/shared/types'
import { useSortedTerms } from '@holi/core/domain/shared/useSortedTerms'
import { useMemo } from 'react'

export const useSortedUserTerms = (termType: TermType): string[] => {
  const { user } = useLoggedInUser()
  const sortedTerms = useSortedTerms(termType)
  const userTerms = termType === 'topic' ? user?.interestsV2 : user?.skillsV2

  return useMemo(
    () => sortedTerms.filter((option) => userTerms?.includes(option.term)).map((option) => option.term),
    [sortedTerms, userTerms]
  )
}

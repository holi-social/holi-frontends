import { DocumentNode, useMutation, useQuery } from '@apollo/client'
import { useCallback, useMemo, useState } from 'react'

import { logError } from '@holi/core/errors/helpers'
import { useErrorHandling } from '@holi/core/errors/hooks'
import type { SelectableTerm } from '@holi/core/screens/userprofile/components/UserChipForm'
import {
  UpdateAuthenticatedUserInput,
  UpdateAuthenticatedUserResponse,
  updateUserMutation,
} from '@holi/core/screens/userprofile/queries'
import type { Term, User } from '@holi/core/screens/userprofile/types'
import { termsByTitleComparator } from '@holi/core/screens/userprofile/types'
import type { Paged } from '@holi/core/types'

export type ChipUserField = 'interests' | 'sdgs' | 'skills'

export interface UseUserChipsOptions {
  user?: User
  keyInUserObject: ChipUserField
  queryToUse: DocumentNode
  onSubmit?: (user: User) => void
}

const getSortedAndFilteredTerms = (
  availableTerms: Term[],
  selectedTerms: Term[],
  filterString = ''
): SelectableTerm[] => {
  const unselectedTerms = availableTerms.filter((term) => !selectedTerms.find((t) => t.id === term.id))
  const orderedTerms = [
    ...selectedTerms.sort(termsByTitleComparator).map((term) => ({ ...term, selected: true })),
    ...unselectedTerms.sort(termsByTitleComparator),
  ]
  return filterString
    ? orderedTerms.filter((term: Term) => term.title.toLowerCase().includes(filterString.toLowerCase()))
    : orderedTerms
}

export const useUserChips = <T extends Record<ChipUserField, Paged<Term>>>({
  user,
  queryToUse,
  keyInUserObject,
  onSubmit,
}: UseUserChipsOptions) => {
  const { displayError } = useErrorHandling()
  const { loading, data, error } = useQuery<T>(queryToUse, { skip: !user })
  const [updateUser, { loading: updateUserLoading, error: updateUserError }] =
    useMutation<UpdateAuthenticatedUserResponse>(updateUserMutation)

  const [filterString, setFilterString] = useState('')

  const availableTerms = useMemo(() => data?.[keyInUserObject]?.data || [], [data, keyInUserObject])
  const [selectedTerms, setSelectedTerms] = useState(user?.[keyInUserObject] ?? [])
  const sortedAndFilteredTerms = getSortedAndFilteredTerms(availableTerms, selectedTerms, filterString)

  const onTermSelect = useCallback(
    (id: string) =>
      setSelectedTerms((currentlySelectedTerms) => {
        // find changed term by ID
        const changedTerm = availableTerms.find((term) => term.id === id)

        // if not found, do not change anything
        if (!changedTerm) return currentlySelectedTerms

        // check if term was selected or deselected and add or remove it from `selectedTerms`
        return currentlySelectedTerms.some((term) => term.id === id)
          ? currentlySelectedTerms.filter((term) => term.id !== id)
          : [...currentlySelectedTerms, changedTerm]
      }),
    [availableTerms]
  )

  const submit = useCallback(async () => {
    const input = {} as UpdateAuthenticatedUserInput
    input[keyInUserObject] = selectedTerms.map(({ id }: Term) => id)

    const { data } = await updateUser({ variables: { input } })

    if (data) {
      onSubmit?.(data.updateAuthenticatedUser)
    }
  }, [keyInUserObject, onSubmit, selectedTerms, updateUser])

  if (error) {
    logError(error, `[UserChipLoader.tsx] ${error.message}`)
  }

  if (updateUserError) {
    displayError(updateUserError)
  }

  return {
    filterString,
    onFilterStringChange: setFilterString,
    terms: sortedAndFilteredTerms,
    onTermSelect,
    onSubmit: submit,
    loading: loading || updateUserLoading,
  }
}

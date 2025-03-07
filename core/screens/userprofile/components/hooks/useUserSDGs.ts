import { useMutation } from '@apollo/client'
import { useCallback, useState } from 'react'

import { authenticatedUserV2Query } from '@holi/core/domain/shared/queries'
import { type SDG, type User, termsByTitleComparator } from '@holi/core/domain/shared/types'
import { useErrorHandling } from '@holi/core/errors/hooks'
import {
  type UpdateAuthenticatedUserInput,
  type UpdateAuthenticatedUserV2Response,
  updateAuthenticatedUserV2Mutation,
} from '@holi/core/screens/userprofile/queries'
import { UserChipTypes } from '@holi/core/screens/userprofile/types'
import type { SelectableSDG } from '@holi/core/screens/userprofile/components/UserSDGsChipForm'
import { useSDGs } from '@holi/core/domain/shared/hooks'

interface UseUserChipsOptions {
  user?: User | null
  onSubmit?: (user: User) => void
}

const getSortedAndFilteredSDGs = (
  availableTerms: readonly SDG[],
  selectedTerms: readonly SDG[],
  filterString = ''
): SelectableSDG[] => {
  const unselectedTerms = availableTerms.filter((term) => !selectedTerms.find((t) => t.id === term.id))
  const orderedTerms = [
    ...[...selectedTerms].sort(termsByTitleComparator).map((term) => ({ ...term, selected: true })),
    ...[...unselectedTerms].sort(termsByTitleComparator),
  ]
  return filterString
    ? orderedTerms.filter((term: SDG) => term.title.toLowerCase().includes(filterString.toLowerCase()))
    : orderedTerms
}

export const useUserSDGs = ({ user, onSubmit }: UseUserChipsOptions) => {
  const keyInUserObject = UserChipTypes.SDGS
  const { displayError } = useErrorHandling()
  const { sdgsLoading, sdgs } = useSDGs()
  const [updateUser, { loading: updateUserLoading, error: updateUserError }] =
    useMutation<UpdateAuthenticatedUserV2Response>(updateAuthenticatedUserV2Mutation)

  const [filterString, setFilterString] = useState('')

  const [selectedTerms, setSelectedTerms] = useState(user?.[keyInUserObject] ?? [])
  const sortedAndFilteredTerms = getSortedAndFilteredSDGs(sdgs, selectedTerms, filterString)

  const onTermSelect = useCallback(
    (id: string) =>
      setSelectedTerms((currentlySelectedTerms) => {
        // find changed term by ID
        const changedTerm = sdgs.find((term) => term.id === id)

        // if not found, do not change anything
        if (!changedTerm) return currentlySelectedTerms

        // check if term was selected or deselected and add or remove it from `selectedTerms`
        return currentlySelectedTerms.some((term) => term.id === id)
          ? currentlySelectedTerms.filter((term) => term.id !== id)
          : [...currentlySelectedTerms, changedTerm]
      }),
    [sdgs]
  )

  const submit = useCallback(async () => {
    const input = {} as UpdateAuthenticatedUserInput
    input[keyInUserObject] = selectedTerms.map(({ id }: SDG) => id)

    const { data } = await updateUser({
      variables: { input },
      refetchQueries: [{ query: authenticatedUserV2Query, fetchPolicy: 'network-only' }],
    })

    if (data) {
      onSubmit?.(data.updateAuthenticatedUserV2)
    }
  }, [keyInUserObject, onSubmit, selectedTerms, updateUser])

  if (updateUserError) {
    displayError(updateUserError, 'Failed to update user', {
      location: 'useUserChips',
      field: keyInUserObject,
    })
  }

  return {
    filterString,
    onFilterStringChange: setFilterString,
    terms: sortedAndFilteredTerms,
    onTermSelect,
    onSubmit: submit,
    loading: sdgsLoading || updateUserLoading,
  }
}

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
  const unselectedSDGs = availableTerms.filter((sdg) => !selectedTerms.find((t) => t.id === sdg.id))
  const orderedSDGs = [
    ...[...selectedTerms].sort(termsByTitleComparator).map((sdg) => ({ ...sdg, selected: true })),
    ...[...unselectedSDGs].sort(termsByTitleComparator),
  ]
  return filterString
    ? orderedSDGs.filter((sdg: SDG) => sdg.title.toLowerCase().includes(filterString.toLowerCase()))
    : orderedSDGs
}

export const useUserSDGs = ({ user, onSubmit }: UseUserChipsOptions) => {
  const keyInUserObject = UserChipTypes.SDGS
  const { displayError } = useErrorHandling()
  const { sdgsLoading, sdgs } = useSDGs()
  const [updateUser, { loading: updateUserLoading, error: updateUserError }] =
    useMutation<UpdateAuthenticatedUserV2Response>(updateAuthenticatedUserV2Mutation)

  const [filterString, setFilterString] = useState('')

  const [selectedSDGs, setSelectedSDGs] = useState(user?.[keyInUserObject] ?? [])
  const sortedAndFilteredSDGs = getSortedAndFilteredSDGs(sdgs, selectedSDGs, filterString)

  const onSDGSelect = useCallback(
    (id: string) =>
      setSelectedSDGs((currentlySelectedSDGs) => {
        // find changed SDG by ID
        const changedTerm = sdgs.find((sdg) => sdg.id === id)

        // if not found, do not change anything
        if (!changedTerm) return currentlySelectedSDGs

        // check if the SDG was selected or deselected and add or remove it from `selectedSDGs`
        return currentlySelectedSDGs.some((sdg) => sdg.id === id)
          ? currentlySelectedSDGs.filter((sdg) => sdg.id !== id)
          : [...currentlySelectedSDGs, changedTerm]
      }),
    [sdgs]
  )

  const submit = useCallback(async () => {
    const input = {} as UpdateAuthenticatedUserInput
    input[keyInUserObject] = selectedSDGs.map(({ id }: SDG) => id)

    const { data } = await updateUser({
      variables: { input },
      refetchQueries: [{ query: authenticatedUserV2Query, fetchPolicy: 'network-only' }],
    })

    if (data) {
      onSubmit?.(data.updateAuthenticatedUserV2)
    }
  }, [keyInUserObject, onSubmit, selectedSDGs, updateUser])

  if (updateUserError) {
    displayError(updateUserError, 'Failed to update user', {
      location: 'useUserChips',
      field: keyInUserObject,
    })
  }

  return {
    filterString,
    onFilterStringChange: setFilterString,
    sdgs: sortedAndFilteredSDGs,
    onSDGSelect,
    onSubmit: submit,
    loading: sdgsLoading || updateUserLoading,
  }
}

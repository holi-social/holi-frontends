import { type DocumentNode, useMutation, useQuery } from '@apollo/client'
import { useCallback, useMemo, useState } from 'react'

import { authenticatedUserV2Query } from '@holi/core/domain/shared/queries'
import { type Term, type User, termsByTitleComparator } from '@holi/core/domain/shared/types'
import { logError } from '@holi/core/errors/helpers'
import { useErrorHandling } from '@holi/core/errors/hooks'
import type { SelectableTerm } from '@holi/core/screens/userprofile/components/UserChipForm'
import {
  type UpdateAuthenticatedUserInput,
  type UpdateAuthenticatedUserV2Response,
  updateAuthenticatedUserV2Mutation,
} from '@holi/core/screens/userprofile/queries'
import type { Paged } from '@holi/core/types'
import type { Color } from 'holi-bricks/tokens'

export enum UserChipTypes {
  INTERESTS = 'interests',
  SKILLS = 'skills',
  SDGS = 'sdgs',
}

export interface UseUserChipsOptions {
  user?: User | null
  keyInUserObject: UserChipTypes
  queryToUse: DocumentNode
  onSubmit?: (user: User) => void
  color?: Color
}

const getSortedAndFilteredTerms = (
  availableTerms: readonly Term[],
  selectedTerms: readonly Term[],
  filterString = ''
): SelectableTerm[] => {
  const unselectedTerms = availableTerms.filter((term) => !selectedTerms.find((t) => t.id === term.id))
  const orderedTerms = [
    ...[...selectedTerms].sort(termsByTitleComparator).map((term) => ({ ...term, selected: true })),
    ...[...unselectedTerms].sort(termsByTitleComparator),
  ]
  return filterString
    ? orderedTerms.filter((term: Term) => term.title.toLowerCase().includes(filterString.toLowerCase()))
    : orderedTerms
}

export const useUserChips = <T extends Record<UserChipTypes, Paged<Term>>>({
  user,
  queryToUse,
  keyInUserObject,
  onSubmit,
}: UseUserChipsOptions) => {
  const { displayError } = useErrorHandling()
  const { loading, data } = useQuery<T>(queryToUse, {
    skip: !user,
    onError: (error) =>
      logError(error, 'Failed to load terms for user chips', { location: 'useUserChips', field: keyInUserObject }),
  })
  const [updateUser, { loading: updateUserLoading, error: updateUserError }] =
    useMutation<UpdateAuthenticatedUserV2Response>(updateAuthenticatedUserV2Mutation)

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
    loading: loading || updateUserLoading,
  }
}

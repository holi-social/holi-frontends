import { DocumentNode, useMutation, useQuery } from '@apollo/client'
import React, { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import HoliText from '@holi//ui/components/atoms/HoliText'
import { colors } from '@holi//ui/styles/globalVars'
import { logError } from '@holi/core/errors/helpers'
import { useErrorHandling } from '@holi/core/errors/hooks'
import UserChipForm, { SelectableTerm } from '@holi/core/screens/userprofile/components/UserChipForm'
import {
  UpdateAuthenticatedUserInput,
  UpdateAuthenticatedUserResponse,
  updateUserMutation,
} from '@holi/core/screens/userprofile/queries'
import type { Term, User } from '@holi/core/screens/userprofile/types'
import { termsByTitleComparator } from '@holi/core/screens/userprofile/types'
import HoliModalContentWrapper from '@holi/ui/components/molecules/HoliModalContentWrapper'

type UserChipLoaderProps = {
  user: User
  onSubmit?: (user: User) => void
  keyInUserObject: 'interests' | 'sdgs' | 'skills'
  sortByTranslation?: boolean
  queryToUse: DocumentNode
}

const getSortedAndFilteredTemrs = (
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

const UserChipLoader: React.VoidFunctionComponent<UserChipLoaderProps> = ({
  user,
  onSubmit,
  keyInUserObject,
  queryToUse,
}: UserChipLoaderProps) => {
  const { t } = useTranslation()
  const { displayError } = useErrorHandling()
  const { loading, data, error } = useQuery(queryToUse)
  const [updateUser, { loading: updateUserLoading, error: updateUserError }] =
    useMutation<UpdateAuthenticatedUserResponse>(updateUserMutation)

  const [filterString, setFilterString] = useState<string>('')
  const [saved, setSaved] = useState(false)

  const availableTerms = useMemo(() => data?.[keyInUserObject]?.data || [], [data, keyInUserObject]) as Term[]
  const [selectedTerms, setSelectedTerms] = useState<Term[]>(
    user ? (user[keyInUserObject as keyof typeof user] as Term[]) : []
  )
  const sortedAndFilteredTerms = getSortedAndFilteredTemrs(availableTerms, selectedTerms, filterString)

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
      setSaved(true)
      onSubmit?.(data.updateAuthenticatedUser)
    }
  }, [keyInUserObject, onSubmit, selectedTerms, updateUser])

  if (error) {
    logError(error, `[UserChipLoader.tsx] ${error.message}`)
  }

  if (updateUserError) {
    displayError(updateUserError)
  }

  const notificationComponent = user ? null : (
    <View style={styles.notification}>
      <HoliText>{t('user.profileView.noUser')}</HoliText>
    </View>
  )

  return (
    <HoliModalContentWrapper
      actionButtonText={t('user.profileForm.save')}
      onActionButtonPress={submit}
      headlineText={t(`user.${keyInUserObject}.form.headline`)}
      prependChildren={notificationComponent}
      hideFooterWhenKeyboardIsOpen={true}
      style={styles.modalWrapper}
      loading={loading || updateUserLoading || saved}
      testID="user-profile-chipform"
    >
      <UserChipForm
        filterString={filterString}
        onFilterStringChange={setFilterString}
        terms={sortedAndFilteredTerms}
        onTermSelect={onTermSelect}
        keyInUserObject={keyInUserObject}
      />
    </HoliModalContentWrapper>
  )
}

export default UserChipLoader

const styles = StyleSheet.create({
  modalWrapper: {
    flex: 1,
  },
  notification: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    zIndex: 10,
    backgroundColor: colors.background10,
  },
})

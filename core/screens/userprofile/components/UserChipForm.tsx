import { useMutation } from '@apollo/client'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { displayError } from '@holi/core/errors/helpers'
import {
  UpdateAuthenticatedUserInput,
  UpdateAuthenticatedUserResponse,
  updateUserMutation,
} from '@holi/core/screens/userprofile/queries'
import type { Term, User } from '@holi/core/screens/userprofile/types'
import { termsByTitleComparator } from '@holi/core/screens/userprofile/types'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliChip from '@holi/ui/components/molecules/HoliChip'
import HoliChipRow from '@holi/ui/components/molecules/HoliChipRow'
import HoliModalContentWrapper from '@holi/ui/components/molecules/HoliModalContentWrapper'
import HoliTextInput from '@holi/ui/components/molecules/HoliTextInput'
import { colors } from '@holi/ui/styles/globalVars'

type UserChipFormProps = {
  user: User
  onCancel?: () => void
  onSubmit?: (user: User) => void
  keyInUserObject: string
  availableTerms: Term[]
  sortByTranslation?: boolean
}

const UserChipForm: React.VoidFunctionComponent<UserChipFormProps> = ({
  user,
  onSubmit,
  keyInUserObject,
  availableTerms,
}: UserChipFormProps) => {
  const [updateUser, { loading, error }] = useMutation<UpdateAuthenticatedUserResponse>(updateUserMutation)
  const [selectedTerms, setSelectedTerms] = useState<Term[]>(
    user ? (user[keyInUserObject as keyof typeof user] as Term[]) : []
  )
  const [filterString, setFilterString] = useState<string>('')
  const [orderedTerms, setOrderedTerms] = useState<Term[]>([])
  const [filteredTerms, setFilteredTerms] = useState<Term[]>([])
  const [saved, setSaved] = useState(false)

  const { t } = useTranslation()

  useEffect(() => {
    /*
    We need to determine the right order when opening the layer:
    * currently selected items go to the top, alphabetically sorted by translation
    * currently unselected items go below, alphabetically sorted by translation
    This order is kept until the selection process is done and the layer is closed.
    */
    const unselectedTerms = availableTerms.filter((term) => !selectedTerms.find((t) => t.id === term.id))
    setOrderedTerms([...selectedTerms.sort(termsByTitleComparator), ...unselectedTerms.sort(termsByTitleComparator)])
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(
    () =>
      setFilteredTerms(
        filterString === ''
          ? orderedTerms
          : orderedTerms.filter((term: Term) => term.title.toLowerCase().includes(filterString.toLowerCase()))
      ),
    [orderedTerms, filterString]
  )

  const styles = getStyles()

  const submit = async () => {
    const input: UpdateAuthenticatedUserInput = {} as UpdateAuthenticatedUserInput
    ;(input as any)[keyInUserObject] = selectedTerms.map((value: Term) => value.id) // eslint-disable-line @typescript-eslint/no-explicit-any

    const result = await updateUser({ variables: { input } })
    if (!error && result.data) {
      setSaved(true)
      onSubmit && onSubmit(result.data.updateAuthenticatedUser)
    }
  }

  let notificationComponent: React.ReactNode | null = null

  if (!user) {
    notificationComponent = (
      <View style={styles.notification}>
        <HoliText>{t('user.profileView.noUser')}</HoliText>
      </View>
    )
  }

  if (error) {
    displayError(error, t('user.profileForm.error.saving'))
  }

  const updateValues = (term: Term) => {
    if (selectedTerms.includes(term)) {
      // remove the value
      setSelectedTerms((previousTerms: Term[]) => previousTerms.filter((previousTerm) => previousTerm !== term))
    } else {
      // add the value
      setSelectedTerms((previousTerms: Term[]) => [...previousTerms, term])
    }
  }

  return (
    <HoliModalContentWrapper
      actionButtonText={t('user.profileForm.save')}
      onActionButtonPress={submit}
      headlineText={t(`user.${keyInUserObject}.form.headline`)}
      prependChildren={notificationComponent}
      style={styles.modalWrapper}
      loading={loading || saved}
      testID="user-profile-chipform"
    >
      <View style={styles.mainContainer}>
        <HoliText style={styles.subline}>{t(`user.${keyInUserObject}.form.subline`)}</HoliText>

        <HoliTextInput
          accessibilityLabel={t(`profile.${keyInUserObject}.filter.placeholder`)}
          value={filterString}
          placeholder={t(`profile.${keyInUserObject}.filter.placeholder`)}
          onChange={(text: string) => setFilterString(text)}
          trailingIcon="search"
          style={styles.input}
        />

        <HoliChipRow editable={false} editButtonLabel="">
          {
            /** FIXME convert to VirtualizedList, FlatList or SectionList */
            filteredTerms.map((term: Term) => {
              return (
                <HoliChip
                  key={term.id}
                  checked={selectedTerms.includes(term)}
                  onPress={() => updateValues(term)}
                  text={term.title}
                  label={term.title}
                  style={styles.chip}
                />
              )
            })
          }
        </HoliChipRow>

        {filteredTerms.length === 0 && (
          <HoliText style={styles.subline}>{t(`profile.${keyInUserObject}.filter.empty`)}</HoliText>
        )}
      </View>
    </HoliModalContentWrapper>
  )
}

const getStyles = () =>
  StyleSheet.create({
    modalWrapper: {
      flex: 1,
    },
    mainContainer: {
      marginHorizontal: 24,
    },
    notification: {
      ...StyleSheet.absoluteFillObject,
      alignItems: 'center',
      justifyContent: 'center',
      marginHorizontal: 16,
      zIndex: 10,
      backgroundColor: colors.backgroundColorWhite,
    },
    scrollViewContent: {
      paddingHorizontal: 16,
      alignItems: 'center',
      paddingBottom: 150,
    },
    headline: {
      marginBottom: 16,
    },
    subline: {
      marginBottom: 16,
    },
    input: {
      marginBottom: 16,
    },
    chip: {
      marginRight: 8,
      marginBottom: 8,
    },
  })

export default UserChipForm

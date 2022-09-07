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
import type { User, UserChipGeneric } from '@holi/core/screens/userprofile/types'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliChip from '@holi/ui/components/molecules/HoliChip'
import HoliChipRow from '@holi/ui/components/molecules/HoliChipRow'
import HoliModalContentWrapper from '@holi/ui/components/molecules/HoliModalContentWrapper'
import HoliTextInput from '@holi/ui/components/molecules/HoliTextInput'
import { colors } from '@holi/ui/styles/globalVars'

import { ChipValueWithTranslation, toValuesWithTranslation } from './userChipHelper'

type UserChipFormProps = {
  user: User
  onCancel?: () => void
  onSubmit?: (user: User) => void
  typeMetadata: UserChipGeneric<any> // eslint-disable-line @typescript-eslint/no-explicit-any
  sortByTranslation?: boolean
}

const UserChipForm: React.VoidFunctionComponent<UserChipFormProps> = ({
  onSubmit,
  typeMetadata,
  sortByTranslation = true,
  user,
}) => {
  const [updateUser, { loading, error }] = useMutation<UpdateAuthenticatedUserResponse>(updateUserMutation)
  const [values, setValues] = useState(
    user ? (user[typeMetadata.keyInUserObject as keyof typeof user] as string[]) : []
  )
  const [filterString, setFilterString] = useState<string>('')
  const [orderedValues, setOrderedValues] = useState<ChipValueWithTranslation[]>([])
  const [filteredValues, setFilteredValues] = useState<ChipValueWithTranslation[]>([])
  const [saved, setSaved] = useState(false)

  const { t } = useTranslation()

  useEffect(() => {
    /*
    We need to determine the right order when opening the layer:
    * currently selected items go to the top, alphabetically sorted by translation
    * currently unselected items go below, alphabetically sorted by translation
    This order is kept until the selection process is done and the layer is closed.
    */
    const unselectedValues = typeMetadata.allValues.filter((value) => !values.includes(value))
    setOrderedValues([
      ...toValuesWithTranslation(typeMetadata, values, t, sortByTranslation),
      ...toValuesWithTranslation(typeMetadata, unselectedValues, t, sortByTranslation),
    ])
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(
    () =>
      setFilteredValues(
        filterString === ''
          ? orderedValues
          : orderedValues.filter(({ t: label }) => label.toLowerCase().includes(filterString.toLowerCase()))
      ),
    [orderedValues, filterString]
  )

  const styles = getStyles()

  const submit = async () => {
    const input: UpdateAuthenticatedUserInput = {} as UpdateAuthenticatedUserInput
    ;(input as any)[typeMetadata.keyInUserObject] = values // eslint-disable-line @typescript-eslint/no-explicit-any

    const result = await updateUser({ variables: { input } })
    if (!error && result.data) {
      setSaved(true)
      onSubmit && onSubmit(result.data.authenticatedUser)
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

  if (loading || saved) {
    notificationComponent = (
      <View
        style={styles.notification}
        testID={['user-profile-chipform', typeMetadata.keyInUserObject, 'saving'].join('-')}
      >
        <HoliText>{t('user.profileForm.saving')}</HoliText>
      </View>
    )
  }

  if (error) {
    displayError(error, t('user.profileForm.error.saving'))
  }

  const updateValues = (value: string) => {
    if (values.includes(value)) {
      // remove the value
      setValues((previous) => previous.filter((previousName) => previousName !== value))
    } else {
      // add the value
      setValues((previous) => [...previous, value])
    }
  }

  return (
    <HoliModalContentWrapper
      actionButtonText={t('user.profileForm.save')}
      onActionButtonPress={submit}
      headlineText={t(`user.${typeMetadata.keyInUserObject}.form.headline`)}
      prependChildren={notificationComponent}
      testID="user-profile-chipform"
    >
      <View style={styles.mainContainer}>
        <HoliText style={styles.subline}>{t(`user.${typeMetadata.keyInUserObject}.form.subline`)}</HoliText>

        <HoliTextInput
          accessibilityLabel={t(`profile.${typeMetadata.keyInUserObject}.filter.placeholder`)}
          value={filterString}
          placeholder={t(`profile.${typeMetadata.keyInUserObject}.filter.placeholder`)}
          onChange={(text) => setFilterString(text)}
          trailingIcon="search"
          style={styles.input}
        />

        <HoliChipRow editable={false} editButtonLabel="">
          {filteredValues.map(({ value, t }) => {
            return (
              <HoliChip
                key={value}
                checked={values.includes(value)}
                onPress={() => updateValues(value)}
                text={t}
                label={t}
                style={styles.chip}
              />
            )
          })}
        </HoliChipRow>

        {filteredValues.length === 0 && (
          <HoliText style={styles.subline}>{t(`profile.${typeMetadata.keyInUserObject}.filter.empty`)}</HoliText>
        )}
      </View>
    </HoliModalContentWrapper>
  )
}

const getStyles = () =>
  StyleSheet.create({
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

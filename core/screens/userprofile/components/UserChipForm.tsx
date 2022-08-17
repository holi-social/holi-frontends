import { useMutation } from '@apollo/client'
import React, { useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, StyleSheet, View } from 'react-native'

import useErrorHandling from '@holi/core/errors/useErrorHandling'
import { UserContext } from '@holi/core/screens/userprofile/UserContextProvider'
import {
  UpdateAuthenticatedUserInput,
  UpdateAuthenticatedUserResponse,
  updateUserMutation,
} from '@holi/core/screens/userprofile/queries'
import type { User, UserChipGeneric } from '@holi/core/screens/userprofile/types'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliChip from '@holi/ui/components/molecules/HoliChip'
import HoliChipRow from '@holi/ui/components/molecules/HoliChipRow'

import { ChipValueWithTranslation, toValuesWithTranslation } from './userChipHelper'

type UserChipFormProps = {
  onCancel?: () => void
  onSubmit?: (user: User) => void
  typeMetadata: UserChipGeneric<any> // eslint-disable-line @typescript-eslint/no-explicit-any
  sortByTranslation?: boolean
}

const UserChipForm: React.VoidFunctionComponent<UserChipFormProps> = ({
  onSubmit,
  typeMetadata,
  sortByTranslation = true,
}) => {
  const { user } = useContext(UserContext)
  const [updateUser, { loading, error }] = useMutation<UpdateAuthenticatedUserResponse>(updateUserMutation)
  const [values, setValues] = useState(
    user ? (user[typeMetadata.keyInUserObject as keyof typeof user] as string[]) : []
  )
  const [orderedValues, setOrderedValues] = useState<ChipValueWithTranslation[]>([])
  const [saved, setSaved] = useState(false)

  const { displayError } = useErrorHandling()
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

  if (!user) {
    return (
      <View style={styles.wrapper}>
        <HoliText>{t('user.profileView.noUser')}</HoliText>
      </View>
    )
  }

  if (loading || saved) {
    return (
      <View style={styles.wrapper} testID={['user-profile-chipform', typeMetadata.keyInUserObject, 'saving'].join('-')}>
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
    <View style={styles.wrapper}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <HoliHeading style={styles.headline}>{t(`user.${typeMetadata.keyInUserObject}.form.headline`)}</HoliHeading>
        <HoliText style={styles.subline}>{t(`user.${typeMetadata.keyInUserObject}.form.subline`)}</HoliText>
        <HoliChipRow editable={false}>
          {orderedValues.map(({ value, t }) => {
            return (
              <HoliChip
                key={value}
                checked={values.includes(value)}
                onPress={() => updateValues(value)}
                text={t}
                style={styles.chip}
              ></HoliChip>
            )
          })}
        </HoliChipRow>
      </ScrollView>
      <HoliButton
        style={styles.saveButton}
        label={t('user.profileForm.save')}
        onPress={submit}
        testID={['user-profile-chipform', typeMetadata.keyInUserObject, 'save'].join('-')}
      >
        {t('user.profileForm.save')}
      </HoliButton>
    </View>
  )
}

const getStyles = () =>
  StyleSheet.create({
    wrapper: {
      alignItems: 'center',
      flexDirection: 'column',
      maxWidth: 600,
      paddingHorizontal: 16,
      paddingTop: 0,
      width: '100%',
      height: '100%',
      alignSelf: 'center',
    },
    scrollViewContent: {
      paddingHorizontal: 16,
      alignItems: 'center',
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      paddingBottom: 150,
    },
    headline: {
      marginBottom: 16,
    },
    subline: {
      marginBottom: 17,
    },
    chip: {
      marginRight: 8,
      marginBottom: 8,
    },
    saveButton: {
      bottom: 70,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  })

export default UserChipForm

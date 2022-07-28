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
import type { User, UserInterest } from '@holi/core/screens/userprofile/types'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliChip from '@holi/ui/components/molecules/HoliChip'
import HoliChipRow from '@holi/ui/components/molecules/HoliChipRow'

type UserChipFormProps = {
  onCancel?: () => void
  onSubmit?: (user: User) => void
  allInterests: UserInterest[]
}

type InterestWithTranslation = { name: UserInterest; t: string }

const UserChipForm: React.VoidFunctionComponent<UserChipFormProps> = ({ onSubmit, allInterests }) => {
  const { user } = useContext(UserContext)
  const [updateUser, { loading, error }] = useMutation<UpdateAuthenticatedUserResponse>(updateUserMutation)
  const [interests, setInterests] = useState(user?.interests || [])
  const [orderedInterests, setOrderedInterests] = useState<InterestWithTranslation[]>([])
  const { displayError } = useErrorHandling()
  const { t } = useTranslation()
  useEffect(() => {
    /*
    We need to determine the right order when opening the layer:
    * currently selected items go to the top, alphabetically sorted by translation
    * currently unselected items go below, alphabetically sorted by translation
    This order is kept until the selection process is done and the layer is closed.
    */
    const toInterestWithTranslation = (interests: UserInterest[]) =>
      interests.map((i) => ({ name: i, t: t(`user.interests.${i}`) })).sort((a, b) => a.t.localeCompare(b.t))
    const unselectedInterests = allInterests.filter((value) => !interests.includes(value as UserInterest))
    setOrderedInterests([...toInterestWithTranslation(interests), ...toInterestWithTranslation(unselectedInterests)])
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const styles = getStyles()

  const submit = async () => {
    const input: UpdateAuthenticatedUserInput = {
      ...(interests && { interests }),
    }

    const result = await updateUser({ variables: { input } })
    if (!error && result.data && onSubmit) {
      onSubmit(result.data.authenticatedUser)
    }
  }

  if (!user) {
    return (
      <View style={styles.wrapper}>
        <HoliText>{t('user.profileView.noUser')}</HoliText>
      </View>
    )
  }

  if (loading) {
    return (
      <View style={styles.wrapper}>
        <HoliText>{t('user.profileForm.saving')}</HoliText>
      </View>
    )
  }

  if (error) {
    displayError(error, t('user.profileForm.error.saving'))
  }

  const updateInterests = (interest: UserInterest) => {
    if (interests.includes(interest)) {
      // remove the interest
      setInterests((previous) => previous.filter((previousName) => previousName !== interest))
    } else {
      // add the interest
      setInterests((previous) => [...previous, interest])
    }
  }
  return (
    <View style={styles.wrapper}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <HoliHeading style={styles.headline}>{t('user.interests.form.headline')}</HoliHeading>
        <HoliText style={styles.subline}>{t('user.interests.form.subline')}</HoliText>
        <HoliChipRow editable={false}>
          {orderedInterests.map(({ name, t }) => {
            return (
              <HoliChip
                key={name}
                checked={interests.includes(name)}
                onPress={() => updateInterests(name)}
                text={t}
                style={styles.chip}
              ></HoliChip>
            )
          })}
        </HoliChipRow>
      </ScrollView>
      <HoliButton style={styles.saveButton} label={t('user.profileForm.save')} onPress={submit}>
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
      padding: 16,
      paddingTop: 0,
      width: '100%',
      height: '100%',
      alignSelf: 'center',
    },
    scrollView: {
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
      position: 'absolute',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  })

export default UserChipForm

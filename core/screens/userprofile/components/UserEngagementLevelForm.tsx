import { useMutation } from '@apollo/client'
import React, { useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native'

import useErrorHandling from '@holi/core/errors/useErrorHandling'
import { UserContext } from '@holi/core/screens/userprofile/UserContextProvider'
import {
  UpdateAuthenticatedUserInput,
  UpdateAuthenticatedUserResponse,
  updateUserMutation,
} from '@holi/core/screens/userprofile/queries'
import type { User } from '@holi/core/screens/userprofile/types'
import HoliButton from '@holi/ui/components/HoliButton'
import HoliText from '@holi/ui/components/HoliText'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

type UserEngagementLevelFormProps = {
  onCancel?: () => void
  onSubmit?: (user: User) => void
  buttonsRelativeHeight?: number
}

const UserEngagementLevelForm: React.VoidFunctionComponent<UserEngagementLevelFormProps> = ({
  onSubmit,
  buttonsRelativeHeight = 0.35,
}) => {
  const { user } = useContext(UserContext)
  const [updateUser, { loading, error }] = useMutation<UpdateAuthenticatedUserResponse>(updateUserMutation)
  const [engagementLevel, setEngagementLevel] = useState(user?.engagementLevel || 'interested')
  const { displayError } = useErrorHandling()
  const { t } = useTranslation()

  const { height: deviceHeight } = useWindowDimensions()
  const { theme } = useTheme()
  const styles = getStyles(theme, buttonsRelativeHeight * deviceHeight)

  const submit = async () => {
    const input: UpdateAuthenticatedUserInput = {
      ...(engagementLevel && { engagementLevel }),
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

  const ActiveButtonIcon = (
    <View
      style={{
        width: 50,
        height: 50,
        borderWidth: 2,
        borderRadius: 100,
        backgroundColor: theme.colors.backgroundColorYellow,
        position: 'relative',
        alignSelf: 'flex-end',
        marginRight: 8,
        bottom: -2,
      }}
    >
      <HoliText
        style={{
          fontSize: 20,
          position: 'absolute',
          top: 12,
          right: 14,
          transform: [{ rotate: '80deg' }],
        }}
      >
        : )
      </HoliText>
    </View>
  )

  return (
    <View style={styles.wrapper}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <HoliText style={styles.title}>{t('user.engagementLevel.form.question')}</HoliText>
        <View style={styles.buttonsContainer}>
          <View style={styles.buttonContainer}>
            {engagementLevel === 'interested' && ActiveButtonIcon}
            <HoliButton
              label={t('user.engagementLevel.title.interested')}
              transparent
              onPress={() => setEngagementLevel('interested')}
            >
              <View style={[styles.button, ...(engagementLevel === 'interested' ? [styles.activeButton] : [])]}></View>
            </HoliButton>
          </View>
          <View style={[styles.buttonContainer, { marginHorizontal: 10 }]}>
            {engagementLevel === 'engaged' && ActiveButtonIcon}
            <HoliButton
              label={t('user.engagementLevel.title.engaged')}
              transparent
              onPress={() => setEngagementLevel('engaged')}
            >
              <View
                style={[styles.button, styles.button2, ...(engagementLevel === 'engaged' ? [styles.activeButton] : [])]}
              ></View>
            </HoliButton>
          </View>
          <View style={styles.buttonContainer}>
            {engagementLevel === 'initiator' && ActiveButtonIcon}
            <HoliButton
              label={t('user.engagementLevel.title.initiator')}
              transparent
              onPress={() => setEngagementLevel('initiator')}
            >
              <View
                style={[
                  styles.button,
                  styles.button3,
                  ...(engagementLevel === 'initiator' ? [styles.activeButton] : []),
                ]}
              ></View>
            </HoliButton>
          </View>
        </View>
        <View style={{ marginTop: 32, width: '100%' }}>
          <HoliText style={{ textAlign: 'center' }}>
            {t(`user.engagementLevel.description.${engagementLevel}`)}
          </HoliText>
        </View>
      </ScrollView>
      <HoliButton style={styles.saveButton} label={t('user.profileForm.save')} onPress={submit}>
        {t('user.profileForm.save')}
      </HoliButton>
    </View>
  )
}

const getStyles = (theme: HoliTheme, buttonsContainerHeight: number) =>
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
    title: {
      fontSize: 28,
      fontWeight: '500',
      lineHeight: 34,
    },
    buttonsContainer: {
      marginTop: 60,
      width: '100%',
      height: buttonsContainerHeight,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
    },
    buttonContainer: {
      flex: 1,
    },
    activeButton: {
      backgroundColor: theme.colors.backgroundColorYellow,
    },
    button: {
      borderWidth: 2,
      borderRadius: 40,
      height: 0.3 * buttonsContainerHeight,
    },
    button2: {
      height: 0.6 * buttonsContainerHeight,
    },
    button3: {
      height: buttonsContainerHeight,
    },
    saveButton: {
      bottom: 70,
      position: 'absolute',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  })

export default UserEngagementLevelForm

import { useMutation } from '@apollo/client'
import React, { useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native'

import useErrorHandling from '@holi/core/errors/useErrorHandling'
import { UserContext } from '@holi/core/user/UserContextProvider'
import {
  UpdateAuthenticatedUserInput,
  UpdateAuthenticatedUserResponse,
  updateUserMutation,
} from '@holi/core/user/queries'
import { User } from '@holi/core/user/types'
import HoliButton from '@holi/ui/components/HoliButton'
import HoliText from '@holi/ui/components/HoliText'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

enum ENGAGEMENT_LEVELS {
  INTERESTED = 'INTERESTED',
  ENGAGED = 'ENGAGED',
  INITIATOR = 'INITIATOR',
}

type UserEngagementLevelFormProps = {
  onCancel?: () => void
  onSubmit?: (user: User) => void
  buttonsRelativeHeight?: number
}

const UserEngagementLevelForm: React.VoidFunctionComponent<UserEngagementLevelFormProps> = ({
  onCancel,
  onSubmit,
  buttonsRelativeHeight = 0.35,
}) => {
  const { user } = useContext(UserContext)
  const [updateUser, { loading, error }] = useMutation<UpdateAuthenticatedUserResponse>(updateUserMutation)
  const [engagementLevel, setEngagementLevel] = useState(user?.engagementLevel || ENGAGEMENT_LEVELS.INTERESTED)
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
            {engagementLevel === ENGAGEMENT_LEVELS.INTERESTED && ActiveButtonIcon}
            <HoliButton
              label={t('user.engagementLevel.title.interested')}
              transparent
              onPress={() => setEngagementLevel(ENGAGEMENT_LEVELS.INTERESTED)}
            >
              <View
                style={[
                  styles.button,
                  ...(engagementLevel === ENGAGEMENT_LEVELS.INTERESTED ? [styles.activeButton] : []),
                ]}
              ></View>
            </HoliButton>
          </View>
          <View style={[styles.buttonContainer, { marginHorizontal: 10 }]}>
            {engagementLevel === ENGAGEMENT_LEVELS.ENGAGED && ActiveButtonIcon}
            <HoliButton
              label={t('user.engagementLevel.title.engaged')}
              transparent
              onPress={() => setEngagementLevel(ENGAGEMENT_LEVELS.ENGAGED)}
            >
              <View
                style={[
                  styles.button,
                  styles.button2,
                  ...(engagementLevel === ENGAGEMENT_LEVELS.ENGAGED ? [styles.activeButton] : []),
                ]}
              ></View>
            </HoliButton>
          </View>
          <View style={styles.buttonContainer}>
            {engagementLevel === ENGAGEMENT_LEVELS.INITIATOR && ActiveButtonIcon}
            <HoliButton
              label={t('user.engagementLevel.title.initiator')}
              transparent
              onPress={() => setEngagementLevel(ENGAGEMENT_LEVELS.INITIATOR)}
            >
              <View
                style={[
                  styles.button,
                  styles.button3,
                  ...(engagementLevel === ENGAGEMENT_LEVELS.INITIATOR ? [styles.activeButton] : []),
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

export { UserEngagementLevelForm }

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

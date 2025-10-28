import { useMutation } from '@apollo/client/react'
import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View, useWindowDimensions } from 'react-native'

import { authenticatedUserV2Query } from '@holi/core/domain/shared/queries'
import { User } from '@holi/core/domain/shared/types'
import { useErrorHandling } from '@holi/core/errors/hooks'
import {
  UpdateAuthenticatedUserInput,
  UpdateAuthenticatedUserV2Response,
  updateAuthenticatedUserV2Mutation,
} from '@holi/core/screens/userprofile/queries'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Smiley } from '@holi/icons/src/generated'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliModalContentWrapper from '@holi/ui/components/molecules/HoliModalContentWrapper'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

enum EngagementLevel {
  INTERESTED = 'INTERESTED',
  ENGAGED = 'ENGAGED',
  INITIATOR = 'INITIATOR',
}

type UserEngagementLevelFormProps = {
  user: User
  onCancel?: () => void
  onSubmit?: (user: User) => void
  buttonsRelativeHeight?: number
}

const UserEngagementLevelForm: React.VoidFunctionComponent<UserEngagementLevelFormProps> = ({
  onSubmit,
  user,
  buttonsRelativeHeight = 0.35,
}) => {
  const [updateUser, { loading, error }] = useMutation<UpdateAuthenticatedUserV2Response>(
    updateAuthenticatedUserV2Mutation,
    {
      onError: (error) =>
        displayError(error, 'Failed to update user', {
          location: 'UserEngagementLevelForm.updateUser',
        }),
    }
  )
  const [engagementLevel, setEngagementLevel] = useState(user?.engagementLevel || EngagementLevel.INTERESTED)
  const { t } = useTranslation()
  const { displayError } = useErrorHandling()

  const { height: deviceHeight } = useWindowDimensions()
  const buttonsContainerHeight = buttonsRelativeHeight * deviceHeight
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(buttonsContainerHeight, theme), [buttonsContainerHeight, theme])

  const submit = async () => {
    const input: UpdateAuthenticatedUserInput = {
      ...(engagementLevel && { engagementLevel }),
    }

    const result = await updateUser({
      variables: { input },
      refetchQueries: [{ query: authenticatedUserV2Query, fetchPolicy: 'network-only' }],
    })
    if (!error && result.data && onSubmit) {
      onSubmit(result.data.updateAuthenticatedUserV2)
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

  const ActiveButtonIcon = (
    <View style={styles.activeButtonIcon}>
      <HoliIcon icon={Smiley} />
    </View>
  )

  return (
    <HoliModalContentWrapper
      actionButtonText={t('user.profileForm.save')}
      onActionButtonPress={submit}
      headlineText={t('user.engagementLevel.form.question')}
      prependChildren={notificationComponent}
      hideFooterWhenKeyboardIsOpen={true}
      loading={loading}
      style={styles.wrapper}
    >
      <View style={styles.mainContainer}>
        <View style={styles.buttonsContainer}>
          <View style={styles.buttonContainer}>
            {engagementLevel === EngagementLevel.INTERESTED && ActiveButtonIcon}
            <HoliButton
              label={t('user.engagementLevel.title.INTERESTED')}
              transparent
              onPress={() => setEngagementLevel(EngagementLevel.INTERESTED)}
            >
              <View
                style={[
                  styles.button,
                  ...(engagementLevel === EngagementLevel.INTERESTED ? [styles.activeButton] : []),
                ]}
              />
            </HoliButton>
          </View>

          <View style={[styles.buttonContainer, { marginHorizontal: 10 }]}>
            {engagementLevel === EngagementLevel.ENGAGED && ActiveButtonIcon}
            <HoliButton
              label={t('user.engagementLevel.title.ENGAGED')}
              transparent
              onPress={() => setEngagementLevel(EngagementLevel.ENGAGED)}
            >
              <View
                style={[
                  styles.button,
                  styles.button2,
                  ...(engagementLevel === EngagementLevel.ENGAGED ? [styles.activeButton] : []),
                ]}
              />
            </HoliButton>
          </View>

          <View style={styles.buttonContainer}>
            {engagementLevel === EngagementLevel.INITIATOR && ActiveButtonIcon}
            <HoliButton
              label={t('user.engagementLevel.title.INITIATOR')}
              transparent
              onPress={() => setEngagementLevel(EngagementLevel.INITIATOR)}
            >
              <View
                style={[
                  styles.button,
                  styles.button3,
                  ...(engagementLevel === EngagementLevel.INITIATOR ? [styles.activeButton] : []),
                ]}
              />
            </HoliButton>
          </View>
        </View>

        <View style={{ marginTop: 32, width: '100%' }}>
          <HoliText style={{ textAlign: 'center' }}>
            {t(`user.engagementLevel.description.${engagementLevel}`)}
          </HoliText>
        </View>
      </View>
    </HoliModalContentWrapper>
  )
}

const getStyles = (buttonsContainerHeight: number, theme: HoliTheme) =>
  StyleSheet.create({
    wrapper: {
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
      backgroundColor: theme.colors.background10,
    },
    buttonsContainer: {
      marginTop: 60,
      width: '100%',
      height: buttonsContainerHeight,
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
    },
    buttonContainer: {
      flex: 1,
    },
    activeButton: {
      backgroundColor: theme.colors.brandColorA30,
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
    activeButtonIcon: {
      width: 50,
      height: 50,
      borderWidth: 2,
      borderRadius: 100,
      backgroundColor: theme.colors.brandColorA30,
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'flex-end',
      marginRight: 8,
      bottom: -2,
    },
  })

export default UserEngagementLevelForm

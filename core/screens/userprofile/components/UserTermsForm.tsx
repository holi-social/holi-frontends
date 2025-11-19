import React, { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import HoliBox from '@holi/ui/components/atoms/HoliBox'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliModalContentWrapper from '@holi/ui/components/molecules/HoliModalContentWrapper'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { TermsInput } from '@holi/core/components/TermsInput'
import type { TermType, User } from '@holi/core/domain/shared/types'
import type { UpdateAuthenticatedUserInput } from '@holi/api/graphql/graphql-codegen'
import {
  updateAuthenticatedUserV2Mutation,
  type UpdateAuthenticatedUserV2Response,
} from '@holi/core/screens/userprofile/queries'
import { useMutation } from '@apollo/client/react'
import { authenticatedUserV2Query } from '@holi/core/domain/shared/queries'
import { useErrorHandling } from '@holi/core/errors/hooks'

interface UserTermsFormProps {
  user?: User | null
  onSubmit?: (user: User) => void
  termType: TermType
}

export const UserTermsForm = ({ user, onSubmit, termType }: UserTermsFormProps) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { displayError } = useErrorHandling()
  const styles = useMemo(() => getStyles(theme), [theme])
  const i18nKey = termType === 'topic' ? 'interests' : 'skills'
  const keyInUserObject = termType === 'topic' ? 'interestsV2' : 'skillsV2'
  const [selectedTerms, setSelectedTerms] = useState<string[]>([
    ...((termType === 'topic' ? user?.interestsV2 : user?.skillsV2) || []),
  ])

  const [updateUser, { loading: updateUserLoading }] = useMutation<UpdateAuthenticatedUserV2Response>(
    updateAuthenticatedUserV2Mutation,
    {
      onError: (error) =>
        displayError(error, 'Failed to update user', {
          location: 'UserTermsForm',
          field: keyInUserObject,
        }),
    }
  )

  const notificationComponent = user ? null : (
    <View style={styles.notification}>
      <HoliText>{t('user.profileView.noUser')}</HoliText>
    </View>
  )

  const submitHandler = useCallback(async () => {
    const input = {} as UpdateAuthenticatedUserInput
    input[keyInUserObject] = selectedTerms

    const { data } = await updateUser({
      variables: { input },
      refetchQueries: [{ query: authenticatedUserV2Query, fetchPolicy: 'network-only' }],
    })

    if (data) {
      onSubmit?.(data.updateAuthenticatedUserV2)
    }
  }, [keyInUserObject, onSubmit, selectedTerms, updateUser])

  return (
    <HoliModalContentWrapper
      actionButtonText={t('user.profileForm.save')}
      onActionButtonPress={submitHandler}
      headlineText={t(`user.${i18nKey}.form.headline`)}
      prependChildren={notificationComponent}
      hideFooterWhenKeyboardIsOpen={true}
      style={styles.modalWrapper}
      loading={updateUserLoading}
      testID="user-profile-chipform"
    >
      <HoliBox padding={[0, 24]}>
        <TermsInput
          description={t(`onboarding.${i18nKey}.subline`)}
          searchPlaceholder={t(`onboarding.${i18nKey}.inputPlaceholder`)}
          onSelect={setSelectedTerms}
          selected={selectedTerms}
          termType={termType}
        />
      </HoliBox>
    </HoliModalContentWrapper>
  )
}

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    modalWrapper: {
      flex: 1,
    },
    notification: {
      ...StyleSheet.absoluteFillObject,
      alignItems: 'center',
      justifyContent: 'center',
      marginHorizontal: 16,
      zIndex: 10,
      backgroundColor: theme.colors.background10,
    },
  })

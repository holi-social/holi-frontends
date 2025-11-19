import { useMutation } from '@apollo/client/react'
import type React from 'react'
import { useCallback, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, type ScrollView, StyleSheet, View } from 'react-native'

import type { User } from '@holi/core/domain/shared/types'
import { type FieldError, isMaliciousUrlError } from '@holi/core/errors/helpers'
import { type TranslatedFieldErrors, useFieldErrors } from '@holi/core/errors/hooks'
import {
  type UpdateAuthenticatedUserInput,
  UpdateAuthenticatedUserInputSchema,
  type UpdateAuthenticatedUserV2Response,
  updateAuthenticatedUserV2Mutation,
} from '@holi/core/screens/userprofile/queries'
import HoliModalContentWrapper from '@holi/ui/components/molecules/HoliModalContentWrapper'
import HoliTextInput from '@holi/ui/components/molecules/HoliTextInput'
import { HoliToastType, ToastProvider, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import { type Position, delayAnimation, usePositions } from '@holi/ui/helper'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'
import { Stack } from 'holi-bricks/components/stack'
import { Text } from 'holi-bricks/components/text'

type UserProfileFormProps = {
  user: User
  onCancel: () => void
  onSubmit: (user: User) => void
  testId?: string
}

const UserAboutMeForm: React.FC<UserProfileFormProps> = ({ onSubmit, user, ...props }) => {
  const { openToast } = useToast()

  const [updateUser, { loading }] = useMutation<UpdateAuthenticatedUserV2Response>(updateAuthenticatedUserV2Mutation)
  const [aboutMe, setAboutMe] = useState(user?.aboutMe ?? '')
  const [fieldErrors, setFieldErrors] = useState<TranslatedFieldErrors>({})
  const scrollViewRef = useRef<ScrollView>(null)
  const { getScrollToProps } = usePositions()
  const { t } = useTranslation()
  const { handleGraphQLError, translateFieldErrors } = useFieldErrors({
    i18nPrefix: 'user.profile',
    handledFieldErrors: ['aboutMe'],
  })

  const testID = props.testId || 'user-profile-edit-form'

  const mixins = useStyleMixins()
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])

  const resetErrorsForField = useCallback(
    (fieldName: string) =>
      setFieldErrors((currentErrors: TranslatedFieldErrors) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [fieldName]: _, ...otherErrors } = currentErrors
        return otherErrors
      }),
    []
  )

  const submit = async () => {
    const input: UpdateAuthenticatedUserInput = {
      aboutMe,
    }

    const resultSchema = UpdateAuthenticatedUserInputSchema.safeParse(input)
    if (!resultSchema.success) {
      const { fieldErrors } = resultSchema.error.flatten<FieldError>()
      setFieldErrors(translateFieldErrors(fieldErrors))
      return
    }
    await updateUser({
      variables: { input },
      onCompleted: (data) => {
        if (onSubmit) {
          onSubmit(data.updateAuthenticatedUserV2)
        }
      },
      onError: (error) => {
        if (isMaliciousUrlError(error)) {
          openToast(t('global.maliciousUrl.error'), HoliToastType.ERROR)
        } else {
          setFieldErrors(handleGraphQLError(error))
        }
      },
    })
  }

  const header = (
    <Stack alignItems="center">
      <Text size="3xl">{t('profile.about.modal.title')}</Text>
    </Stack>
  )

  const onFocus = useCallback(
    (pos: Position) => {
      const scrollTo = scrollViewRef.current?.scrollTo
      const scrollOptions = { y: pos.y, animated: true }
      if (scrollTo) delayAnimation(scrollTo, scrollOptions, 16.6667) // 10000 ms / 60 fps
    },
    [scrollViewRef]
  )

  const scrollToPropsFor = (id: string) => getScrollToProps(id, onFocus)

  return (
    <ToastProvider>
      <HoliModalContentWrapper
        actionButtonText={t('user.profileForm.save')}
        onActionButtonPress={submit}
        prependChildren={header}
        loading={loading}
        keyboardShouldPersistTaps="handled"
        hideFooterWhenKeyboardIsOpen={true}
        testID={testID}
        style={styles.wrapper}
        ref={scrollViewRef}
      >
        <View style={[mixins.container, styles.mainContainer]}>
          <HoliTextInput
            value={aboutMe}
            inputLabel={t('user.profileForm.aboutMe')}
            aria-label={t('user.profileForm.aboutMe')}
            placeholder={t('user.profileForm.aboutMePlaceholder')}
            validationErrorText={fieldErrors?.aboutMe?.join()}
            onChange={(text: string) => {
              setAboutMe(text)
              resetErrorsForField('aboutMe')
            }}
            noOfVisibleLines={5}
            maxNoOfVisibleLines={10}
            maxNoOfCharacters={3000}
            {...scrollToPropsFor('aboutme')}
            style={styles.input}
          />
        </View>
      </HoliModalContentWrapper>
    </ToastProvider>
  )
}

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    wrapper: {
      flex: 1,
    },
    mainContainer: {
      marginTop: 30,
      paddingBottom: Platform.OS === 'ios' ? 250 : 0,
    },
    headerContainer: {
      alignItems: 'center',
    },
    input: {
      marginBottom: 16,
    },
    notification: {
      ...StyleSheet.absoluteFillObject,
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10,
      backgroundColor: theme.colors.background10,
    },
  })

export default UserAboutMeForm

import { useMutation, useQuery } from '@apollo/client'
import { withProfiler } from '@sentry/react'
import * as Notifications from 'expo-notifications'
import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { type DimensionValue, Platform, StyleSheet, View } from 'react-native'

import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import { useLoginState } from '@holi/core/auth/loginState'
import PermissionsGuard, { PermissionsType } from '@holi/core/components/PermissionsGuard'
import type { Term } from '@holi/core/domain/shared/types'
import { isMaliciousUrlError } from '@holi/core/errors/helpers'
import { type TranslatedFieldErrors, useFieldErrors } from '@holi/core/errors/hooks'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import { useNotificationEligibility } from '@holi/core/screens/notifications/helpers/notificationModalHelper/notificationModalHelper'
import CreateSpaceCoverImage from '@holi/core/screens/spaces/create/components/CreateSpaceCoverImage'
import CreateSpaceName from '@holi/core/screens/spaces/create/components/CreateSpaceName'
import CreateSpaceTopics from '@holi/core/screens/spaces/create/components/CreateSpaceTopics'
import {
  type CreateSpaceResponse,
  type ValidateSpaceResponse,
  createSpaceMutation,
  validateSpaceMutation,
} from '@holi/core/screens/spaces/create/mutations'
import { type MySpacesResponse, mySpaceQuery } from '@holi/core/screens/spaces/discover/queries'
import { mockImageUploadForE2E } from '@holi/core/screens/spaces/helpers/e2e'
import SpaceTermContextProvider from '@holi/core/screens/spaces/providers/SpaceTermContextProvider'
import { Close } from '@holi/icons/src/generated'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliConfirmation from '@holi/ui/components/molecules/HoliConfirmation'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import type { HoliImageInfo } from '@holi/ui/components/organisms/HoliImagePicker/types'
import HoliWizard from '@holi/ui/components/organisms/HoliWizard/HoliWizard'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller'

const CreateSpace = () => {
  const { navigateBack } = useRouting()
  const { t } = useTranslation()
  const mixins = useStyleMixins()
  const { navigate, replaceHistory } = useRouting()
  const [spaceName, setSpaceName] = useState<string>('')
  const [spaceGoal, setSpaceGoal] = useState<string>('')
  const [spaceTopics, setSpaceTopics] = useState<Term[]>([])
  const [spaceCoverImage, setSpaceCoverImage] = useState<HoliImageInfo>()
  const [showConfirmationModal, setShowConfirmationModal] = useState(false)
  const exitConfirmationTitle = t('spaces.create.close.dialog.title')
  const [fieldErrors, setFieldErrors] = useState<TranslatedFieldErrors>({})
  const { isLoggedIn } = useLoggedInUser()
  const { handleGraphQLError } = useFieldErrors({ i18nPrefix: 'spaces', handledFieldErrors: ['title', 'description'] })
  const setScreenOptions = useSetScreenOptions()

  let hasOwnSpaces = false
  const { data: mySpacesData } = useQuery<MySpacesResponse>(mySpaceQuery, { skip: !isLoggedIn })
  const mySpaces = mySpacesData?.mySpaces || []
  hasOwnSpaces = isLoggedIn && !!(mySpaces.length > 0)

  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])
  const { openToast } = useToast()
  const { isEligible } = useNotificationEligibility()

  // FIXME: this is a dirty hack to circumvent using the file picker dialog in mobile e2e tests
  const loginState = useLoginState()
  useEffect(() => {
    if (loginState.isLoggedIn) {
      mockImageUploadForE2E(loginState.userId).then((spaceCoverImage) => {
        spaceCoverImage && setSpaceCoverImage(spaceCoverImage)
      })
    }
  }, [loginState])

  const [validateSpace] = useMutation<ValidateSpaceResponse>(validateSpaceMutation, {
    onCompleted: () => setFieldErrors({}),
    onError: (error) => {
      if (isMaliciousUrlError(error)) {
        openToast(t('global.maliciousUrl.error'), HoliToastType.ERROR)
      } else {
        setFieldErrors(handleGraphQLError(error))
      }
    },
  })
  const [createSpace] = useMutation<CreateSpaceResponse>(createSpaceMutation, {
    onCompleted: async (data) => {
      const spaceDetailsRoute = `/spaces/${data.createSpace.name}`
      await replaceHistory(spaceDetailsRoute)

      // Check if the user has already granted notification permissions
      const { status } = await Notifications.getPermissionsAsync()
      const shouldShowModal = status !== 'granted' && isEligible

      const params = new URLSearchParams()
      if (!hasOwnSpaces) {
        params.set('onboarding', 'true')
      }
      if (shouldShowModal) {
        params.set('askOptIn', 'true')
      }

      return navigate(`${spaceDetailsRoute}/edit?${params.toString()}`)
    },
    onError: (error) => {
      if (isMaliciousUrlError(error)) {
        openToast(t('global.maliciousUrl.error'), HoliToastType.ERROR)
      } else {
        setFieldErrors(handleGraphQLError(error))
      }
    },
    refetchQueries: [{ query: mySpaceQuery }],
  })

  useIsomorphicLayoutEffect(() => {
    setScreenOptions({
      animation: 'slide_from_bottom',
      headerBackVisible: false,
      headerTitleAlign: 'center',
      headerTitle: () => (
        <HoliHeading level="1" size="m">
          {t('spaces.create.title')}
        </HoliHeading>
      ),
      headerLeft: () => <HeaderBackButton icon={Close} onPress={() => setShowConfirmationModal(true)} />,
      navigationCustomOptions: {
        footerShown: false,
      },
    })
  }, [setScreenOptions, t])

  const handleNextButtonPress = async (currentStep: number) => {
    const result = await validateSpace({
      variables: {
        input: {
          title: spaceName,
          description: spaceGoal,
          topics: currentStep > 0 ? spaceTopics.map((topic) => topic.id) : undefined,
          cover: currentStep > 1 ? spaceCoverImage?.blob : undefined,
        },
      },
    })
    return result?.data?.validateSpace.success || false
  }

  const handleSubmitButtonPress = async () => {
    await createSpace({
      variables: {
        input: {
          title: spaceName,
          description: spaceGoal,
          topics: spaceTopics.map((topic) => topic.id),
          cover: spaceCoverImage?.blob,
        },
      },
    })
  }

  return (
    <PermissionsGuard permissionType={PermissionsType.AUTH} redirectRoute="/spaces">
      <SpaceTermContextProvider>
        <KeyboardAwareScrollView style={styles.wrapper} contentContainerStyle={styles.wrapper}>
          <View style={[mixins.container, styles.container]}>
            <HoliWizard
              isBackButtonAvailable={true}
              onNextPress={handleNextButtonPress}
              onSubmit={handleSubmitButtonPress}
            >
              <CreateSpaceName
                onChangeSpaceName={setSpaceName}
                onChangeSpaceGoal={setSpaceGoal}
                spaceName={spaceName}
                spaceGoal={spaceGoal}
                spaceNameErrors={fieldErrors.title}
                spaceGoalErrors={fieldErrors.description}
              />
              <CreateSpaceTopics onSelectSpaceTopics={setSpaceTopics} selectedTopics={spaceTopics} />
              <CreateSpaceCoverImage onUploadImage={setSpaceCoverImage} coverImage={spaceCoverImage} />
            </HoliWizard>
          </View>
        </KeyboardAwareScrollView>
        <HoliConfirmation
          show={showConfirmationModal}
          label={exitConfirmationTitle}
          title={exitConfirmationTitle}
          description={t('spaces.create.close.dialog.description')}
          onDismiss={() => setShowConfirmationModal(false)}
          secondaryText={t('spaces.create.close.dialog.dismiss')}
          primaryText={t('spaces.create.close.dialog.confirm')}
          testID="exit-space-creation-confirmation"
          onPrimary={() => {
            setShowConfirmationModal(false)
            navigateBack()
          }}
        />
      </SpaceTermContextProvider>
    </PermissionsGuard>
  )
}

export default withProfiler(CreateSpace, { name: 'CreateSpace' })

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    wrapper: {
      flex: 1,
      backgroundColor: theme.colors.background10,
    },
    defaultLayout: {
      backgroundColor: theme.colors.background10,
      paddingBottom: 0,
      width: '100%',
      minHeight: Platform.OS === 'web' ? ('100vh' as DimensionValue) : ('100%' as DimensionValue),
    },
    container: {
      flex: 1,
      width: '100%',
      paddingHorizontal: 0,
      ...Platform.select({
        native: {
          maxWidth: '100%',
        },
      }),
    },
  })

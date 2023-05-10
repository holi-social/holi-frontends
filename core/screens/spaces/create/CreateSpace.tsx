import { useMutation, useQuery } from '@apollo/client'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View } from 'react-native'

import { useAuth } from '@holi/core/auth/helpers/useAuth'
import { TranslatedFieldErrors, useFieldErrors } from '@holi/core/errors/hooks'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useUnifiedNavigation } from '@holi/core/navigation/hooks/useUnifiedNavigation'
import CreateSpaceCoverImage from '@holi/core/screens/spaces/create/components/CreateSpaceCoverImage'
import CreateSpaceName from '@holi/core/screens/spaces/create/components/CreateSpaceName'
import CreateSpaceTopics from '@holi/core/screens/spaces/create/components/CreateSpaceTopics'
import { mockImageUploadForE2E } from '@holi/core/screens/spaces/helpers/e2e'
import SpaceTermContextProvider from '@holi/core/screens/spaces/providers/SpaceTermContextProvider'
import {
  CreateSpaceResponse,
  MySpacesResponse,
  ValidateSpaceResponse,
  createSpaceMutation,
  mySpaceQuery,
  validateSpaceMutation,
} from '@holi/core/screens/spaces/queries'
import { Term } from '@holi/core/screens/userprofile/types'
import { useLoggedInUser } from '@holi/core/screens/userprofile/useLoggedInUser'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliConfirmation from '@holi/ui/components/molecules/HoliConfirmation'
import { ImageInfo } from '@holi/ui/components/organisms/HoliImagePicker/types'
import HoliWizard from '@holi/ui/components/organisms/HoliWizard/HoliWizard'
import { colors, vars } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

const CreateSpace: React.VFC = () => {
  const { setOptions, navigateBack } = useUnifiedNavigation()
  const { t } = useTranslation()
  const mixins = useStyleMixins()
  const { replaceRoute } = useRouting()
  const [spaceName, setSpaceName] = useState<string>('')
  const [spaceGoal, setSpaceGoal] = useState<string>('')
  const [spaceTopics, setSpaceTopics] = useState<Term[]>([])
  const [spaceCoverImage, setSpaceCoverImage] = useState<ImageInfo | undefined>()
  const [showConfirmationModal, setShowConfirmationModal] = useState(false)
  const exitConfirmationTitle = t('spaces.create.close.dialog.title')
  const [fieldErrors, setFieldErrors] = useState<TranslatedFieldErrors>({})
  const { isLoggedIn } = useLoggedInUser()
  const { handleGraphQLError } = useFieldErrors({ i18nPrefix: 'spaces', handledFieldErrors: ['title', 'description'] })

  let hasOwnSpaces = false
  const { data: mySpacesData } = useQuery<MySpacesResponse>(mySpaceQuery, { skip: !isLoggedIn })
  const mySpaces = mySpacesData?.mySpaces || []
  hasOwnSpaces = isLoggedIn && !!(mySpaces.length > 0)

  // FIXME: this is a dirty hack to circumvent using the file picker dialog in mobile e2e tests
  const { userId } = useAuth()
  useEffect(() => {
    mockImageUploadForE2E(userId).then((spaceCoverImage) => {
      spaceCoverImage && setSpaceCoverImage(spaceCoverImage)
    })
  }, [userId])

  const [validateSpace] = useMutation<ValidateSpaceResponse>(validateSpaceMutation, {
    onCompleted: () => setFieldErrors({}),
    onError: (error) => setFieldErrors(handleGraphQLError(error)),
  })
  const [createSpace] = useMutation<CreateSpaceResponse>(createSpaceMutation, {
    onCompleted: (data) =>
      replaceRoute(`/spaces/${data.createSpace.name}/edit${!hasOwnSpaces ? '?onboarding=true' : ''}`),
    onError: (error) => setFieldErrors(handleGraphQLError(error)),
    refetchQueries: [{ query: mySpaceQuery }],
  })

  useLayoutEffect(
    () =>
      setOptions({
        animation: 'slide_from_bottom',
        headerTitle: () => (
          <HoliHeading level="1" size="medium">
            {t('spaces.create.title')}
          </HoliHeading>
        ),
        headerStyle: { backgroundColor: colors.background10 },
        headerTransparent: true,
        headerLeft: () => <HeaderBackButton icon="close" onPress={() => setShowConfirmationModal(true)} />,
        navigationCustomOptions: {
          footerShown: false,
        },
      }),
    [setOptions, t]
  )

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
    <SpaceTermContextProvider>
      <View style={styles.wrapper}>
        <View style={[mixins.container, styles.container]}>
          <HoliWizard
            isBackButtonAvailable={true}
            submitButtonLabel={t('spaces.create.button')}
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
      </View>
      <HoliConfirmation
        show={showConfirmationModal}
        label={exitConfirmationTitle}
        title={exitConfirmationTitle}
        description={t('spaces.create.close.dialog.description')}
        onDismiss={() => setShowConfirmationModal(false)}
        dismissText={t('spaces.create.close.dialog.dismiss')}
        confirmText={t('global.yes')}
        testID="exit-space-creation-confirmation"
        onConfirm={() => {
          setShowConfirmationModal(false)
          navigateBack()
        }}
      />
    </SpaceTermContextProvider>
  )
}

export default CreateSpace

const styles = StyleSheet.create({
  wrapper: { alignItems: 'center', flex: 1, backgroundColor: colors.background10 },
  defaultLayout: {
    backgroundColor: colors.background10,
    paddingBottom: 0,
    width: '100%',
    minHeight: Platform.OS === 'web' ? '100vh' : '100%',
  },
  container: {
    flex: 1,
    paddingTop: vars.topBarHeight,
    width: '100%',
    paddingHorizontal: 0,
    ...Platform.select({
      native: {
        maxWidth: '100%',
      },
    }),
  },
})

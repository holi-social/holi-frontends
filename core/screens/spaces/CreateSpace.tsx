import { useMutation } from '@apollo/client'
import React, { useLayoutEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View } from 'react-native'

import { TranslatedFieldErrors, useFieldErrors } from '@holi/core/errors/hooks'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useUnifiedNavigation } from '@holi/core/navigation/hooks/useUnifiedNavigation'
import CreateSpaceCoverImage from '@holi/core/screens/spaces/components/CreateSpaceCoverImage'
import CreateSpaceName from '@holi/core/screens/spaces/components/CreateSpaceName'
import CreateSpaceTopics from '@holi/core/screens/spaces/components/CreateSpaceTopics'
import SpaceTermContextProvider from '@holi/core/screens/spaces/components/SpaceTermContextProvider'
import {
  CreateSpaceResponse,
  ValidateSpaceResponse,
  createSpaceMutation,
  mySpaceQuery,
  validateSpaceMutation,
} from '@holi/core/screens/spaces/queries'
import { Term } from '@holi/core/screens/userprofile/types'
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
  const { handleGraphQLError } = useFieldErrors({ i18nPrefix: 'spaces', handledFieldErrors: ['title', 'description'] })

  const [validateSpace] = useMutation<ValidateSpaceResponse>(validateSpaceMutation, {
    onCompleted: () => setFieldErrors({}),
    onError: (error) => setFieldErrors(handleGraphQLError(error)),
  })
  const [createSpace] = useMutation<CreateSpaceResponse>(createSpaceMutation, {
    onCompleted: (data) => replaceRoute(`/spaces/${data.createSpace.id}/edit`),
    onError: (error) => setFieldErrors(handleGraphQLError(error)),
    refetchQueries: [{ query: mySpaceQuery }],
  })

  useLayoutEffect(
    () =>
      setOptions({
        animation: 'slide_from_bottom',
        title: t('spaces.create.title'),
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
    paddingBottom: 132,
    flex: 1,
    paddingTop: Platform.OS === 'web' ? 0 : vars.topBarHeight,
    width: '100%',
    paddingHorizontal: 0,
    ...Platform.select({
      native: {
        maxWidth: '100%',
      },
    }),
  },
})

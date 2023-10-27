import { useLazyQuery, useMutation } from '@apollo/client'
import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import DefaultLayout from '@holi/core/components/DefaultLayout'
import FormWrapper from '@holi/core/components/FormWrapper'
import { logError } from '@holi/core/errors/helpers'
import { useErrorHandling } from '@holi/core/errors/hooks'
import createParam from '@holi/core/navigation/hooks/useParam'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import SpaceCollaboratorOnboardingSteps from '@holi/core/screens/spaces/details/components/SpaceCollaboratorOnboardingSteps'
import { updateSpaceMutation } from '@holi/core/screens/spaces/edit/mutations'
import SpaceOnboardingStepInput from '@holi/core/screens/spaces/onboarding/components/SpaceOnboardingStepInput'
import { SpaceByIdResponse, spaceByIdQuery } from '@holi/core/screens/spaces/queries'
import { OnboardingStep, SpaceConnectionType } from '@holi/core/screens/spaces/types'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Add, Information } from '@holi/icons/src/generated'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliModal, { useModalState } from '@holi/ui/components/molecules/HoliModal'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import { colors, vars } from '@holi/ui/styles/globalVars'

export type SpaceOnboardingStepsParams = {
  spaceIdOrName: string
}

const { useParam } = createParam<SpaceOnboardingStepsParams>()

const SpaceOnboardingSteps = () => {
  const { t } = useTranslation()
  const [spaceIdOrName] = useParam('spaceIdOrName')
  const { navigate } = useRouting()
  const setScreenOptions = useSetScreenOptions()
  const { visible: exampleVisible, show: showExample, hide: hideExample } = useModalState()
  const { visible: previewVisible, show: showPreview, hide: hidePreview } = useModalState()
  const { openToast } = useToast()
  const { displayError } = useErrorHandling()

  const [fetchSpace, { data, loading: fetchingSpace }] = useLazyQuery<SpaceByIdResponse>(spaceByIdQuery)

  const space = data?.spaceById
  const isAdmin = space?.connectionStatusToMyself?.includes(SpaceConnectionType.ADMINISTRATOR)
  const [stepsList, setStepsList] = useState<OnboardingStep[]>(space?.onboarding?.steps || [{ text: '' }])
  const [hasEmptySteps, setHasEmptySteps] = useState(false)
  const [isNewStep, setIsNewStep] = useState(true)

  useEffect(() => {
    if (spaceIdOrName) {
      fetchSpace({
        variables: { idOrName: spaceIdOrName || '' },
        onError: (error) =>
          logError(error, 'Failed to load space', { location: 'SpaceOnboardingSteps.fetchSpace', spaceIdOrName }),
      })
    }
  }, [fetchSpace, spaceIdOrName])

  useEffect(() => {
    if (space?.onboarding?.steps && space.onboarding.steps.length > 0) {
      setStepsList(space.onboarding.steps.map((step) => ({ text: step?.text })) || [])
    }
  }, [space])

  useEffect(() => {
    const hasEmptySteps = stepsList.some((step) => !step.text)
    setHasEmptySteps(hasEmptySteps)
  }, [stepsList])

  useLayoutEffect(() => {
    setScreenOptions({
      title: t('spaces.onboarding.setup.nextSteps.title'),
      navigationCustomOptions: {
        footerShown: false,
      },
    })
  }, [setScreenOptions, t])

  const [updateSpace] = useMutation(updateSpaceMutation, {
    onCompleted: () => {
      openToast(t('spaces.onboarding.steps.save.success'), HoliToastType.SUCCESS)
      navigate(`/spaces/${spaceIdOrName}`)
    },
    onError: (error) =>
      displayError(error, 'Failed to update space', {
        location: 'SpaceOnboardingSteps.updateSpace',
        spaceIdOrName,
      }),
  })

  const handleChange = useCallback(
    (stepNumber: number, text: string) => {
      const newSteps = [...stepsList]
      newSteps[stepNumber - 1] = { ...stepsList[stepNumber - 1], text }
      setStepsList(newSteps)
      setIsNewStep(false)
    },
    [stepsList]
  )

  const addStep = useCallback(() => {
    setIsNewStep(true)
    const newStep = { text: '' }
    setStepsList((steps) => [...steps, newStep])
  }, [])

  const removeStep = useCallback(
    (stepNumber: number) => {
      const newList = [...stepsList]
      newList.splice(stepNumber - 1, 1)
      setStepsList(newList)
    },
    [stepsList]
  )

  const saveSteps = () => updateSpace({ variables: { input: { id: space?.id, onboardingSteps: stepsList } } })

  const exampleSteps = [
    { text: t('spaces.collaborate.onboarding.info.text1') },
    { text: t('spaces.collaborate.onboarding.info.text2') },
    { text: t('spaces.collaborate.onboarding.info.text3') },
  ]

  if (space && !isAdmin) {
    navigate(`/spaces/${spaceIdOrName}`)
  }

  return (
    <DefaultLayout
      scrollable={false}
      headerOverlap={true}
      style={styles.layoutStyle}
      contentStyle={styles.contentStyle}
    >
      <FormWrapper
        saveButtonDisabled={fetchingSpace || hasEmptySteps}
        style={styles.formWrapper}
        buttonLabel={t('global.save')}
        onSave={saveSteps}
        scrollToInput={false}
        keyboardShouldPersistTaps="handled"
        renderProp={() => (
          <>
            <View style={styles.intro}>
              <HoliText style={styles.desc}>{t('spaces.onboarding.steps.hint')}</HoliText>
              <HoliButton
                label={t('spaces.onboarding.steps.example.text')}
                onPress={showExample}
                transparent
                style={styles.example}
              >
                {t('spaces.onboarding.steps.example.text')}
              </HoliButton>
            </View>
            <View>
              {stepsList.map((step, index) => (
                <SpaceOnboardingStepInput
                  key={index}
                  index={index + 1}
                  step={step}
                  totalSteps={stepsList.length}
                  handleChange={handleChange}
                  removeStep={removeStep}
                  isNewStep={isNewStep}
                />
              ))}
              <HoliButton
                label={t('spaces.onboarding.steps.add')}
                onPress={addStep}
                variant="medium"
                type="secondary"
                style={styles.addStepBtn}
              >
                <HoliText>{t('spaces.onboarding.steps.add')}</HoliText>
                <HoliIcon icon={Add} size={16} />
              </HoliButton>
              {stepsList.length > 0 && (
                <HoliButton
                  label={t('spaces.onboarding.steps.preview.link')}
                  onPress={showPreview}
                  transparent
                  style={styles.previewButton}
                >
                  <View style={styles.preview}>
                    <HoliIcon icon={Information} style={styles.previewIcon} />
                    <HoliText bold>{t('spaces.onboarding.steps.preview.link')}</HoliText>
                  </View>
                </HoliButton>
              )}
            </View>
          </>
        )}
      />
      <HoliModal
        show={exampleVisible}
        label={t('spaces.onboarding.steps.example.label')}
        onDismiss={hideExample}
        style={styles.exampleWrapper}
      >
        <SpaceCollaboratorOnboardingSteps steps={exampleSteps} header={t('spaces.onboarding.steps.example.label')} />
      </HoliModal>

      <HoliModal
        show={previewVisible}
        label={t('spaces.onboarding.steps.preview.label')}
        onDismiss={hidePreview}
        style={styles.previewModal}
      >
        <SpaceCollaboratorOnboardingSteps steps={stepsList} header={t('spaces.collaborate.onboarding.info.header')} />
      </HoliModal>
    </DefaultLayout>
  )
}

const styles = StyleSheet.create({
  layoutStyle: {
    height: '100%',
  },
  contentStyle: {
    flex: 1,
    paddingBottom: 0,
    backgroundColor: colors.background20,
    paddingTop: vars.topBarHeight,
  },
  formWrapper: {
    height: '100%',
  },
  header: {
    marginBottom: 24,
  },
  intro: {
    paddingTop: 42,
  },
  desc: {
    marginTop: 8,
    marginBottom: 24,
  },
  exampleWrapper: {
    paddingBottom: 24,
  },
  example: {
    width: 'auto',
    marginBottom: 40,
    alignSelf: 'flex-start',
  },
  previewButton: {
    marginBottom: vars.bottomBarHeight,
  },
  preview: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  previewIcon: {
    marginRight: 4,
  },
  previewModal: {
    paddingBottom: 24,
  },
  addStepBtn: {
    marginTop: 24,
    marginBottom: 24,
    maxWidth: 320,
    alignSelf: 'center',
  },
})

export default SpaceOnboardingSteps

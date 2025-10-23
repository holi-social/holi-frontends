import { useMutation } from '@apollo/client/react'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import DefaultLayout from '@holi/core/components/DefaultLayout'
import FormWrapper from '@holi/core/components/FormWrapper'
import PermissionsGuard, { PermissionsType } from '@holi/core/components/PermissionsGuard'
import { isMaliciousUrlError } from '@holi/core/errors/helpers'
import { useErrorHandling } from '@holi/core/errors/hooks'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import createParamHooks from '@holi/core/navigation/hooks/useParam'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import SpaceCollaboratorOnboardingSteps from '@holi/core/screens/spaces/details/components/SpaceCollaboratorOnboardingSteps'
import { updateSpaceMutation } from '@holi/core/screens/spaces/edit/mutations'
import { useSpace } from '@holi/core/screens/spaces/hooks/useSpace'
import SpaceOnboardingStepInput from '@holi/core/screens/spaces/onboarding/components/SpaceOnboardingStepInput'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Add, Information } from '@holi/icons/src/generated'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliModal, { useModalState } from '@holi/ui/components/molecules/HoliModal'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import { dimensions } from '@holi/ui/styles/globalVars'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import Spacing from '@holi/ui/foundations/Spacing'
import useTracking from '@holi/core/tracking/hooks/useTracking'
import { TrackingEvent } from '@holi/core/tracking'
import { Button } from 'holi-bricks/components/button'
import { type OnboardingStep, SpaceUserConnectionType } from '@holi/api/graphql/graphql-codegen'

export type SpaceOnboardingStepsParams = {
  spaceIdOrName: string
}

const { useParam } = createParamHooks<SpaceOnboardingStepsParams>()

const SpaceOnboardingSteps = () => {
  const { t } = useTranslation()
  const [spaceIdOrName] = useParam('spaceIdOrName')
  const { navigate } = useRouting()
  const setScreenOptions = useSetScreenOptions()
  const { visible: exampleVisible, show: showExample, hide: hideExample } = useModalState()
  const { visible: previewVisible, show: showPreview, hide: hidePreview } = useModalState()
  const { openToast } = useToast()
  const { displayError } = useErrorHandling()
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])
  const { track } = useTracking()

  const { loading: fetchingSpace, space, error: errorSpace } = useSpace(spaceIdOrName)

  const [stepsList, setStepsList] = useState<OnboardingStep[]>(space?.onboarding?.steps || [{ text: '' }])
  const [hasEmptySteps, setHasEmptySteps] = useState(false)
  const [isNewStep, setIsNewStep] = useState(true)

  useEffect(() => {
    if (space?.onboarding?.steps && space.onboarding.steps.length > 0) {
      setStepsList(space.onboarding.steps.map((step) => ({ text: step?.text })) || [])
    }
  }, [space])

  useEffect(() => {
    const hasEmptySteps = stepsList.some((step) => !step.text)
    setHasEmptySteps(hasEmptySteps)
  }, [stepsList])

  useIsomorphicLayoutEffect(() => {
    setScreenOptions({
      title: t('spaces.onboarding.setup.nextSteps.title'),
      headerLeft: () => <HeaderBackButton />,
      headerTitleAlign: 'center',
      navigationCustomOptions: {
        footerShown: false,
      },
    })
  }, [setScreenOptions, t])

  const [updateSpace] = useMutation(updateSpaceMutation, {
    onCompleted: () => {
      openToast(t('spaces.onboarding.steps.save.success'), HoliToastType.SUCCESS)
      track(TrackingEvent.Spaces.Onboarding.updated(space?.id ?? spaceIdOrName ?? ''))
      navigate(`/spaces/${spaceIdOrName}`)
    },
    onError: (error) => {
      if (isMaliciousUrlError(error)) {
        openToast(t('global.maliciousUrl.error'), HoliToastType.ERROR)
      } else {
        displayError(error, 'Failed to update space', {
          location: 'SpaceOnboardingSteps.updateSpace',
          spaceIdOrName,
        })
      }
    },
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

  if (fetchingSpace || errorSpace || !space) {
    return <></>
  }

  return (
    <PermissionsGuard
      space={space}
      spaceConnectionType={SpaceUserConnectionType.Administrator}
      permissionType={PermissionsType.SPACES}
    >
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
                <View style={styles.addStepBtn}>
                  <Button label={t('spaces.onboarding.steps.add')} onPress={addStep} variant="secondary" icon={Add} />
                </View>
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
          shown={exampleVisible}
          label={t('spaces.onboarding.steps.example.label')}
          onDismiss={hideExample}
          style={styles.exampleWrapper}
        >
          <SpaceCollaboratorOnboardingSteps steps={exampleSteps} header={t('spaces.onboarding.steps.example.label')} />
        </HoliModal>

        <HoliModal
          shown={previewVisible}
          label={t('spaces.onboarding.steps.preview.label')}
          onDismiss={hidePreview}
          style={styles.previewModal}
        >
          <SpaceCollaboratorOnboardingSteps steps={stepsList} header={t('spaces.collaborate.onboarding.info.header')} />
        </HoliModal>
      </DefaultLayout>
    </PermissionsGuard>
  )
}

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    layoutStyle: {
      height: '100%',
    },
    contentStyle: {
      flex: 1,
      paddingBottom: 0,
      backgroundColor: theme.colors.background20,
    },
    formWrapper: {
      height: '100%',
    },
    header: {
      marginBottom: Spacing.md,
    },
    intro: {
      paddingTop: Spacing.sm,
    },
    desc: {
      marginTop: Spacing['3xs'],
      marginBottom: Spacing.md,
    },
    exampleWrapper: {
      paddingBottom: Spacing.md,
    },
    example: {
      width: 'auto',
      marginBottom: Spacing.xl,
      alignSelf: 'flex-start',
    },
    previewButton: {
      marginBottom: dimensions.bottomBarHeight,
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
      paddingBottom: Spacing.md,
    },
    addStepBtn: {
      marginTop: Spacing.md,
      marginBottom: Spacing.md,
      maxWidth: 320,
      width: '100%',
      alignSelf: 'center',
    },
  })

export default SpaceOnboardingSteps

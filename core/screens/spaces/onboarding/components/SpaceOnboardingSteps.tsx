import { useLazyQuery, useMutation } from '@apollo/client'
import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, SafeAreaView, StyleSheet, View } from 'react-native'

import FormWrapper from '@holi/core/components/FormWrapper'
import ScrollHeaderLayout from '@holi/core/components/ScrollHeaderLayout'
import { logError } from '@holi/core/errors/helpers'
import createParam from '@holi/core/navigation/hooks/useParam'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import SpaceCollaboratorOnboardingInfo from '@holi/core/screens/spaces/details/components/SpaceCollaboratorOnboardingInfo'
import { updateSpaceMutation } from '@holi/core/screens/spaces/edit/mutations'
import SpaceOnboardingStepsInput from '@holi/core/screens/spaces/onboarding/components/SpaceOnboardingStepsInput'
import { SpaceByIdResponse, spaceByIdQuery } from '@holi/core/screens/spaces/queries'
import { SpaceConnectionType } from '@holi/core/screens/spaces/types'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliModal, { useModalState } from '@holi/ui/components/molecules/HoliModal'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import { colors } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

export type SpaceOnboardingStepsParams = {
  spaceIdOrName: string
}

const { useParam } = createParam<SpaceOnboardingStepsParams>()

const SpaceOnboardingSteps = () => {
  const { t } = useTranslation()
  const [spaceIdOrName] = useParam('spaceIdOrName')
  const mixins = useStyleMixins()
  const { navigate } = useRouting()
  const setScreenOptions = useSetScreenOptions()
  const { visible: exampleVisible, show: showExample, hide: hideExample } = useModalState()
  const [stepsList, setStepsList] = useState([{ text: '' }])
  const { openToast } = useToast()

  const [fetchSpace, { data }] = useLazyQuery<SpaceByIdResponse>(spaceByIdQuery)

  useEffect(() => {
    if (spaceIdOrName) {
      fetchSpace({
        variables: { idOrName: spaceIdOrName || '' },
        onError: (error) => logError(error, `[SpaceOnboardingSteps.tsx] ${error.message}`),
      })
    }
  }, [fetchSpace, spaceIdOrName])

  const space = data?.spaceById
  const isAdmin = space?.connectionStatusToMyself?.includes(SpaceConnectionType.ADMINISTRATOR)

  useLayoutEffect(() => {
    setScreenOptions({
      title: t('spaces.onboarding.setup.nextSteps.title'),
      navigationCustomOptions: {
        footerShown: false,
      },
    })
  }, [setScreenOptions, t])

  const [updateSpace, { loading }] = useMutation(updateSpaceMutation, {
    onCompleted: () => {
      openToast(t('spaces.edit.success'), HoliToastType.SUCCESS)
      navigate(`/spaces/${spaceIdOrName}`)
    },
    onError: () => openToast(t('global.technicalError'), HoliToastType.ERROR),
  })

  const handleChange = useCallback(
    (stepNumber: number, text: string) => {
      const newSteps = [...stepsList]
      newSteps[stepNumber - 1] = { ...stepsList[stepNumber - 1], text }
      setStepsList(newSteps)
    },
    [stepsList]
  )

  const addStep = useCallback(() => {
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

  const saveSteps = () => {
    updateSpace({ variables: { input: { id: space?.id, onboardingSteps: stepsList } } })
  }

  if (space && !isAdmin) {
    navigate(`/spaces/${spaceIdOrName}`)
  }

  return (
    <SafeAreaView style={mixins.container}>
      <ScrollHeaderLayout.Default style={styles.layout}>
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
        <FormWrapper
          onSave={saveSteps}
          saveButtonDisabled={loading}
          loading={loading}
          key={spaceIdOrName}
          buttonLabel={t('global.save')}
          keyboardShouldPersistTaps="never"
          isModal={false}
          renderProp={() => {
            return (
              <>
                {stepsList.map((step, index) => (
                  <>
                    <SpaceOnboardingStepsInput
                      key={index}
                      index={index + 1}
                      step={step}
                      handleChange={handleChange}
                      removeStep={removeStep}
                    />
                  </>
                ))}
                <HoliButton
                  label={t('spaces.onboarding.steps.add')}
                  onPress={addStep}
                  variant="medium"
                  type="secondary"
                  style={styles.addStepBtn}
                >
                  <HoliText>{t('spaces.onboarding.steps.add')}</HoliText>
                  <HoliIcon icon="add" size={16} />
                </HoliButton>
              </>
            )
          }}
        />
        <HoliModal
          show={exampleVisible}
          label={t('spaces.onboarding.steps.example.label')}
          onDismiss={hideExample}
          style={styles.exampleWrapper}
        >
          <HoliText style={styles.header} size="large">
            {t('spaces.onboarding.steps.example.label')}
          </HoliText>
          <SpaceCollaboratorOnboardingInfo />
        </HoliModal>
      </ScrollHeaderLayout.Default>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  layout: {
    backgroundColor: colors.background20,
    ...Platform.select({
      native: {
        minHeight: '100%',
      },
      web: {
        minHeight: '100vh',
      },
    }),
    paddingTop: 24,
  },
  header: {
    marginBottom: 24,
    marginLeft: 20,
  },
  intro: {
    paddingHorizontal: 20,
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
  addStepBtn: {
    marginTop: 24,
    marginBottom: 24,
    width: 'auto',
    alignSelf: 'center',
  },
})

export default SpaceOnboardingSteps

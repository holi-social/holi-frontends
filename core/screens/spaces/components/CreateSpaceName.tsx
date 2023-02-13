import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View, useWindowDimensions } from 'react-native'

import DefaultLayout from '@holi/core/DefaultLayout'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliTextInput from '@holi/ui/components/molecules/HoliTextInput'
import useWizard from '@holi/ui/components/organisms/HoliWizard/useWizard'
import { colors } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

export type CreateSpaceNameProps = {
  onChangeSpaceName: (name: string) => void
  onChangeSpaceGoal: (goal: string) => void
  spaceName: string
  spaceGoal: string
}

const CreateSpaceName: React.VFC<CreateSpaceNameProps> = ({
  onChangeSpaceName,
  onChangeSpaceGoal,
  spaceName,
  spaceGoal,
}: CreateSpaceNameProps) => {
  const mixins = useStyleMixins()
  const { height: deviceHeight, width: deviceWidth } = useWindowDimensions()
  const [nameError, setNameError] = useState<string>()
  const [goalError, setGoalError] = useState<string>()

  const { t } = useTranslation()
  const { setNextButtonEnabled } = useWizard()

  useEffect(() => {
    if (spaceName && spaceName.replace(/\s/g, '').length > 1 && spaceGoal && spaceGoal.replace(/\s/g, '').length > 0) {
      setNextButtonEnabled(true)
    } else {
      setNextButtonEnabled(false)
      setNameError(undefined)
      setGoalError(undefined)
    }
  }, [spaceName, spaceGoal, setNextButtonEnabled])

  return (
    <View style={styles.wrapper}>
      <DefaultLayout
        headerOverlap={true}
        scrollEnabled={false}
        style={[styles.contentStyle, { width: Platform.OS === 'web' ? deviceWidth : '100%' }]}
      >
        <View style={[mixins.container, styles.container, { minHeight: deviceHeight }]}>
          <View style={styles.title}>
            <HoliText size="extralarge">{t('spaces.create.space.stepOne.title')}</HoliText>
          </View>
          <HoliTextInput
            placeholder={t('spaces.create.space.name.input.placeholder')}
            inputLabel={t('spaces.create.space.name.label')}
            maxNoOfCharacters={60}
            showCharactorCount={true}
            validationErrorText={nameError}
            value={spaceName}
            onChange={(value: string) => {
              onChangeSpaceName(value)
            }}
            helperText={t('spaces.create.space.name.input.description')}
            accessibilityLabel={t('spaces.create.space.name.label')}
          />
          <View style={styles.goalInputContainer}>
            <HoliTextInput
              placeholder={t('spaces.create.space.goal.input.placeholder')}
              inputLabel={t('spaces.create.space.goal.label')}
              maxNoOfCharacters={600}
              showCharactorCount={true}
              noOfVisibleLines={5}
              maxNoOfVisibleLines={10}
              validationErrorText={goalError}
              value={spaceGoal}
              onChange={(value: string) => {
                onChangeSpaceGoal(value)
              }}
              accessibilityLabel={t('spaces.create.space.goal.label')}
            />
          </View>
        </View>
      </DefaultLayout>
    </View>
  )
}

export default CreateSpaceName

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    width: '100%',
    ...Platform.select({
      web: {
        minHeight: '100vh',
      },
    }),
    alignItems: 'center',
    display: 'flex',
    backgroundColor: colors.background10,
  },
  contentStyle: {
    flex: 1,
    backgroundColor: colors.background10,
    ...Platform.select({
      web: {
        minHeight: '100vh',
        paddingHorizontal: 24,
      },
    }),
  },
  container: {
    flex: 1,
    paddingBottom: 132,
    paddingHorizontal: 0,
    ...Platform.select({
      native: {
        maxWidth: '100%',
      },
    }),
  },
  title: {
    marginBottom: 24,
    marginTop: 40,
  },
  goalInputContainer: {
    marginTop: 24,
  },
})

import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View, useWindowDimensions } from 'react-native'

import DefaultLayout from '@holi/core/DefaultLayout'
import { useScrollYHandler } from '@holi/core/helpers'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliExtendedTextInput from '@holi/ui/components/organisms/HoliExtendedTextInput'
import useWizard from '@holi/ui/components/organisms/HoliWizard/useWizard'
import { colors } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

const CreateSpaceName: React.VFC = () => {
  const mixins = useStyleMixins()
  const onScreenScroll = useScrollYHandler()
  const { height: deviceHeight, width: deviceWidth } = useWindowDimensions()
  const [spaceName, setSpaceName] = useState<string>()
  const [spaceGoal, setSpaceGoal] = useState<string>()
  const [nameError, setNameError] = useState<string>()
  const [goalError, setGoalError] = useState<string>()

  const { t } = useTranslation()
  const { setNextButtonEnabled } = useWizard()

  const handleSpaceName = (name: string) => {
    setSpaceName(name)
  }

  const handleSpaceGoal = (goal: string) => {
    setSpaceGoal(goal)
  }

  useEffect(() => {
    if (spaceName && spaceName.length > 1 && spaceGoal && spaceGoal.length > 0) {
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
        onScroll={onScreenScroll}
        scrollEventThrottle={200}
        style={[styles.contentStyle, { width: Platform.OS === 'web' ? deviceWidth : '100%' }]}
      >
        <View style={[mixins.container, styles.container, { minHeight: deviceHeight }]}>
          <View style={styles.title}>
            <HoliText size="extralarge">{t('spaces.create.space.stepOne.title')}</HoliText>
          </View>
          <HoliExtendedTextInput
            placeHolder="Our name is..."
            inputLabel="Write a name for your Space*"
            characterLength={60}
            validationErrorText={nameError}
            onChangeText={(value) => {
              handleSpaceName(value)
            }}
            description={t('spaces.create.space.name.input.description')}
          />
          <View style={styles.goalInputContainer}>
            <HoliExtendedTextInput
              noOfVisibleLines={5}
              validationErrorText={goalError}
              placeHolder="Our Space goal is..."
              inputLabel="Write a description of your Space*"
              characterLength={600}
              onChangeText={(value) => {
                handleSpaceGoal(value)
              }}
              description={t('spaces.create.space.goal.input.description')}
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
    backgroundColor: colors.backgroundColorGreyLight,
  },
  contentStyle: {
    flex: 1,
    backgroundColor: colors.backgroundColorGreyLight,
    width: '100%',
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

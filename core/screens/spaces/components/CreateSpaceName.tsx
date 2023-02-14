import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View, useWindowDimensions } from 'react-native'

import DefaultLayout from '@holi/core/DefaultLayout'
import SpaceNameAndGoalForm from '@holi/core/screens/spaces/components/SpaceInputs/SpaceNameAndGoalForm'
import { ValidateSpaceInputSchema } from '@holi/core/screens/spaces/queries'
import useWizard from '@holi/ui/components/organisms/HoliWizard/useWizard'
import { colors } from '@holi/ui/styles/globalVars'

export type CreateSpaceNameProps = {
  onChangeSpaceName: (name: string) => void
  onChangeSpaceGoal: (goal: string) => void
  spaceName: string
  spaceGoal: string
  spaceNameError?: string
  spaceGoalError?: string
}

const CreateSpaceName: React.VFC<CreateSpaceNameProps> = ({
  onChangeSpaceName,
  onChangeSpaceGoal,
  spaceName,
  spaceGoal,
  spaceNameError,
  spaceGoalError,
}: CreateSpaceNameProps) => {
  const { height: deviceHeight, width: deviceWidth } = useWindowDimensions()
  const { t } = useTranslation()
  const { setNextButtonEnabled } = useWizard()

  useEffect(() => {
    const resultSchema = ValidateSpaceInputSchema.safeParse({
      title: spaceName,
      description: spaceGoal,
    })
    setNextButtonEnabled(resultSchema.success)
  }, [spaceName, spaceGoal, setNextButtonEnabled])

  return (
    <View style={styles.wrapper}>
      <DefaultLayout
        headerOverlap={true}
        scrollEnabled={false}
        style={[styles.contentStyle, { width: Platform.OS === 'web' ? deviceWidth : '100%' }]}
      >
        <SpaceNameAndGoalForm
          style={[styles.container, { minHeight: deviceHeight }]}
          title={t('spaces.create.space.stepOne.title')}
          spaceName={spaceName}
          spaceGoal={spaceGoal}
          spaceNameError={spaceNameError}
          spaceGoalError={spaceGoalError}
          onChangeSpaceName={onChangeSpaceName}
          onChangeSpaceGoal={onChangeSpaceGoal}
        />
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

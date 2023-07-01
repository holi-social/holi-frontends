import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import SpaceNameAndGoalForm from '@holi/core/screens/spaces/components/SpaceInputs/SpaceNameAndGoalForm'
import { ValidateSpaceInputSchema } from '@holi/core/screens/spaces/create/mutations'
import useWizard from '@holi/ui/components/organisms/HoliWizard/useWizard'
import { colors } from '@holi/ui/styles/globalVars'

export type CreateSpaceNameProps = {
  onChangeSpaceName: (name: string) => void
  onChangeSpaceGoal: (goal: string) => void
  spaceName: string
  spaceGoal: string
  spaceNameErrors?: string[]
  spaceGoalErrors?: string[]
}

const CreateSpaceName: React.VFC<CreateSpaceNameProps> = ({
  onChangeSpaceName,
  onChangeSpaceGoal,
  spaceName,
  spaceGoal,
  spaceNameErrors,
  spaceGoalErrors,
}: CreateSpaceNameProps) => {
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
      <SpaceNameAndGoalForm
        style={styles.container}
        title={t('spaces.create.stepOne.title')}
        spaceName={spaceName}
        spaceGoal={spaceGoal}
        spaceNameErrors={spaceNameErrors}
        spaceGoalErrors={spaceGoalErrors}
        onChangeSpaceName={onChangeSpaceName}
        onChangeSpaceGoal={onChangeSpaceGoal}
      />
    </View>
  )
}

export default CreateSpaceName

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    display: 'flex',
    backgroundColor: colors.background10,
  },
  container: {
    width: '100%',
    paddingBottom: 160,
    paddingHorizontal: 0,
  },
})

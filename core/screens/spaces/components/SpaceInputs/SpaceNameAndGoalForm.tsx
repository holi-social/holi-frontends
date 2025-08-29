import React from 'react'
import { View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

import FormWrapper, { FormWrapperProps } from '@holi/core/components/FormWrapper'
import SpaceNameInput from '@holi/core/screens/spaces/components/SpaceInputs/SpaceNameInput'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import SpaceGoalInput from '@holi/core/screens/spaces/components/SpaceInputs/SpaceGoalInput'

export interface SpaceNameAndGoalFormProps extends Omit<FormWrapperProps, 'renderProp'> {
  onChangeSpaceName: (name: string) => void
  onChangeSpaceGoal: (goal: string) => void
  spaceName: string
  spaceGoal: string
  spaceNameErrors?: string[]
  spaceGoalErrors?: string[]
}

const SpaceNameAndGoalForm = ({
  onChangeSpaceName,
  onChangeSpaceGoal,
  onSave,
  saveButtonDisabled,
  spaceName,
  spaceGoal,
  spaceNameErrors,
  spaceGoalErrors,
  style,
}: SpaceNameAndGoalFormProps) => {
  return (
    <FormWrapper
      isModal={true}
      onSave={onSave}
      saveButtonDisabled={saveButtonDisabled}
      style={style}
      scrollToInput={false}
      testID="space-edit-modal"
      showBottomBar
      renderProp={(scrollToPropsFor) => (
        <View style={styles.container}>
          <SpaceNameInput
            value={spaceName}
            onChange={onChangeSpaceName}
            errorMessages={spaceNameErrors}
            {...scrollToPropsFor('name')}
          />
          <HoliGap size="m" />
          <SpaceGoalInput
            value={spaceGoal}
            onChange={onChangeSpaceGoal}
            errorMessages={spaceGoalErrors}
            {...scrollToPropsFor('goal')}
          />
        </View>
      )}
    />
  )
}

export default SpaceNameAndGoalForm

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 24,
    paddingBottom: 42,
  },
  nameInput: {
    marginBottom: 24,
  },
})

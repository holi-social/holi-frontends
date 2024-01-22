import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import FormWrapper, { FormWrapperProps } from '@holi/core/components/FormWrapper'
import HoliTextInput from '@holi/ui/components/molecules/HoliTextInput'

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
  const { t } = useTranslation()
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
          <HoliTextInput
            placeholder={t('spaces.input.name.placeholder')}
            inputLabel={t('spaces.input.name.label')}
            maxNoOfCharacters={60}
            showCharacterCount={true}
            validationErrorText={spaceNameErrors?.length ? spaceNameErrors[0] : undefined}
            value={spaceName}
            onChange={onChangeSpaceName}
            helperText={t('spaces.input.name.description')}
            aria-label={t('spaces.input.name.label')}
            testID="space-name"
            style={styles.nameInput}
            {...scrollToPropsFor('name')}
          />

          <HoliTextInput
            placeholder={t('spaces.input.goal.placeholder')}
            inputLabel={t('spaces.input.goal.label')}
            maxNoOfCharacters={600}
            showCharacterCount={true}
            noOfVisibleLines={5}
            maxNoOfVisibleLines={10}
            validationErrorText={spaceGoalErrors?.length ? spaceGoalErrors[0] : undefined}
            value={spaceGoal}
            onChange={onChangeSpaceGoal}
            aria-label={t('spaces.input.goal.label')}
            testID="space-goal"
            inputProps={{ textAlignVertical: 'top' }}
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

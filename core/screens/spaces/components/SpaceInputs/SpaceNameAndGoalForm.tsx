import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import FormWrapper, { FormWrapperProps } from '@holi/core/components/FormWrapper'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliTextInput from '@holi/ui/components/molecules/HoliTextInput'

export interface SpaceNameAndGoalFormProps extends Partial<FormWrapperProps> {
  onChangeSpaceName: (name: string) => void
  onChangeSpaceGoal: (goal: string) => void
  spaceName: string
  spaceGoal: string
  onSave: () => void
  spaceNameErrors?: string[]
  spaceGoalErrors?: string[]
  title: string
  style?: StyleProp<ViewStyle>
  contentStyle?: StyleProp<ViewStyle>
}

const SpaceNameAndGoalForm: React.VFC<SpaceNameAndGoalFormProps> = ({
  onChangeSpaceName,
  onChangeSpaceGoal,
  onSave,
  saveButtonDisabled,
  loading,
  spaceName,
  spaceGoal,
  spaceNameErrors,
  spaceGoalErrors,
  title,
}: SpaceNameAndGoalFormProps) => {
  const { t } = useTranslation()
  return (
    <FormWrapper
      padTopBar={false}
      isModal={true}
      onSave={onSave}
      saveButtonDisabled={saveButtonDisabled}
      loading={loading}
      renderProp={(scrollToPropsFor) => (
        <>
          <View style={styles.title}>
            <HoliText size="extralarge" testID="space-name-and-goal-title">
              {title}
            </HoliText>
          </View>
          <HoliTextInput
            placeholder={t('spaces.input.name.placeholder')}
            inputLabel={t('spaces.input.name.label')}
            maxNoOfCharacters={60}
            showCharacterCount={true}
            validationErrorText={spaceNameErrors?.length ? spaceNameErrors[0] : undefined}
            value={spaceName}
            onChange={onChangeSpaceName}
            helperText={t('spaces.input.name.description')}
            accessibilityLabel={t('spaces.input.name.label')}
            testID="space-name"
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
            accessibilityLabel={t('spaces.input.goal.label')}
            testID="space-goal"
            inputProps={{ textAlignVertical: 'top' }}
            style={styles.goalInputContainer}
            {...scrollToPropsFor('goal')}
          />
        </>
      )}
    />
  )
}

export default SpaceNameAndGoalForm

const styles = StyleSheet.create({
  title: {
    paddingVertical: 24,
  },
  goalInputContainer: {
    marginTop: 24,
  },
})

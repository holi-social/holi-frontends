import React, { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import FormWrapper from '@holi/core/components/FormWrapper'
import SpaceGoalInput from '@holi/core/screens/spaces/components/SpaceInputs/SpaceGoalInput'
import SpaceNameInput from '@holi/core/screens/spaces/components/SpaceInputs/SpaceNameInput'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliTextInput from '@holi/ui/components/molecules/HoliTextInput'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

export type SpaceNameAndGoalFormProps = {
  onChangeSpaceName: (name: string) => void
  onChangeSpaceGoal: (goal: string) => void
  spaceName: string
  spaceGoal: string
  spaceNameErrors?: string[]
  spaceGoalErrors?: string[]
  title: string
  style?: StyleProp<ViewStyle>
  contentStyle?: StyleProp<ViewStyle>
}

const SpaceNameAndGoalForm: React.VFC<SpaceNameAndGoalFormProps> = ({
  onChangeSpaceName,
  onChangeSpaceGoal,
  spaceName,
  spaceGoal,
  spaceNameErrors,
  spaceGoalErrors,
  title,
  style,
  contentStyle,
}: SpaceNameAndGoalFormProps) => {
  const { t } = useTranslation()
  return (
    <FormWrapper
      padTopBar={false}
      bottomContent={
        // <View>
        <HoliButton label="">Close</HoliButton>
        // </View>
      }
      renderProp={(scrollToPropsFor) => (
        <View>
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
    paddingBottom: 164,
    paddingHorizontal: 0,
    ...Platform.select({
      native: {
        maxWidth: '100%',
      },
    }),
  },
  title: {
    paddingTop: 600,
    paddingVertical: 24,
  },
  goalInputContainer: {
    marginTop: 24,
  },
})

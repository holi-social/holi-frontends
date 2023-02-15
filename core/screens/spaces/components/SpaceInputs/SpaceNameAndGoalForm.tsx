import React from 'react'
import { Platform, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import SpaceGoalInput from '@holi/core/screens/spaces/components/SpaceInputs/SpaceGoalInput'
import SpaceNameInput from '@holi/core/screens/spaces/components/SpaceInputs/SpaceNameInput'
import HoliText from '@holi/ui/components/atoms/HoliText'
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
}: SpaceNameAndGoalFormProps) => {
  const mixins = useStyleMixins()

  return (
    <View style={[mixins.container, style]}>
      <View style={styles.title}>
        <HoliText size="extralarge">{title}</HoliText>
      </View>
      <SpaceNameInput
        value={spaceName}
        onChange={onChangeSpaceName}
        errorMessage={spaceNameErrors?.length ? spaceNameErrors[0] : undefined}
      />
      <View style={styles.goalInputContainer}>
        <SpaceGoalInput
          value={spaceGoal}
          onChange={onChangeSpaceGoal}
          errorMessage={spaceGoalErrors?.length ? spaceGoalErrors[0] : undefined}
        />
      </View>
    </View>
  )
}

export default SpaceNameAndGoalForm

const styles = StyleSheet.create({
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

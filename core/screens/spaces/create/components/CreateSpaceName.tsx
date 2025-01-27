import type React from 'react'
import { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import SpaceGoalInput from '@holi/core/screens/spaces/components/SpaceInputs/SpaceGoalInput'
import SpaceNameInput from '@holi/core/screens/spaces/components/SpaceInputs/SpaceNameInput'
import { ValidateSpaceInputSchema } from '@holi/core/screens/spaces/create/mutations'
import HoliText from '@holi/ui/components/atoms/HoliText'
import useWizard from '@holi/ui/components/organisms/HoliWizard/useWizard'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'

export type CreateSpaceNameProps = {
  onChangeSpaceName: (name: string) => void
  onChangeSpaceGoal: (goal: string) => void
  spaceName: string
  spaceGoal: string
  spaceNameErrors?: string[]
  spaceGoalErrors?: string[]
}

const CreateSpaceName: React.FC<CreateSpaceNameProps> = ({
  onChangeSpaceName,
  onChangeSpaceGoal,
  spaceName,
  spaceGoal,
  spaceNameErrors,
  spaceGoalErrors,
}: CreateSpaceNameProps) => {
  const { t } = useTranslation()
  const { setNextButtonEnabled } = useWizard()
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])

  useEffect(() => {
    const resultSchema = ValidateSpaceInputSchema.safeParse({
      title: spaceName,
      description: spaceGoal,
    })
    setNextButtonEnabled(resultSchema.success)
  }, [spaceName, spaceGoal, setNextButtonEnabled])

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <View style={styles.title}>
          <HoliText size="extralarge">{t('spaces.create.stepOne.title')}</HoliText>
        </View>
        <SpaceNameInput value={spaceName} onChange={onChangeSpaceName} errorMessages={spaceNameErrors} />
        <View style={styles.goalInputContainer}>
          <SpaceGoalInput value={spaceGoal} onChange={onChangeSpaceGoal} errorMessages={spaceGoalErrors} />
        </View>
      </View>
    </View>
  )
}

export default CreateSpaceName

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    wrapper: {
      alignItems: 'center',
      display: 'flex',
      backgroundColor: theme.colors.background10,
    },
    container: {
      width: '100%',
      paddingBottom: 160,
      paddingHorizontal: 0,
    },
    title: {
      marginVertical: 24,
    },
    goalInputContainer: {
      marginTop: 24,
    },
  })

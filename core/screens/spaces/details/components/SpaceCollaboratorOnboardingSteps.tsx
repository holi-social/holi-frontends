import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { OnboardingStep } from '@holi/core/screens/spaces/types'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { colors } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

export type SpaceCollaboratorOnboardingStepsProps = {
  steps: OnboardingStep[]
}

const SpaceCollaboratorOnboardingSteps: React.FC<SpaceCollaboratorOnboardingStepsProps> = ({ steps }) => {
  const mixins = useStyleMixins()
  const { t } = useTranslation()

  return (
    <View style={mixins.container}>
      <HoliText style={styles.header} size="large">
        {t('spaces.collaborate.onboarding.info.header')}
      </HoliText>
      {steps.map((step, index) => (
        <View style={styles.row} key={index}>
          <View style={styles.count}>
            <HoliText size="large" style={styles.italic}>
              {index + 1}
            </HoliText>
          </View>
          <HoliText style={styles.text}>{step.text}</HoliText>
        </View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  count: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 32,
    borderRadius: 32 / 2,
    backgroundColor: colors.brandColorB10,
    borderColor: colors.brandColorB20,
    borderWidth: 1,
    flexShrink: 0,
    marginRight: 16,
  },
  italic: {
    fontStyle: 'italic',
  },
  text: {
    flex: 1,
    flexWrap: 'wrap',
  },
})

export default SpaceCollaboratorOnboardingSteps

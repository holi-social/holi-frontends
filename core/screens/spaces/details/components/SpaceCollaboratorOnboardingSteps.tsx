import React from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import { OnboardingStep } from '@holi/core/screens/spaces/types'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliRichTextOutput from '@holi/ui/components/organisms/HoliRichTextOutput'
import { colors } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

export type SpaceCollaboratorOnboardingStepsProps = {
  steps: OnboardingStep[]
  header?: string
  style?: StyleProp<ViewStyle>
}

const SpaceCollaboratorOnboardingSteps: React.FC<SpaceCollaboratorOnboardingStepsProps> = ({
  steps,
  header,
  style,
}) => {
  const mixins = useStyleMixins()
  return (
    <View style={[mixins.container, style]}>
      {header && (
        <HoliText style={styles.header} size="large">
          {header}
        </HoliText>
      )}
      <View style={styles.wrapper}>
        {steps.map((step, index) => (
          <View style={styles.row} key={index}>
            <View style={styles.count}>
              <HoliText size="large" style={styles.italic}>
                {index + 1}
              </HoliText>
            </View>
            <View style={styles.textWrapper}>
              <HoliRichTextOutput text={step.text} style={styles.text} allowAllLinks />
            </View>
          </View>
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 20,
  },
  wrapper: {
    gap: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
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
  },
  italic: {
    fontStyle: 'italic',
  },
  textWrapper: {
    flex: 1,
    flexWrap: 'wrap',
    minHeight: 32,
    justifyContent: 'center',
  },
  text: {
    lineHeight: '148%',
  },
})

export default SpaceCollaboratorOnboardingSteps

import type React from 'react'
import { useMemo } from 'react'
import { Platform, type StyleProp, StyleSheet, View, type ViewStyle } from 'react-native'

import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliRichTextOutput from '@holi/ui/components/organisms/HoliRichTextOutput'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'
import type { OnboardingStep } from '@holi/api/graphql/graphql-codegen'

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
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])

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
              <HoliRichTextOutput text={step.text ?? ''} style={styles.text} allowAllLinks />
            </View>
          </View>
        ))}
      </View>
    </View>
  )
}

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
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
      backgroundColor: theme.dark ? theme.colors.brandColorB30 : theme.colors.brandColorB10,
      borderColor: theme.colors.brandColorB20,
      borderWidth: 1,
      flexShrink: 0,
    },
    italic: {
      fontStyle: 'italic',
    },
    textWrapper: {
      flex: 1,
      minHeight: 32,
      justifyContent: 'center',
      ...Platform.select({
        web: {
          flexWrap: 'wrap',
        },
      }),
    },
    text: {
      lineHeight: 24,
    },
  })

export default SpaceCollaboratorOnboardingSteps

import React, { useMemo } from 'react'
import { View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

import HoliText from '@holi/ui/components/atoms/HoliText'
import Spacing from '@holi/ui/foundations/Spacing'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

type DiscussionHeaderProps = {
  question: string
}

const DiscussionHeader = ({ question }: DiscussionHeaderProps) => {
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])

  return (
    <View style={styles.questionContainer}>
      <View style={styles.question}>
        <HoliText bold>{question}</HoliText>
      </View>
    </View>
  )
}

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    questionContainer: {
      padding: Spacing.xs,
      backgroundColor: theme.colors.brandA200,
    },
    question: {
      padding: Spacing.xs,
      backgroundColor: theme.colors.background10,
      borderColor: theme.colors.black300,
      borderWidth: 1,
      borderRadius: Spacing.xs,
    },
  })

export default DiscussionHeader

import React, { useMemo, useRef } from 'react'
import { Animated, StyleSheet, View } from 'react-native'

import type { Choice } from '@holi/core/screens/polls/types'
import HoliRichTextOutput from '@holi/ui/components/organisms/HoliRichTextOutput'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { Text } from 'holi-bricks/components/text'
import Spacing from '@holi/ui/foundations/Spacing'

interface PollResultsProps {
  choice: Choice
  votesSum: number
  selected: boolean
}

const PollResults = ({ choice, votesSum, selected }: PollResultsProps) => {
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])

  const percentageNotRounded = selected ? 100 * ((choice.votes + 1) / votesSum) : 100 * (choice.votes / votesSum)
  const percentage = Math.round(percentageNotRounded)
  const progressAnimation = useRef(new Animated.Value(percentage)).current
  const progressWidth = progressAnimation.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
    extrapolate: 'clamp',
  })

  return (
    <View style={styles.container} testID="poll-results-container">
      <View style={styles.textAndPercentageContainer}>
        <HoliRichTextOutput
          numberOfLines={2}
          style={styles.optionsTextStyle}
          text={choice.choiceText}
          users={[]}
          links={[]}
          allowAllLinks
          size="sm"
        />
        <Text size="sm" testID="poll-result-percentage">
          {percentage}%
        </Text>
      </View>
      <View style={styles.progressBar}>
        <Animated.View style={{ ...styles.innerBar, width: progressWidth }} />
      </View>
    </View>
  )
}

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    container: {
      marginBottom: 16,
      borderWidth: 0,
      borderColor: theme.colors.background30,
      borderRadius: 12,
      backgroundColor: theme.colors.background10,
      justifyContent: 'space-between',
    },
    textAndPercentageContainer: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      flex: 1,
      marginBottom: 5,
      gap: Spacing['lg'],
      justifyContent: 'space-between',
    },
    optionsTextStyle: {
      flexWrap: 'wrap',
      paddingRight: 'auto',
      marginRight: 'auto',
      maxWidth: '80%',
    },
    progressBar: {
      width: '100%',
      height: 15,
      borderWidth: 0,
      borderRadius: 12,
      backgroundColor: theme.colors.gray100,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
    innerBar: {
      height: '100%',
      backgroundColor: theme.colors.brandColorB30,
      borderRadius: 12,
    },
  })

export default PollResults

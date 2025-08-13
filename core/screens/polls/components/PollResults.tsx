import React, { useRef } from 'react'
import { Animated, View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

import { Text } from 'holi-bricks/components/text'
import { Spacing } from 'holi-bricks/foundations'

import type { Choice } from '@holi/core/screens/polls/types'
import HoliRichTextOutput from '@holi/ui/components/organisms/HoliRichTextOutput'

interface PollResultsProps {
  choice: Choice
  votesSum: number
  selected: boolean
}

const PollResults = ({ choice, votesSum, selected }: PollResultsProps) => {
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
        <View style={styles.optionsTextStyle}>
          <HoliRichTextOutput
            numberOfLines={2}
            text={choice.choiceText}
            users={[]}
            links={[]}
            allowAllLinks
            size="sm"
          />
        </View>
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

const styles = StyleSheet.create((theme) => ({
  container: {
    marginBottom: Spacing.xs,
  },
  textAndPercentageContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.xxs,
    marginBottom: Spacing['4xs'],
  },
  optionsTextStyle: {
    flexShrink: 1,
  },
  progressBar: {
    width: '100%',
    height: Spacing.xs,
    borderRadius: Spacing.xxs,
    backgroundColor: theme.colors.bg.muted,
  },
  innerBar: {
    height: '100%',
    borderRadius: Spacing.xxs,
    backgroundColor: theme.colors.fill.informative,
  },
}))

export default PollResults

import React, { useRef } from 'react'
import { Animated, StyleSheet, Text, View } from 'react-native'

import { Choice } from '@holi/core/screens/polls/types'
import HoliRichTextOutput from '@holi/ui/components/organisms/HoliRichTextOutput'
import { colors } from '@holi/ui/styles/globalVars'

interface PollResultsProps {
  choice: Choice
  votesSum: number
  selected: boolean
}

const PollOptionResults = ({ choice, votesSum, selected }: PollResultsProps) => {
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
      {/* options text and percentages */}
      <View style={styles.textAndPercentageContainer}>
        <HoliRichTextOutput
          numberOfLines={2}
          style={styles.optionsTextStyle}
          text={choice.choiceText}
          users={[]}
          links={[]}
          allowAllLinks
          size="default"
          color="gray300"
        />
        <Text style={styles.percentText}>{percentage}%</Text>
      </View>
      {/* progress bar */}
      <View style={styles.progressBar}>
        <Animated.View style={{ ...styles.innerBar, width: progressWidth }} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    borderWidth: 0,
    borderColor: colors.background30,
    borderRadius: 12,
    backgroundColor: colors.background10,
    justifyContent: 'space-between',
  },
  textAndPercentageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    marginBottom: 5,
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
    backgroundColor: '#eee',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  innerBar: {
    height: '100%',
    backgroundColor: '#6267E7',
    borderRadius: 12,
  },
  percentText: {
    fontSize: 14,
    marginLeft: 30,
    color: '#262424',
  },
})

export default PollOptionResults

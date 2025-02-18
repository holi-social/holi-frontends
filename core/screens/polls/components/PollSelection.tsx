import React, { useCallback, useMemo, useState } from 'react'
import { Platform, StyleSheet, View } from 'react-native'

import type { Choice } from '@holi/core/screens/polls/types'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliCheckbox from '@holi/ui/components/molecules/HoliCheckbox'
import HoliRichTextOutput from '@holi/ui/components/organisms/HoliRichTextOutput'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'

export type PollSelectionProps = {
  answerOptions: Choice[]
  onSelected?: (selectedAnswer: Choice | null) => void
}

const PollSelection = ({ answerOptions, onSelected }: PollSelectionProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState<Choice | null>(null)
  const { theme } = useTheme()
  const gap = Platform.OS !== 'web' ? 12 : 16
  const styles = useMemo(() => getStyles(gap, theme), [gap, theme])

  const onAnswerSelect = useCallback(
    (answerOption: Choice) => {
      setSelectedAnswer((prevSelectedAnswer) => {
        const newSelectedAnswer = answerOption.id !== prevSelectedAnswer?.id ? answerOption : null
        if (onSelected) onSelected(newSelectedAnswer)
        return newSelectedAnswer
      })
    },
    [onSelected]
  )

  return answerOptions.map((answer) => {
    return (
      <View style={styles.container} key={answer.id}>
        <HoliButton
          transparent={true}
          onPress={() => onAnswerSelect(answer)}
          label={answer.choiceText}
          contentStyle={[styles.answerOptionItem, answer.id == selectedAnswer?.id ? styles.selected : null]}
        >
          <HoliBox padding={[0, gap, 0, 0]}>
            <HoliCheckbox
              shape="round"
              checked={answer.id === selectedAnswer?.id}
              autofocus={false}
              aria-label={answer.choiceText}
              onSelect={() => onAnswerSelect(answer)}
            />
          </HoliBox>
          <View style={[styles.userItemContent]}>
            <HoliRichTextOutput text={answer.choiceText} users={[]} links={[]} allowAllLinks size="sm" />
          </View>
        </HoliButton>
      </View>
    )
  })
}

const getStyles = (gap: number, theme: HoliTheme) =>
  StyleSheet.create({
    container: {
      marginBottom: 12,
    },
    answerOptionItem: {
      padding: gap,
      borderWidth: 1,
      borderColor: theme.colors.foreground10,
      borderRadius: 8,
      backgroundColor: theme.colors.background10,
      flexDirection: 'row',
      alignItems: 'center',
    },
    selected: {
      borderColor: theme.colors.black300,
    },
    userItemContent: {
      flexShrink: 1,
    },
  })

export default PollSelection

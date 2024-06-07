import React, { useState } from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import { Choice } from '@holi/core/screens/polls/types'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliCheckbox from '@holi/ui/components/molecules/HoliCheckbox'
import HoliRichTextOutput from '@holi/ui/components/organisms/HoliRichTextOutput'
import { colors } from '@holi/ui/styles/globalVars'

interface BaseProps {
  style?: StyleProp<ViewStyle>
}
interface Props extends BaseProps {
  answerOptions: Choice[]
  onSelected?: (selectedAnswerOption: Choice | null) => void
}
export type PollSelectionProps = Props

const PollSelection = ({ answerOptions, onSelected }: PollSelectionProps) => {
  const [selectedAnsweroption, setSelectedAnsweroption] = useState<Choice | null>(null)

  const onAnsweroptionSelect = (answeroption: Choice) => {
    setSelectedAnsweroption((prevSelectedAnsweroption) => {
      const newSelectedAnsweroption = answeroption.id !== prevSelectedAnsweroption?.id ? answeroption : null
      if (onSelected) onSelected(newSelectedAnsweroption)
      return newSelectedAnsweroption
    })
  }

  return answerOptions.map((answeroption) => {
    return (
      <View style={styles.container} key={answeroption.id}>
        <HoliButton
          transparent={true}
          onPress={() => onAnsweroptionSelect(answeroption)}
          label={'answerOption'}
          contentStyle={[
            styles.flexRow,
            styles.answeroptionItem,
            answeroption.id == selectedAnsweroption?.id ? styles.selected : null,
          ]}
        >
          <HoliBox padding={[0, 20, 0, 0]}>
            <HoliCheckbox
              shape="round"
              checked={answeroption.id === selectedAnsweroption?.id}
              autofocus={false}
              aria-label={answeroption.choiceText}
              onSelect={() => onAnsweroptionSelect(answeroption)}
            />
          </HoliBox>
          <View style={[styles.userItemContent]}>
            <HoliRichTextOutput
              text={answeroption.choiceText}
              users={[]}
              links={[]}
              allowAllLinks
              size="default"
              color="gray300"
            />
          </View>
        </HoliButton>
      </View>
    )
  })
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  answeroptionItem: {
    padding: 16,
    borderWidth: 1,
    borderColor: colors.foreground10,
    borderRadius: 12,
    backgroundColor: colors.background10,
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selected: {
    borderColor: 'black',
  },
  userItemContent: {
    flexShrink: 1,
  },
})

export default PollSelection

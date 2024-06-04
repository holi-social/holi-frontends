/* eslint-disable no-console */
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import { Choice } from '@holi/core/screens/polls/types'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliCheckbox from '@holi/ui/components/molecules/HoliCheckbox'
// import { HoliModalSelectOption } from '@holi/ui/components/organisms/HoliModalSelect'
import HoliRichTextOutput from '@holi/ui/components/organisms/HoliRichTextOutput'
import { colors } from '@holi/ui/styles/globalVars'

const ANSWEROPTION_ITEM_HEIGHT = 48
const ANSWEROPTION_ITEM_GAP = 16

interface BaseProps {
  style?: StyleProp<ViewStyle>
}
interface Props extends BaseProps {
  answerOptions: Choice[]
  onSelected?: (selectedAnswerOption: Choice | null) => void
}
export type PollSelectionProps = Props

const PollSelection = ({ answerOptions, onSelected }: PollSelectionProps) => {
  const { t } = useTranslation()

  const [selectedAnsweroption, setSelectedAnsweroption] = useState<Choice | null>(null)

  const onAnsweroptionSelect = (answeroption: Choice) => {
    setSelectedAnsweroption((prevSelectedAnsweroption) => {
      const newSelectedAnsweroption = answeroption.id !== prevSelectedAnsweroption?.id ? answeroption : null
      if (onSelected) onSelected(newSelectedAnsweroption)
      return newSelectedAnsweroption
    })
  }

  return (
    <View>
      <FlatList
        data={answerOptions}
        renderItem={({ item: answeroption }) => {
          return (
            <HoliButton
              transparent={true}
              onPress={() => onAnsweroptionSelect(answeroption)}
              label={'answerOption'}
              contentStyle={[
                styles.flexRow,
                styles.container,
                answeroption.id == selectedAnsweroption?.id ? styles.selected : null,
              ]}
            >
              <HoliBox padding={[0, 20, 0, 0]}>
                <HoliCheckbox
                  shape="round"
                  checked={answeroption.id === selectedAnsweroption?.id}
                  autofocus={false}
                  aria-label={t('chat.start.answeroptionItem.checkbox.label', {
                    answeroption: answeroption.choiceText,
                  })}
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
          )
        }}
        getItemLayout={(_, index) => ({
          length: ANSWEROPTION_ITEM_HEIGHT,
          offset: ANSWEROPTION_ITEM_HEIGHT * index,
          index,
        })}
        ItemSeparatorComponent={() => <View style={{ height: ANSWEROPTION_ITEM_GAP }} />}
        keyboardShouldPersistTaps="handled"
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
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
  answeroptionItem: {
    justifyContent: 'space-between',
  },
  selected: {
    borderColor: 'black',
  },
  userItemContent: {
    flexShrink: 1,
  },
})

export default PollSelection

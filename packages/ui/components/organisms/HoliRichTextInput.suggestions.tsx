import * as React from 'react'
import { StyleSheet, View } from 'react-native'

import HoliButton from '@holi/ui/components/molecules/HoliButton'

export type Suggestion = { id: string; name: string }
export type HoliRichTextInputSuggestionsProps = {
  suggestions: Suggestion[]
  onChooseSuggestion: (selectedSuggestion: Suggestion) => void
}

const HoliRichTextInputSuggestions: React.VFC<HoliRichTextInputSuggestionsProps> = (props) => {
  return (
    <View style={[styles.suggestions]}>
      {props.suggestions.map((item) => (
        <HoliButton
          key={`${item.id}-${Math.random()}`}
          label="xxx" // TODO
          transparent
          style={styles.suggestionItem}
          onPress={() => props.onChooseSuggestion(item)}
        >
          {item.name}
        </HoliButton>
      ))}
    </View>
  )
}

export default HoliRichTextInputSuggestions

const styles = StyleSheet.create({
  suggestions: {
    backgroundColor: 'white',
    overflow: 'hidden',
    zIndex: 2,
  },
  suggestionItem: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: 'lightgrey',
    borderLeftWidth: 1,
    borderLeftColor: 'lightgrey',
    borderRightWidth: 1,
    borderRightColor: 'lightgrey',
  },
})

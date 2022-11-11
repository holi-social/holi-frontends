import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { colors } from '@holi/ui/styles/globalVars'

export type Suggestion = { id: string; name: string }
export type HoliRichTextInputSuggestionsProps = {
  suggestions: Suggestion[]
  onChooseSuggestion: (selectedSuggestion: Suggestion) => void
}

const HoliRichTextInputSuggestions: React.VFC<HoliRichTextInputSuggestionsProps> = (props) => {
  const { t } = useTranslation()

  return (
    <View style={[styles.suggestions]}>
      <View style={[styles.suggestionsContainer]}>
        {props.suggestions.map((item) => (
          <HoliButton
            key={item.id}
            label={t('comment.selectItem', { item: item.name })}
            transparent
            style={styles.suggestionItem}
            onPress={() => props.onChooseSuggestion(item)}
          >
            <HoliText style={styles.suggestionItemText}>{item.name}</HoliText>
          </HoliButton>
        ))}
      </View>
    </View>
  )
}

export default HoliRichTextInputSuggestions

const styles = StyleSheet.create({
  suggestions: {
    zIndex: 2,
  },
  suggestionsContainer: {
    position: 'absolute',
    top: 0,
    backgroundColor: colors.backgroundColor,
    borderWidth: 1,
    borderLeftColor: colors.borderColorGrey,
    borderTopColor: colors.backgroundColor,
    borderRightColor: colors.borderColorGrey,
    borderBottomColor: colors.backgroundColor,
  },
  suggestionItem: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.borderColorGrey,
    minWidth: '100%',
  },
  suggestionItemText: {
    fontSize: 16,
  },
})

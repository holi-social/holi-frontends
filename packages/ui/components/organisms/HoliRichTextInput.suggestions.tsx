import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliUserAvatar from '@holi/ui/components/molecules/HoliUserAvatar'
import { colors } from '@holi/ui/styles/globalVars'

const MAX_SUGGESTIONS_COUNT = 5

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
        {props.suggestions.slice(0, MAX_SUGGESTIONS_COUNT).map((item) => (
          <HoliButton
            key={item.id}
            label={t('comment.suggestionItem.label', { item: item.name })}
            transparent
            style={styles.suggestionItem}
            contentStyle={{ alignItems: 'center', flexDirection: 'row' }}
            onPress={() => props.onChooseSuggestion(item)}
          >
            {/* TODO: add real user data */}
            <HoliUserAvatar
              imageSrc={undefined}
              label={item.name}
              initials={item.name.slice(0, 2)}
              defaultColor={'pink'}
              size="micro"
            />
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
    borderTopColor: colors.borderColorGrey,
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
    marginLeft: 10,
  },
})

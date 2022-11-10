import React, { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { MentionInput, MentionSuggestionsProps } from 'react-native-controlled-mentions'

import HoliRichTextInputSuggestions from '@holi/ui/components/organisms/HoliRichTextInput.suggestions'
import { REGEX_URL, findHashtagByName, findUserByName } from '@holi/ui/helper/richText'

const MIN_SEARCH_CHARS = 1

const HoliRichTextInput: React.VFC = () => {
  const [value, setValue] = useState('')
  // const inputRef = useRef<TextInput>(null)

  const renderSuggestions: React.FC<MentionSuggestionsProps> = ({ keyword, onSuggestionPress }) => {
    if (keyword == null || keyword.length < MIN_SEARCH_CHARS) {
      return null
    }
    const suggestions = findUserByName(keyword)
    return <HoliRichTextInputSuggestions suggestions={suggestions} onChooseSuggestion={onSuggestionPress} />
  }

  const renderHashtagSuggestions: React.FC<MentionSuggestionsProps> = ({ keyword, onSuggestionPress }) => {
    if (keyword == null || keyword.length < MIN_SEARCH_CHARS) {
      return null
    }
    const suggestions = findHashtagByName(keyword)
    return <HoliRichTextInputSuggestions suggestions={suggestions} onChooseSuggestion={onSuggestionPress} />
  }

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <MentionInput
          value={value}
          onChange={setValue}
          partTypes={[
            {
              trigger: '@',
              renderSuggestions,
              textStyle: styles.inlineMention,
            },
            {
              trigger: '#',
              allowedSpacesCount: 0,
              renderSuggestions: renderHashtagSuggestions,
              textStyle: styles.inlineHashtag,
            },
            {
              pattern: REGEX_URL,
              textStyle: styles.inlineUrl,
            },
          ]}
          containerStyle={styles.mentionsStyles}
          style={styles.input}
          // inputRef={inputRef}
        />
      </View>

      {/* outcome */}
      <Text style={{ marginTop: 10 }}>{value}</Text>
    </View>
  )
}

export default HoliRichTextInput

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
  },
  inputContainer: {
    flexDirection: 'column',
    zIndex: 1,
  },
  mentionsStyles: {
    flexDirection: 'column-reverse' /* input on top and suggestions below */,
  },
  input: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'blue',
    borderRadius: 3,
  },
  inlineMention: {
    color: 'blue',
  },
  inlineHashtag: {
    color: 'darkgrey',
  },
  inlineUrl: {
    color: 'green',
  },
})

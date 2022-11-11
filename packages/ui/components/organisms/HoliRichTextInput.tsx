import React, { useCallback, useEffect, useState } from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import { MentionInput, MentionSuggestionsProps } from 'react-native-controlled-mentions'

import HoliRichTextInputSuggestions from '@holi/ui/components/organisms/HoliRichTextInput.suggestions'
import { REGEX_URL } from '@holi/ui/helper/richText'
import { colors } from '@holi/ui/styles/globalVars'

// TODOs
// ====================
// - cursor should be behind replaced item
// - arrow down for mention selection
// - duplicate keys error

const MIN_SEARCH_CHARS = 1

export type Suggestion = {
  id: string
  name: string
}

export type SearchFunction = (keyword: string) => Suggestion[]

export type HoliRichTextInputProps = {
  initalValue?: string
  placeholder?: string
  findMentionsByKeyword?: SearchFunction
  findHashtagsByKeyword?: SearchFunction
  onChange?: (text: string) => void
  onSelectSuggestion?: (suggestion: Suggestion) => void
  style?: StyleProp<ViewStyle>
  inputStyle?: StyleProp<ViewStyle>
}

const HoliRichTextInput: React.VFC<HoliRichTextInputProps> = ({ initalValue = '', placeholder = '...', ...props }) => {
  const [value, setValue] = useState(initalValue)
  // const inputRef = useRef<TextInput>(null)

  const getRenderFunction = (searchFunction: SearchFunction) => {
    const onRenderSuggestions: React.VFC<MentionSuggestionsProps> = ({ keyword, onSuggestionPress }) => {
      if (keyword == null || keyword.length < MIN_SEARCH_CHARS) {
        return null
      }
      const suggestions = searchFunction(keyword)
      return <HoliRichTextInputSuggestions suggestions={suggestions} onChooseSuggestion={onSuggestionPress} />
    }
    return onRenderSuggestions
  }

  const suggestionConfig = []
  if (props.findMentionsByKeyword) {
    suggestionConfig.push({
      trigger: '@',
      renderSuggestions: getRenderFunction(props.findMentionsByKeyword),
      textStyle: styles.inlineMention,
    })
  }
  if (props.findHashtagsByKeyword) {
    suggestionConfig.push({
      trigger: '#',
      renderSuggestions: getRenderFunction(props.findHashtagsByKeyword),
      textStyle: styles.inlineHashtag,
    })
  }
  // nice to have: url highlighting
  suggestionConfig.push({
    pattern: REGEX_URL,
    textStyle: styles.inlineUrl,
  })

  const handleTextChange = useCallback((text: string) => {
    setValue(String(text))
    // if (props.onChange) {
    //   props.onChange(String(text))
    // }
  }, [])

  useEffect(() => {
    if (props.onChange) {
      props.onChange(String(value))
    }
  }, [value, props])

  return (
    <View style={styles.inputContainer}>
      <MentionInput
        value={value}
        onChange={handleTextChange}
        partTypes={suggestionConfig}
        placeholder={placeholder}
        containerStyle={styles.mentionsStyles}
        style={styles.input}
        // selectionColor={colors.fontColorGrey}
        // inputRef={inputRef}
      />
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
    color: colors.fontColor,
    fontSize: 16,
  },
  inlineMention: {
    color: colors.fontColorHighlighted,
    fontWeight: '600',
  },
  inlineHashtag: {
    color: colors.fontColorGrey,
  },
  inlineUrl: {
    color: colors.fontColorGrey,
  },
})

import React, { useCallback, useEffect, useState } from 'react'
import { StyleProp, StyleSheet, ViewStyle } from 'react-native'
import { MentionInput, MentionSuggestionsProps } from 'react-native-controlled-mentions'

import HoliRichTextInputSuggestions from '@holi/ui/components/organisms/HoliRichTextInput.suggestions'
import { REGEX_URL, SuggestionItem } from '@holi/ui/helper/richText'
import { colors } from '@holi/ui/styles/globalVars'

// TODOs
// ====================
// - cursor should be behind replaced item
// - arrow down for mention selection
// - duplicate keys error

const MIN_SEARCH_CHARS = 1

export type SearchFunction = (keyword: string) => SuggestionItem[]

export type HoliRichTextInputProps = {
  initalValue?: string
  placeholder?: string
  findMentionsByKeyword?: SearchFunction
  findHashtagsByKeyword?: SearchFunction
  onChange?: (text: string) => void
  onSelectSuggestion?: (suggestion: SuggestionItem) => void
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
      const onChooseSuggestion = (suggestion: SuggestionItem) => {
        onSuggestionPress(suggestion)
        props.onSelectSuggestion && props.onSelectSuggestion(suggestion)
      }
      return (
        <HoliRichTextInputSuggestions suggestions={searchFunction(keyword)} onChooseSuggestion={onChooseSuggestion} />
      )
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
    // props?.onChange?.(String(value))
  }, [])

  useEffect(() => props?.onChange?.(String(value)), [value, props])

  return (
    <MentionInput
      value={value}
      onChange={handleTextChange}
      partTypes={suggestionConfig}
      placeholder={placeholder}
      containerStyle={[styles.mentionsStyles, props.style]}
      style={styles.input}
      // selectionColor={colors.fontColorGrey}
      // inputRef={inputRef}
    />
  )
}

export default HoliRichTextInput

const styles = StyleSheet.create({
  mentionsStyles: {
    flexDirection: 'column-reverse' /* input on top and suggestions below */,
    zIndex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
  },
  input: {
    width: '100%',
    paddingVertical: 10,
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

import React, { useCallback, useEffect, useState } from 'react'
import { StyleProp, StyleSheet, ViewStyle } from 'react-native'
import { MentionInput, MentionSuggestionsProps } from 'react-native-controlled-mentions'

import HoliRichTextInputSuggestions from '@holi/ui/components/organisms/HoliRichTextInput.suggestions'
import { REGEX_URL, SuggestionItem } from '@holi/ui/helper/richText'
import { colors } from '@holi/ui/styles/globalVars'

const MIN_SEARCH_CHARS = 2

export type SearchFunction = (keyword: string) => SuggestionItem[]

export type HoliRichTextInputProps = {
  initalValue?: string
  placeholder?: string
  autofocus?: boolean
  findMentionsByKeyword?: SearchFunction
  findHashtagsByKeyword?: SearchFunction
  onChange?: (text: string) => void
  onSelectSuggestion?: (suggestion: SuggestionItem) => void
  style?: StyleProp<ViewStyle>
  inputStyle?: StyleProp<ViewStyle>
  testID?: string
}

const HoliRichTextInput: React.VFC<HoliRichTextInputProps> = ({ initalValue = '', placeholder = '...', ...props }) => {
  const [value, setValue] = useState(initalValue)

  const getRenderFunction = (searchFunction: SearchFunction) => {
    const onRenderSuggestions: React.VFC<MentionSuggestionsProps> = ({ keyword, onSuggestionPress }) => {
      if (keyword == null || keyword.trim().length < MIN_SEARCH_CHARS) {
        return null
      }
      const onChooseSuggestion = (suggestion: SuggestionItem) => {
        onSuggestionPress(suggestion)
        props.onSelectSuggestion && props.onSelectSuggestion(suggestion)
      }
      console.log('render suggestions with ', searchFunction, keyword)
      return (
        <HoliRichTextInputSuggestions
          keyword={keyword}
          findSuggestions={searchFunction}
          onChooseSuggestion={onChooseSuggestion}
        />
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
  }, [])

  useEffect(() => props?.onChange?.(String(value)), [value, props])

  return (
    <MentionInput
      value={value}
      autoFocus
      onChange={handleTextChange}
      partTypes={suggestionConfig}
      placeholder={placeholder}
      containerStyle={[styles.mentionsStyles, props.style]}
      style={styles.input}
      testID={props.testID}
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

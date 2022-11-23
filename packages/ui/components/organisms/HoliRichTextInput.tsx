import React, { useCallback, useEffect, useState } from 'react'
import { StyleProp, StyleSheet, ViewStyle } from 'react-native'
import { MentionInput, MentionSuggestionsProps } from 'react-native-controlled-mentions'

import HoliRichTextInputSuggestions from '@holi/ui/components/organisms/HoliRichTextInput.suggestions'
import { REGEX_URL, REGEX_USER_MENTIONS_WITH_NAME, SuggestionItem } from '@holi/ui/helper/richText'
import { colors } from '@holi/ui/styles/globalVars'

const MIN_SEARCH_CHARS = 2

export type SearchFunction = (keyword: string) => SuggestionItem[]

export type HoliRichTextInputProps = {
  initalValue?: string
  placeholder?: string
  autofocus?: boolean
  onChange?: (text: string) => void
  onSelectSuggestion?: (suggestion: SuggestionItem) => void
  style?: StyleProp<ViewStyle>
  inputStyle?: StyleProp<ViewStyle>
  testID?: string
}

const HoliRichTextInput: React.VFC<HoliRichTextInputProps> = ({
  initalValue = '',
  placeholder = '...',
  onChange,
  ...props
}) => {
  const [value, setValue] = useState(initalValue)

  // import { UserByNameResponse, userByNameQuery } from '@holi/core/screens/userprofile/queries'
  // const [getUserByName, { loading, error, data }] = useLazyQuery<UserByNameResponse>(userByNameQuery, {
  //   variables: {
  //     substring: '',
  //   },
  // })

  const renderUserSuggestions: React.VFC<MentionSuggestionsProps> = ({ keyword, onSuggestionPress }) => {
    if (keyword == null || keyword.trim().length < MIN_SEARCH_CHARS) {
      return null
    }
    const onChooseSuggestion = (suggestion: SuggestionItem) => {
      onSuggestionPress(suggestion)
      props.onSelectSuggestion && props.onSelectSuggestion(suggestion)
    }
    return <HoliRichTextInputSuggestions keyword={keyword} onChooseSuggestion={onChooseSuggestion} />
  }

  const suggestionConfig = []
  suggestionConfig.push({
    trigger: '@',
    renderSuggestions: renderUserSuggestions,
    textStyle: styles.inlineMention,
  })

  // TODO: for later usage
  // suggestionConfig.push({
  //   trigger: '#',
  //   renderSuggestions: renderHashtagSuggestions,
  //   textStyle: styles.inlineHashtag,
  // })

  // Nice to have: url highlighting
  suggestionConfig.push({
    pattern: REGEX_URL,
    textStyle: styles.inlineUrl,
  })

  const onInputChange = useCallback((text: string) => {
    setValue(String(text))
  }, [])

  useEffect(() => {
    const holiFormattedString = String(value).replace(REGEX_USER_MENTIONS_WITH_NAME, '@$1')
    onChange?.(holiFormattedString)
  }, [value, onChange])

  return (
    <MentionInput
      value={value}
      autoFocus
      onChange={onInputChange}
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

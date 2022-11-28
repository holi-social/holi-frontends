import { useLazyQuery } from '@apollo/client'
import React, { useCallback, useEffect, useState } from 'react'
import { StyleProp, StyleSheet, ViewStyle } from 'react-native'
import { MentionInput, MentionSuggestionsProps } from 'react-native-controlled-mentions'

import { UserByNameResponse, userByNameQuery } from '@holi/core/screens/userprofile/queries'
import type { User } from '@holi/core/screens/userprofile/types'
import HoliRichTextInputSuggestions from '@holi/ui/components/organisms/HoliRichTextInput/Suggestions'
import { REGEX_URL, REGEX_USER_MENTIONS_WITH_NAME } from '@holi/ui/helper/richText'
import { colors } from '@holi/ui/styles/globalVars'

export type HoliRichTextInputProps = {
  initalValue?: string
  placeholder?: string
  autofocus?: boolean
  minSearchChars?: number
  maxSuggestionOptions?: number
  debounceDelay?: number
  onChange?: (text: string) => void
  onSelectSuggestion?: (suggestion: User) => void
  style?: StyleProp<ViewStyle>
  inputStyle?: StyleProp<ViewStyle>
  testID?: string
}

const HoliRichTextInput: React.VFC<HoliRichTextInputProps> = ({
  initalValue = '',
  placeholder = '...',
  minSearchChars = 2,
  maxSuggestionOptions = 5,
  debounceDelay = 300,
  onChange,
  ...props
}) => {
  const [value, setValue] = useState(initalValue)
  const [findUsersByName] = useLazyQuery<UserByNameResponse>(userByNameQuery)

  const findUserMapped: Promise<User[]> = useCallback(
    (substring: string) => {
      return new Promise((resolve, reject) => {
        findUsersByName({
          variables: {
            substring,
          },
        })
          .then((response) => resolve(response?.data?.userByName.data))
          .catch(reject)
      })
    },
    [findUsersByName]
  )

  const renderUserSuggestions: React.VFC<MentionSuggestionsProps> = ({ keyword, onSuggestionPress }) => {
    if (keyword == null || keyword.trim().length < minSearchChars) {
      return null
    }
    const onChooseSuggestion = (user: User) => {
      onSuggestionPress({ id: user.id, name: user.fullName })
      props.onSelectSuggestion?.(user)
    }
    return (
      <HoliRichTextInputSuggestions
        keyword={keyword}
        minSearchChars={minSearchChars}
        maxSuggestionOptions={maxSuggestionOptions}
        debounceDelay={debounceDelay}
        findUsersByName={findUserMapped}
        onChooseSuggestion={onChooseSuggestion}
      />
    )
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

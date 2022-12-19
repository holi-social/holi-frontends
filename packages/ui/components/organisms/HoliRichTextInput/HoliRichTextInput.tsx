import { useLazyQuery } from '@apollo/client'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { StyleProp, StyleSheet, TextInput, ViewStyle } from 'react-native'
import { MentionInput, MentionSuggestionsProps, Suggestion } from 'react-native-controlled-mentions'

import { useSafeDispatch } from '@holi/core/helpers'
import { usePortals } from '@holi/core/provider/PortalProvider'
import { UserByNameResponse, userByNameQuery } from '@holi/core/screens/userprofile/queries'
import type { User } from '@holi/core/screens/userprofile/types'
import HoliRichTextInputSuggestions from '@holi/ui/components/organisms/HoliRichTextInput/Suggestions'
import { REGEX_URL, REGEX_USER_MENTIONS_WITH_NAME } from '@holi/ui/helper/richText'
import { useDebounce } from '@holi/ui/helper/useDebounce'
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
  const inputRef = useRef<TextInput>(null)
  const [value, setValue] = useState(initalValue)
  const [suggestions, setSuggestions] = useState<User[]>([])
  const setSafeSuggestions = useSafeDispatch(setSuggestions)

  const [findUsersByName] = useLazyQuery<UserByNameResponse>(userByNameQuery)
  const { teleport } = usePortals()

  const INITIAL_KEYWORD = ''
  const [keyword, setKeyword] = useState(initalValue)
  const setSafeKeyword = useSafeDispatch(setKeyword)
  const [debouncedKeyword, setDebouncedKeyword] = useState<string>(INITIAL_KEYWORD)
  const setKeywordDebounced = useDebounce(useSafeDispatch(setDebouncedKeyword), debounceDelay)

  const onChooseOptionRef = useRef<(suggestion: Suggestion) => void | null>(() => null)

  // on mount / unmount
  useEffect(() => {
    // Stop the invocation of the debounced function after unmounting
    return () => setKeywordDebounced.cancel()
  }, [setKeywordDebounced])

  // on value change
  useEffect(() => {
    setKeywordDebounced(keyword)
  }, [keyword, setKeywordDebounced])

  const findUserMapped = useCallback(
    (substring: string) => {
      return new Promise((resolve, reject) => {
        findUsersByName({
          variables: {
            substring,
          },
        })
          .then((response) => resolve(response?.data?.userByName?.data?.slice(0, maxSuggestionOptions)))
          .catch(reject)
      })
    },
    [findUsersByName, maxSuggestionOptions]
  )

  // on debounced value change
  useEffect(() => {
    if (debouncedKeyword === INITIAL_KEYWORD) return setSafeSuggestions([])
    if (!debouncedKeyword || debouncedKeyword.length < minSearchChars) return setSafeSuggestions([])
    findUserMapped(debouncedKeyword).then(setSafeSuggestions)
  }, [debouncedKeyword, minSearchChars, findUserMapped, setSafeSuggestions])

  // on suggestions change
  useEffect(
    () => {
      if (!suggestions.length) return teleport('suggestions', null)

      const element = (
        <HoliRichTextInputSuggestions
          options={suggestions}
          onChooseSuggestion={(user: User) => {
            onChooseOptionRef.current({ id: user.id, name: user.fullName })
            props.onSelectSuggestion?.(user)
            inputRef?.current?.focus()
          }}
          testID={props.testID ? `${props.testID}-suggestions` : 'richtext-input-suggestions'}
        />
      )
      teleport('suggestions', element)
    },
    // `teleport` in the dependencies list causes endless loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [suggestions]
  )

  const onInputChange = useCallback(
    (text: string) => {
      setValue(`${text}`)
      const holiFormattedString = String(text).replace(REGEX_USER_MENTIONS_WITH_NAME, '@$1')
      onChange?.(holiFormattedString)
    },
    [onChange, setValue]
  )

  const renderUserSuggestions = useCallback(
    ({ keyword, onSuggestionPress }: MentionSuggestionsProps) => {
      setImmediate(() => setSafeKeyword(!keyword ? '' : keyword))
      onChooseOptionRef.current = onSuggestionPress
    },
    [setSafeKeyword]
  )

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

  return (
    <MentionInput
      inputRef={inputRef}
      value={value}
      autoFocus
      onChange={onInputChange}
      partTypes={suggestionConfig}
      placeholder={placeholder}
      containerStyle={[styles.mentionsStyles, props.style]}
      style={styles.input}
      testID={props.testID || 'richtext-input'}
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

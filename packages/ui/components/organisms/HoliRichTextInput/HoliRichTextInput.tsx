import { useLazyQuery } from '@apollo/client'
import type React from 'react'
import { type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  type NativeSyntheticEvent,
  type StyleProp,
  StyleSheet,
  type TextInput,
  type TextInputFocusEventData,
  View,
  type ViewStyle,
} from 'react-native'
import type { LayoutChangeEvent } from 'react-native'
import {
  MentionInput,
  type MentionSuggestionsProps,
  type PartType,
  type Suggestion,
} from 'react-native-controlled-mentions'

import { type UserByNameResponse, userByNameQuery } from '@holi/core/domain/shared/queries'
import type { User } from '@holi/core/domain/shared/types'
import { useSafeDispatch } from '@holi/core/helpers'
import { usePortals } from '@holi/core/providers/PortalProvider'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { TEXT_INPUT_HORIZONTAL_PADDING, TEXT_INPUT_VERTICAL_PADDING } from '@holi/ui/components/molecules/HoliTextInput'
import HoliRichTextInputSuggestions from '@holi/ui/components/organisms/HoliRichTextInput/Suggestions'
import { transformStringWithMentions } from '@holi/ui/components/organisms/HoliRichTextInput/helper/transformStringWithMentions'
import { REGEX_URL, REGEX_USER_MENTIONS_WITH_NAME } from '@holi/ui/helper/richText'
import { useDebounce } from '@holi/ui/helper/useDebounce'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'

export type HoliRichTextInputProps = {
  initialValue?: string
  placeholder?: string
  autofocus?: boolean
  minSearchChars?: number
  maxSuggestionOptions?: number
  debounceDelay?: number
  onChange?: (text: string) => void
  onFocus?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void
  onBlur?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void
  onSelectSuggestion?: (suggestion: User) => void
  style?: StyleProp<ViewStyle>
  inputStyle?: StyleProp<ViewStyle>
  testID?: string
  showCharacterCount?: boolean
  maxNoOfCharacters?: number
  inputAccessoryViewID?: string
  placeholderTextColor?: string
  initialSelectedSuggestion?: Suggestion
  mentions?: User[]
  isEdit?: boolean
  scrollEnabled?: boolean
  onLayout?: (event: LayoutChangeEvent) => void
  postAuthor?: User
}

const HoliRichTextInput: React.FC<HoliRichTextInputProps> = ({
  initialValue = '',
  placeholder = '...',
  autofocus = false,
  minSearchChars = 2,
  maxSuggestionOptions = 5,
  debounceDelay = 300,
  inputAccessoryViewID,
  placeholderTextColor,
  onChange,
  onFocus = () => null,
  onBlur = () => null,
  initialSelectedSuggestion,
  mentions,
  scrollEnabled = true, // default value of the scrollEnabled prop in MentionInput
  postAuthor,
  ...props
}) => {
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])

  const inputRef = useRef<TextInput>(null)
  const [value, setValue] = useState(initialValue)
  const [suggestions, setSuggestions] = useState<User[]>([])
  const setSafeSuggestions = useSafeDispatch(setSuggestions)

  const [findUsersByName] = useLazyQuery<UserByNameResponse>(userByNameQuery)
  const { teleport } = usePortals()

  const INITIAL_KEYWORD = ''
  const [keyword, setKeyword] = useState(initialValue)
  const setSafeKeyword = useSafeDispatch(setKeyword)
  const [debouncedKeyword, setDebouncedKeyword] = useState<string>(INITIAL_KEYWORD)
  const setKeywordDebounced = useDebounce(useSafeDispatch(setDebouncedKeyword), debounceDelay)

  const onChooseOptionRef = useRef<(suggestion: Suggestion) => void | null>(() => null)

  const [characterCount, setCharacterCount] = useState(0)
  const [disabled] = useState(false)

  // Track if @ is in the text
  const hasAtSymbol = useRef(false)

  useEffect(() => {
    // only run the transformation when initialValue and mentions changes AND the value is the same as initialValue
    // this is to avoid the transformation when the user is typing, which can break the mentioning logic
    if (initialValue === value) {
      return setValue(transformStringWithMentions(initialValue, mentions || []))
    }
    if (value === '') {
      setSafeSuggestions([])
      hasAtSymbol.current = false
    }
  }, [mentions, initialValue, value, setSafeSuggestions])

  // on mount / unmount
  useEffect(() => {
    // Stop the invocation of the debounced function after unmounting
    return () => setKeywordDebounced.cancel()
  }, [setKeywordDebounced])

  useEffect(() => {
    if (initialSelectedSuggestion) {
      onChooseOptionRef.current(initialSelectedSuggestion)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // on value change
  useEffect(() => {
    setKeywordDebounced(keyword)
  }, [keyword, setKeywordDebounced])

  const findUserMapped = useCallback(
    (substring: string): Promise<User[]> => {
      // If substring is empty (just typed @) and we have a post author
      if (substring === '' && postAuthor) {
        // Return only the post author immediately
        return Promise.resolve([postAuthor])
      }

      return new Promise((resolve, reject) => {
        findUsersByName({
          variables: {
            substring,
            offset: 0,
            limit: maxSuggestionOptions,
          },
        })
          .then((response) => resolve(response?.data?.userByName?.data?.slice(0, maxSuggestionOptions) ?? []))
          .catch(reject)
      })
    },
    [maxSuggestionOptions, findUsersByName, postAuthor]
  )

  // on debounced value change
  useEffect(() => {
    // Skip search if keyword is empty
    if (debouncedKeyword === INITIAL_KEYWORD) return

    // Skip search if keyword is too short
    if (!debouncedKeyword || debouncedKeyword.length < minSearchChars) {
      setSafeSuggestions([])
      return
    }

    // Normal search for non-empty keywords
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
            setSafeSuggestions([])
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
      const maxChars = props.maxNoOfCharacters || Number.POSITIVE_INFINITY
      const currentCharacterCount = text.length

      // Check if the new input is within the character limit
      if (currentCharacterCount <= maxChars) {
        setValue(text)
        setCharacterCount(currentCharacterCount)
        const holiFormattedString = String(text).replace(REGEX_USER_MENTIONS_WITH_NAME, '@$1')
        onChange?.(holiFormattedString)
      }
    },
    [onChange, setValue, setCharacterCount, props.maxNoOfCharacters]
  )

  const renderUserSuggestions = useCallback(
    ({ keyword, onSuggestionPress }: MentionSuggestionsProps) => {
      requestAnimationFrame(() => setSafeKeyword(!keyword ? '' : keyword))
      onChooseOptionRef.current = onSuggestionPress

      // Update keyword for subsequent searches
      // Use setTimeout to avoid state updates during render
      setTimeout(() => {
        setSafeKeyword(!keyword ? '' : keyword)

        // When @ is typed (keyword is empty), show post author
        if (keyword === '' && postAuthor) {
          findUserMapped('').then(setSafeSuggestions)
        }
      }, 0)

      return null
    },
    [postAuthor, findUserMapped, setSafeSuggestions, setSafeKeyword]
  )

  const suggestionConfig = useMemo(() => {
    const config: PartType[] = []
    config.push({
      trigger: '@',
      renderSuggestions: renderUserSuggestions as (props: MentionSuggestionsProps) => ReactNode,
      textStyle: styles.inlineMention,
      isInsertSpaceAfterMention: true,
      allowedSpacesCount: 0,
    })

    // Nice to have: url highlighting
    config.push({
      pattern: REGEX_URL,
      textStyle: styles.inlineUrl,
    })

    return config
  }, [renderUserSuggestions, styles.inlineMention, styles.inlineUrl])

  const CharactersCount = () => {
    return (
      <View style={styles.charactorCountContainer}>
        {props.showCharacterCount && (
          <HoliText size="extrasmall" style={styles.charactorCountText}>
            {characterCount} / {props.maxNoOfCharacters}
          </HoliText>
        )}
      </View>
    )
  }

  return (
    <View style={props.style} testID={props.testID || 'richtext-component'} onLayout={props.onLayout}>
      <MentionInput
        inputRef={inputRef}
        value={value}
        autoFocus={autofocus}
        onChange={onInputChange}
        onFocus={onFocus}
        onBlur={onBlur}
        partTypes={suggestionConfig}
        placeholder={placeholder}
        containerStyle={[styles.mentionsStyles, props.style]}
        style={styles.input}
        placeholderTextColor={placeholderTextColor || (theme.dark ? theme.colors.foreground10 : undefined)}
        editable={!disabled}
        maxLength={props.maxNoOfCharacters}
        testID={(props.testID || 'richtext-component') + '-input'}
        inputAccessoryViewID={inputAccessoryViewID}
        scrollEnabled={scrollEnabled}
      />
      <CharactersCount />
    </View>
  )
}

export default HoliRichTextInput

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    mentionsStyles: {
      flexDirection: 'column-reverse' /* input on top and suggestions below */,
      zIndex: 1,
      alignItems: 'flex-start',
      justifyContent: 'flex-end',
    },
    input: {
      width: '100%',
      paddingVertical: TEXT_INPUT_VERTICAL_PADDING,
      paddingHorizontal: TEXT_INPUT_HORIZONTAL_PADDING,
      color: theme.colors.foreground30,
      fontSize: 16,
    },
    inlineMention: {
      color: theme.colors.brandColorB30,
      fontWeight: '600',
    },
    inlineHashtag: {
      color: theme.colors.foreground20,
    },
    inlineUrl: {
      color: theme.colors.foreground20,
    },
    charactorCountText: {
      color: theme.colors.foreground20,
    },
    charactorCountContainer: {
      flex: 1,
      alignItems: 'flex-end',
      marginTop: 6,
    },
  })

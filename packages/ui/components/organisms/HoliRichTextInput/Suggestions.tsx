import debounce from 'lodash.debounce'
import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { useSafeDispatch } from '@holi/core/helpers'
import type { User } from '@holi/core/screens/userprofile/types'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliUserAvatar from '@holi/ui/components/molecules/HoliUserAvatar'
import { colors } from '@holi/ui/styles/globalVars'

const INITIAL_VALUE = ''

export type HoliRichTextInputSuggestionsProps = {
  keyword: string
  minSearchChars: number
  maxSuggestionOptions: number
  debounceDelay: number
  findUsersByName: (substring: string) => Promise<User[]>
  onChooseSuggestion: (selectedSuggestion: User) => void
  testID: string
}

const HoliRichTextInputSuggestions: React.VFC<HoliRichTextInputSuggestionsProps> = ({
  keyword,
  minSearchChars,
  maxSuggestionOptions,
  debounceDelay,
  findUsersByName,
  onChooseSuggestion,
  testID,
}) => {
  const { t } = useTranslation()
  const [debouncedKeyword, setDebouncedKeyword] = useState<string>(INITIAL_VALUE)
  const setSafeDebouncedKeyword = useSafeDispatch(setDebouncedKeyword)
  const [suggestions, setSuggestions] = useState<User[]>([])
  const setSafeSuggestions = useSafeDispatch(setSuggestions)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const setValueDebounced = useCallback(
    debounce((someValue: string) => {
      setSafeDebouncedKeyword(someValue)
    }, debounceDelay),
    [keyword]
  )

  // Stop the invocation of the debounced function after unmounting
  useEffect(() => {
    return () => setValueDebounced.cancel()
  }, [setValueDebounced])

  useEffect(() => {
    return setValueDebounced(keyword)
  }, [keyword, setValueDebounced])

  useEffect(() => {
    if (debouncedKeyword === INITIAL_VALUE) return setSafeSuggestions([])
    if (debouncedKeyword.length < minSearchChars) return setSafeSuggestions([])
    findUsersByName(debouncedKeyword).then(setSafeSuggestions)
  }, [debouncedKeyword, minSearchChars, findUsersByName, setSafeSuggestions])

  return (
    <View style={[styles.suggestions]} testID={testID || 'holi-rich-text-input-suggestions'}>
      <View style={[styles.suggestionsContainer]}>
        {suggestions.slice(0, maxSuggestionOptions).map((item) => (
          <HoliButton
            key={item.id}
            label={t('comment.suggestionItem.label', { item: item.fullName })}
            transparent
            style={styles.suggestionItem}
            contentStyle={{ alignItems: 'center', flexDirection: 'row' }}
            onPress={() => onChooseSuggestion(item)}
            testID={testID ? `${testID}-item` : 'holi-rich-text-input-suggestions-item'}
          >
            <HoliUserAvatar
              imageSrc={item.avatar}
              label={item.fullName}
              initials={item.avatarLabel}
              defaultColor={item.avatarDefaultColor}
              size="micro"
            />
            <HoliText style={styles.suggestionItemText}>{item.fullName}</HoliText>
          </HoliButton>
        ))}
      </View>
    </View>
  )
}

const customComparator = (prevProps: HoliRichTextInputSuggestionsProps, nextProps: HoliRichTextInputSuggestionsProps) =>
  nextProps.keyword === prevProps.keyword

export default React.memo(HoliRichTextInputSuggestions, customComparator)

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
    paddingVertical: 7,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.borderColorGrey,
    minWidth: '100%',
  },
  suggestionItemText: {
    fontSize: 16,
    marginLeft: 10,
  },
})

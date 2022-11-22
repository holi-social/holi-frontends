import debounce from 'lodash.debounce'
import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliUserAvatar from '@holi/ui/components/molecules/HoliUserAvatar'
import { findUserByName } from '@holi/ui/helper/richText'
import type { SuggestionItem } from '@holi/ui/helper/richText'
import { colors } from '@holi/ui/styles/globalVars'

// TODO: replace with API, see HOLI-2533
const requestUsers = async (keyword: string) => {
  const requestPromise = new Promise<SuggestionItem[]>((resolve) => {
    const suggestionsList = findUserByName(keyword)
    resolve(suggestionsList)
  })
  return requestPromise
}

const MAX_SUGGESTIONS_COUNT = 5
const INITIAL_VALUE = ''

export type HoliRichTextInputSuggestionsProps = {
  keyword: string
  onChooseSuggestion: (selectedSuggestion: SuggestionItem) => void
}

const HoliRichTextInputSuggestions: React.VFC<HoliRichTextInputSuggestionsProps> = (props) => {
  const { t } = useTranslation()
  const [keyword, setKeyword] = useState<string>(INITIAL_VALUE)
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const setValueDebounced = useCallback(
    debounce((someValue: string) => {
      setKeyword(someValue)
    }, 100),
    [props.keyword]
  )

  // Stop the invocation of the debounced function after unmounting
  useEffect(() => {
    return () => setValueDebounced.cancel()
  }, [setValueDebounced])

  useEffect(() => {
    return setValueDebounced(props.keyword)
  }, [setValueDebounced, props.keyword])

  useEffect(() => {
    if (keyword === INITIAL_VALUE) return
    const fetchData = async () => {
      const suggestions = await requestUsers(keyword)
      setSuggestions(suggestions)
    }
    fetchData()
  }, [keyword])

  return (
    <View style={[styles.suggestions]}>
      <View style={[styles.suggestionsContainer]}>
        {suggestions.slice(0, MAX_SUGGESTIONS_COUNT).map((item) => (
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

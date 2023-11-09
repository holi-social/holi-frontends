import React, { memo, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View } from 'react-native'

import { useErrorHandling } from '@holi/core/errors/hooks'
import { useSafeAreaInsets } from '@holi/core/helpers/useSafeAreaInsets'
import { Pagination } from '@holi/core/pagination/Pagination'
import { PaginationQueryHookOptions } from '@holi/core/pagination/usePaginationQuery'
import SearchResults from '@holi/core/screens/search/components/SearchResults'
import { userByNameQuery } from '@holi/core/screens/userprofile/queries'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { SpinningIconContainer } from '@holi/icons/src/SpinningIconContainer'
import { Loader, Search } from '@holi/icons/src/generated'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliTextInput from '@holi/ui/components/molecules/HoliTextInput'
import { useDebounce } from '@holi/ui/helper'
import { vars } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

const USER_SEARCH_DEBOUNCE = 400
const MIN_SEARCH_TERM_CHARACTERS = 2
const USER_SEARCH_RESULT_PAGE_SIZE = 5

const SearchContent = () => {
  const { t } = useTranslation()
  const mixins = useStyleMixins()
  const { displayError } = useErrorHandling()
  const { top: safeAreaInsetTop } = useSafeAreaInsets()
  const [searchString, setSearchString] = useState('')

  const onSearchUserInputChange = (value: string) => setSearchString(value)
  const [inputIsLoading, setInputIsLoading] = useState(false)

  const trailingComponent = useMemo(() => {
    const icon = inputIsLoading ? Loader : Search
    return (
      <SpinningIconContainer spinning={!!inputIsLoading}>
        <HoliIcon icon={icon} size={22} />
      </SpinningIconContainer>
    )
  }, [inputIsLoading])

  const debouncedTriggerUserSearch = useDebounce(setSearchString, USER_SEARCH_DEBOUNCE)

  useEffect(() => {
    debouncedTriggerUserSearch(searchString)
  }, [debouncedTriggerUserSearch, searchString])

  const userSearchQueryOptions: PaginationQueryHookOptions = {
    pageSize: USER_SEARCH_RESULT_PAGE_SIZE,
    queryPath: 'userByName',
    onError: (error) => {
      displayError(error, 'Failed to search for users by name', {
        location: 'SearchLayout.userSearchQueryOptions',
      })
    },
    fetchPolicy: 'cache-and-network',
  }

  return (
    <View style={[mixins.container, styles.inner, { paddingTop: Platform.OS === 'android' ? safeAreaInsetTop : 0 }]}>
      <HoliTextInput
        value={searchString}
        placeholder={t('chat.start.input.label')}
        aria-label={t('chat.start.input.label')}
        trailingComponent={trailingComponent}
        onChange={onSearchUserInputChange}
      />
      <HoliBox padding={[24, 0, 0, 0]}>
        {searchString.length < MIN_SEARCH_TERM_CHARACTERS && <HoliText>{t('search.start.text')}</HoliText>}
        {searchString.length >= MIN_SEARCH_TERM_CHARACTERS && (
          <Pagination
            query={userByNameQuery}
            queryOptions={{
              ...userSearchQueryOptions,
              variables: {
                substring: searchString,
              },
            }}
            fetchMoreButtonProps={{
              type: 'secondary',
              style: mixins.moreButton,
              testID: 'btn-search-users-load-more',
            }}
            fetchMoreButtonLabel={t('search.section.users.loadMore')}
          >
            {
              // TODO: add query string to URL as q={string}
              // TODO: make screen with arrow down top left
            }
            <SearchResults searchString={searchString} setInputIsLoading={setInputIsLoading} />
          </Pagination>
        )}
      </HoliBox>
    </View>
  )
}

export default memo(SearchContent)

const styles = StyleSheet.create({
  inner: {
    flex: 1,
    // 16 is space between the header and the input
    // we do not use `paddingTop` for this spacing, because it will be overridden with `safeAreaInsetTop` for Android
    marginTop: +vars.topBarHeight + 16,
    ...Platform.select({
      web: {
        paddingBottom: vars.bottomBarHeight,
      },
      android: {
        paddingBottom: vars.bottomBarHeight,
      },
    }),
  },
})

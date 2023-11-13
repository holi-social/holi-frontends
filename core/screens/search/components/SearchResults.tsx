import React, { Dispatch, SetStateAction, useEffect } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { FlatList, Platform, StyleSheet, View } from 'react-native'

import { usePaginationContext } from '@holi/core/pagination/Pagination'
import SearchSkeleton from '@holi/core/screens/search/components/SearchSkeleton'
import { User } from '@holi/core/screens/userprofile/types'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import HoliLink from '@holi/ui/components/atoms/HoliLink'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliAvatar from '@holi/ui/components/molecules/HoliAvatar'

const USER_ITEM_HEIGHT = 48
const USER_ITEM_GAP = 16
const USER_SEARCH_RESULT_PAGE_SIZE = 5

interface SearchResultsProps {
  searchString: string
  setInputIsLoading: Dispatch<SetStateAction<boolean>>
}

const SearchResults = ({ searchString, setInputIsLoading }: SearchResultsProps) => {
  const { t } = useTranslation()
  const { loading, data: users } = usePaginationContext<User>()
  useEffect(() => {
    setInputIsLoading(!!loading)
  }, [setInputIsLoading, loading])

  if (loading) {
    return (
      <>
        <HoliText bold style={styles.sectionHeading}>
          {t('search.section.users')}
        </HoliText>
        <SearchSkeleton pageSize={USER_SEARCH_RESULT_PAGE_SIZE} />
      </>
    )
  }
  if (!users?.length) {
    return (
      <HoliText>
        <Trans t={t} i18nKey={'search.noResults'} values={{ searchString: searchString }}>
          <HoliText style={styles.italic} />
        </Trans>
      </HoliText>
    )
  }
  return (
    <>
      <HoliBox padding={[0, 0, 16, 0]}>
        <HoliText bold>{t('search.section.users')}</HoliText>
      </HoliBox>
      <FlatList
        data={users}
        renderItem={({ item: user }) => {
          return (
            <HoliLink
              style={[styles.flexRow]}
              href={`/profile/${user?.id}`}
              label={t('user.visitProfile', { name: user.fullName })}
            >
              <View style={[styles.flexRow, styles.flex]}>
                <HoliBox padding={[0, 16, 0, 0]}>
                  <HoliAvatar
                    imageSrc={user.avatar}
                    imageBlurhash={user.avatarBlurhash}
                    label={user.avatarLabel}
                    initials={user.avatarLabel}
                    defaultColor={user.avatarDefaultColor}
                    size="medium"
                  />
                </HoliBox>
                <View>
                  <HoliText>{user.fullName}</HoliText>
                </View>
              </View>
            </HoliLink>
          )
        }}
        keyExtractor={(item) => item.id}
        getItemLayout={(_, index) => ({
          length: USER_ITEM_HEIGHT,
          offset: USER_ITEM_HEIGHT * index,
          index,
        })}
        ItemSeparatorComponent={() => <View style={{ height: USER_ITEM_GAP }} />}
        // fix scrolling for web on small devices
        scrollEnabled={Platform.OS === 'web'}
        style={styles.flex}
        keyboardShouldPersistTaps="handled"
      />
    </>
  )
}

const styles = StyleSheet.create({
  sectionHeading: {
    paddingBottom: 16,
  },
  flex: {
    flex: 1,
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  italic: {
    fontStyle: 'italic',
  },
  userItem: {
    justifyContent: 'space-between',
  },
})

export default SearchResults

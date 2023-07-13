import { useQuery } from '@apollo/client'
import { withProfiler } from '@sentry/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, StyleSheet, View, ViewStyle } from 'react-native'

import { logError } from '@holi/core/errors/helpers'
import { useToastForNotAvailableFeature } from '@holi/core/helpers'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import SeeMore from '@holi/core/screens/homeFeed/components/SeeMore'
import { UserSuggestionsResponse, userSuggestionsQuery } from '@holi/core/screens/homeFeed/queries'
import { User } from '@holi/core/screens/userprofile/types'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliUserCard from '@holi/ui/components/molecules/HoliUserCard'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

export type UserSuggestionsProps = {
  style?: (ViewStyle | Record<string, unknown>) | (ViewStyle | Record<string, unknown>)[]
}

const UserSuggestions: React.VFC<UserSuggestionsProps> = (props: UserSuggestionsProps) => {
  const { t } = useTranslation()
  const { navigate } = useRouting()
  const mixins = useStyleMixins()
  const limit = 10

  // TODO: remove after implementing the feature
  const showFeatureNotImplementedToast = useToastForNotAvailableFeature()

  const { loading, error, data } = useQuery<UserSuggestionsResponse>(userSuggestionsQuery, {
    variables: { limit },
  })

  if (error) {
    logError(error, `[UserSuggestions.tsx] ${error.message}`)
  }

  // Error and loading states are handled the same way and just hide the component
  if (loading || error || !data?.userSuggestions?.data?.length) {
    return <></>
  }

  const userSuggestions = data.userSuggestions.data

  const renderItem = ({ item, index }: { item: User; index: number }) => {
    const nameLabel = item.fullName

    return (
      <HoliButton
        label={nameLabel || t('user.profileView.anonymous')}
        onPress={() => navigate(`/profile/${item.id}`)}
        style={styles.listItem}
        key={item.id}
        transparent
        inline
        testID={`user-card-suggestion-${index}`}
      >
        <HoliUserCard user={item} testID="user-card-suggestion" variant="small" disableFocusability />
      </HoliButton>
    )
  }

  return (
    <View style={[mixins.container, props.style]} testID="user-suggestions">
      <HoliHeading level="2" size="large">
        {t('homeFeed.userSuggestions.title')}
      </HoliHeading>

      <FlatList
        horizontal
        style={styles.itemsContainer}
        data={userSuggestions}
        renderItem={renderItem}
        ListFooterComponent={
          <SeeMore loading={loading} onPress={showFeatureNotImplementedToast} style={styles.listItem} />
        }
      />
    </View>
  )
}

export default withProfiler(UserSuggestions, { name: 'UserSuggestions' })

const styles = StyleSheet.create({
  itemsContainer: {
    marginTop: 24,
    marginHorizontal: -20,
    paddingLeft: 24,
    // scrollbar should not overlap labels
    paddingBottom: 10,
  },
  listItem: {
    marginRight: 11,
  },
})

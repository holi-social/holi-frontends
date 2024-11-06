import { useQuery } from '@apollo/client'
import { withProfiler } from '@sentry/react'
import { Text } from 'holi-bricks/components/text'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, StyleSheet, View } from 'react-native'

import { User } from '@holi/core/domain/shared/types'
import { logError } from '@holi/core/errors/helpers'
import { useToastForNotAvailableFeature } from '@holi/core/helpers'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useOnRefresh } from '@holi/core/refreshing/hooks/useOnRefresh'
import { UserSuggestionsResponse, userSuggestionsQuery } from '@holi/core/screens/homeFeed/queries'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import HoliMoreCard from '@holi/ui/components/atoms/HoliMoreCard'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliUserCard from '@holi/ui/components/molecules/HoliUserCard'

const UserSuggestions: React.FC = () => {
  const { t } = useTranslation()
  const { navigate } = useRouting()
  const limit = 10

  // TODO: remove after implementing the feature
  const showFeatureNotImplementedToast = useToastForNotAvailableFeature()

  const { loading, error, data, refetch } = useQuery<UserSuggestionsResponse>(userSuggestionsQuery, {
    variables: { limit },
    onError: (error) =>
      logError(error, 'Failed to load user suggestions', { location: 'UserSuggestions.userSuggestionsQuery' }),
  })
  useOnRefresh(refetch)

  // Error and loading states are handled the same way and just hide the component
  if (loading || error || !data?.userSuggestions?.data?.length) {
    return <></>
  }

  const userSuggestions = data.userSuggestions.data
  const labelSeeMore = t('global.seeMore')

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
    <HoliBox padding={[32, 0, 0, 0]}>
      <HoliContainer testID="user-suggestions">
        {/* Headline */}
        <Text size="3xl" headingLevel="2">
          {t('homeFeed.userSuggestions.title')}
        </Text>

        <FlatList
          horizontal
          style={styles.itemsContainer}
          data={userSuggestions}
          renderItem={renderItem}
          ListFooterComponent={
            <View style={styles.seeMoreButton}>
              <HoliMoreCard role="link" label={labelSeeMore} onPress={showFeatureNotImplementedToast}>
                {labelSeeMore}
              </HoliMoreCard>
            </View>
          }
        />
      </HoliContainer>
    </HoliBox>
  )
}

export default withProfiler(UserSuggestions, { name: 'UserSuggestions' })

const styles = StyleSheet.create({
  itemsContainer: {
    marginTop: 24,
    marginHorizontal: -20,
    paddingLeft: 24,
  },
  listItem: {
    marginRight: 11,
  },
  seeMoreButton: {
    flex: 1,
    marginRight: 44,
    width: 162,
  },
})

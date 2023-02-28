import { useQuery } from '@apollo/client'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, Platform, StyleSheet, View, ViewStyle, useWindowDimensions } from 'react-native'

import { logError } from '@holi/core/errors/helpers'
import { useToastForNotAvailableFeature } from '@holi/core/helpers'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { UserSuggestionsResponse, userSuggestionsQuery } from '@holi/core/screens/homeFeed/queries'
import { User } from '@holi/core/screens/userprofile/types'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliUserCard from '@holi/ui/components/molecules/HoliUserCard'
import { colors } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

export type UserSuggestionsProps = {
  style?: (ViewStyle | Record<string, unknown>) | (ViewStyle | Record<string, unknown>)[]
}

const UserSuggestions: React.VFC<UserSuggestionsProps> = (props: UserSuggestionsProps) => {
  const { t } = useTranslation()
  const { navigate } = useRouting()
  const { width: screenWidth } = useWindowDimensions()
  const mixins = useStyleMixins()
  const limit = 10

  const { loading, error, data } = useQuery<UserSuggestionsResponse>(userSuggestionsQuery, {
    variables: { limit },
  })

  // TODO: remove after implementing the feature
  const showFeatureNotImplementedToast = useToastForNotAvailableFeature()

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

  const labelSeeMore = t('homeFeed.userSuggestions.loadMore')
  const cardImageSize = Platform.OS === 'web' ? 160 : screenWidth / 2 - 26
  const seeMore = () => {
    return loading && Platform.OS !== 'web' ? (
      <View style={styles.loadingContainer}>
        <HoliIcon icon="loader-4" size={50} color={colors.foreground20} spinning />
      </View>
    ) : (
      <HoliButton
        label={labelSeeMore}
        style={[styles.listItem, styles.lastButtonContainer]}
        onPress={showFeatureNotImplementedToast}
        transparent
        inline
      >
        <HoliLocalImage
          imageSource={require('@holi/ui/assets/img/illustrations/illustration_see_more.png')}
          width={cardImageSize}
          height={cardImageSize}
          label=""
        />
        <View style={styles.seeMoreContainer}>
          <HoliText style={styles.seeMoreText} size="small" bold>
            {labelSeeMore}
          </HoliText>
        </View>
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
        ListFooterComponent={seeMore}
      />
    </View>
  )
}

export default UserSuggestions

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
  loadingContainer: {
    width: 160,
    height: 160,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background20,
  },
  lastButtonContainer: {
    marginRight: Platform.OS === 'web' ? 24 : 48,
    flexDirection: 'column',
    justifyContent: 'space-between',
    flex: 1,
  },
  seeMoreContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  seeMoreText: {
    color: colors.brandColorB30,
    textAlign: 'center',
    marginTop: 16,
  },
})

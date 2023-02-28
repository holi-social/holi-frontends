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
import { colors, vars } from '@holi/ui/styles/globalVars'
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
        style={styles.buttonContainer}
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
        style={[styles.buttonContainer, styles.lastButtonContainer]}
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
        ListHeaderComponentStyle={styles.listHeader}
        style={styles.itemsContainer}
        data={userSuggestions}
        renderItem={renderItem}
        ListFooterComponent={seeMore}
      />

      {/* <ScrollView style={styles.scrollviewContainer} horizontal>
        {userSuggestions.map((user, index) => {
          const nameLabel = user.fullName
          return (
            <HoliButton
              label={nameLabel || t('user.profileView.anonymous')}
              onPress={() => navigate(`/profile/${user.id}`)}
              style={styles.buttonContainer}
              key={user.id}
              transparent
              inline
              testID={`user-card-suggestion-${index}`}
            >
              <HoliUserCard user={user} testID="user-card-suggestion" variant="small" disableFocusability />
            </HoliButton>
          )
        })}
        <HoliButton
          label={t('homeFeed.userSuggestions.loadMore')}
          style={[styles.buttonContainer, styles.lastButtonContainer]}
          transparent
          inline
          onPress={showFeatureNotImplementedToast}
        >
          <View style={styles.moreSuggestionsImageContainer}>
            <HoliLocalImage
              imageSource={require('@holi/ui/assets/img/illustrations/illustration_see_more.png')}
              width={125.6}
              height={125.6}
              label=""
            />
          </View>
          <HoliText style={styles.moreSuggestionsText} size="small" bold>
            {t('homeFeed.userSuggestions.loadMore')}
          </HoliText>
        </HoliButton>
      </ScrollView> */}
    </View>
  )
}

export default UserSuggestions

const styles = StyleSheet.create({
  // scrollviewContainer: {
  //   paddingVertical: 16, // paddingBottom is necessary for the scroll bar not to touch the user names
  // },
  // buttonContainer: {
  //   marginRight: 8,
  // },
  // lastButtonContainer: {
  //   marginRight: 24,
  //   flexDirection: 'column',
  //   justifyContent: 'space-between',
  //   flex: 1,
  // },
  // moreSuggestionsImageContainer: {
  //   padding: 17.2,
  // },
  // moreSuggestionsText: {
  //   color: colors.brandColorB30,
  //   textAlign: 'center',
  //   marginTop: 16,
  // },
  listHeader: {
    paddingTop: vars.topBarHeight + 24,
    paddingBottom: 32,
  },

  itemsContainer: {
    paddingVertical: 24,
    marginHorizontal: -20,
    paddingLeft: 24,
  },
  buttonContainer: {
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

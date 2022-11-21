import { useQuery } from '@apollo/client'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, StyleSheet, View, ViewStyle } from 'react-native'

import { logError } from '@holi/core/errors/helpers'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { UserSuggestionsResponse, userSuggestionsQuery } from '@holi/core/screens/homeFeed/queries'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
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
  const mixins = useStyleMixins()
  const numberOfItems = 10

  const { loading, error, data } = useQuery<UserSuggestionsResponse>(userSuggestionsQuery, {
    variables: { numberOfItems },
  })

  if (error) {
    logError(error, `[UserSuggestions.tsx] ${error.message}`)
  }

  // Error and loading states are handled the same way and just hide the component
  if (loading || error || !data?.userSuggestions?.length) {
    return <></>
  }

  const { userSuggestions } = data

  return (
    <View style={[mixins.container, props.style]} testID="user-suggestions">
      <HoliHeading level="2" size="large">
        {t('homeFeed.userSuggestions.title')}
      </HoliHeading>

      <ScrollView style={styles.scrollviewContainer} horizontal>
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
        >
          <View style={styles.moreSuggestionsImageContainer}>
            <HoliLocalImage
              imageSource={require('@holi/ui/assets/img/illustrations/illustration_user_suggestions.png')}
              width={125.6}
              height={125.6}
              label=""
            />
          </View>
          <HoliText style={styles.moreSuggestionsText} size="small" bold>
            {t('homeFeed.userSuggestions.loadMore')}
          </HoliText>
        </HoliButton>
      </ScrollView>
    </View>
  )
}

export default UserSuggestions

const styles = StyleSheet.create({
  scrollviewContainer: {
    paddingVertical: 16, // paddingBottom is necessary for the scroll bar not to touch the user names
  },
  buttonContainer: {
    marginRight: 8,
  },
  lastButtonContainer: {
    marginRight: 24,
    flexDirection: 'column',
    justifyContent: 'space-between',
    flex: 1,
  },
  moreSuggestionsImageContainer: {
    padding: 17.2,
  },
  moreSuggestionsText: {
    color: colors.secondaryColor,
    textAlign: 'center',
    marginTop: 16,
  },
})

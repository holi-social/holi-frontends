import { useQuery } from '@apollo/client'
import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, ScrollView, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import { logError } from '@holi/core/errors/helpers'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { UserSuggestionsResponse, userSuggestionsQuery } from '@holi/core/screens/homeFeed/queries'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliUserCard from '@holi/ui/components/molecules/HoliUserCard'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

export type UserSuggestionsProps = {
  style?: StyleProp<ViewStyle>
}

const UserSuggestions: React.VFC<UserSuggestionsProps> = ({ style }: UserSuggestionsProps) => {
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
    <View style={style} testID="user-suggestions">
      <View style={mixins.container}>
        <HoliHeading level="2">{t('homeFeed.userSuggestions.title')}</HoliHeading>
      </View>
      <ScrollView style={[mixins.container, styles.scrollviewContainer]} horizontal>
        {userSuggestions.map((user) => (
          <HoliButton
            label={`${user.firstName} ${user.lastName}`}
            onPress={() => navigate(`/profile/${user.id}`)}
            style={styles.buttonContainer}
            key={user.id}
            transparent
            inline
          >
            <HoliUserCard user={user} testID="user-card-suggestion" variant="small" disableFocusability />
          </HoliButton>
        ))}
        <HoliButton
          label={t('homeFeed.userSuggestions.loadMore')}
          style={styles.lastButtonContainer}
          transparent
          inline
        >
          <HoliText size="small">{t('homeFeed.userSuggestions.loadMore')}</HoliText>
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
    marginLeft: 16,
    marginRight: 45,
    marginBottom: 30,
    alignSelf: 'center',
    ...Platform.select({
      web: { marginRight: 16 },
    }),
  },
})

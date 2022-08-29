import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, ScrollView, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import { getRandomUser } from '@holi/core/screens/topics/fakeTopics'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliUserCard from '@holi/ui/components/molecules/HoliUserCard'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

const dummyUsers = Array.from(' '.repeat(10), (_, idx) => getRandomUser(!(idx % 2)))

export type UserSuggestionsProps = {
  style?: StyleProp<ViewStyle>
}

const UserSuggestions: React.VFC<UserSuggestionsProps> = ({ style }: UserSuggestionsProps) => {
  const { t } = useTranslation()
  const styles = getStyles()
  const mixins = useStyleMixins()

  if (!dummyUsers?.length) {
    return <></>
  }

  return (
    <View style={style}>
      <View style={mixins.container}>
        <HoliHeading level="2">{t('homeFeed.userSuggestions.title')}</HoliHeading>
      </View>
      <ScrollView style={[mixins.container, styles.scrollviewContainer]} horizontal>
        {dummyUsers.map((user) => (
          <HoliButton
            style={styles.buttonContainer}
            key={user.id}
            label={`${user.firstName} ${user.lastName}`}
            transparent
            inline
          >
            <HoliUserCard user={user} variant="small" disableFocusability />
          </HoliButton>
        ))}
        <HoliButton
          label={t('homeFeed.userSuggestions.loadMore')}
          transparent
          inline
          style={styles.lastButtonContainer}
        >
          <HoliText size="small">{t('homeFeed.userSuggestions.loadMore')}</HoliText>
        </HoliButton>
      </ScrollView>
    </View>
  )
}

export default UserSuggestions

const getStyles = () =>
  StyleSheet.create({
    scrollviewContainer: {
      paddingVertical: 16, // paddingBottom is necessary for the scroll bar not to touch the user names
    },
    buttonContainer: {
      marginRight: 8,
    },
    lastButtonContainer: {
      marginLeft: 16,
      marginRight: 30,
      marginBottom: 30,
      alignSelf: 'center',
      ...Platform.select({
        web: { marginRight: 16 },
      }),
    },
  })

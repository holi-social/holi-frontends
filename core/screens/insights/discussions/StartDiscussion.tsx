import React from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import ResponsesContainer from '@holi/core/screens/insights/discussions/ResponsesContainer'
import HoliText from '@holi/ui/components/atoms/HoliText'
import Spacing from '@holi/ui/foundations/Spacing'
import { Avatar } from 'holi-bricks/components/avatar'

const StartDiscussion = () => {
  const { t } = useTranslation()
  const { user, isLoggedIn } = useLoggedInUser()

  return (
    <ResponsesContainer>
      <View style={styles.container}>
        {isLoggedIn && user && (
          <Avatar
            size="xs"
            initials={user.avatarLabel}
            imgPlaceholder={user.avatarBlurhash}
            label={user.fullName || t('user.profileView.anonymous')}
            source={user.avatar}
          />
        )}
        <HoliText color="gray300" bold size="small">
          {t('insights.discussions.start')}
        </HoliText>
      </View>
    </ResponsesContainer>
  )
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    gap: Spacing['3xs'],
    alignItems: 'center',
  },
})

export default StartDiscussion

import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import ResponsesContainer from '@holi/core/screens/insights/discussions/ResponsesContainer'
import { useLoggedInUser } from '@holi/core/screens/userprofile/useLoggedInUser'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliAvatar from '@holi/ui/components/molecules/HoliAvatar'
import Spacing from '@holi/ui/foundations/Spacing'

const StartDiscussion = () => {
  const { t } = useTranslation()
  const { user, isLoggedIn } = useLoggedInUser()

  return (
    <ResponsesContainer>
      <View style={styles.container}>
        {isLoggedIn && user && (
          <HoliAvatar
            imageSrc={user.avatar}
            imageBlurhash={user.avatarBlurhash}
            label={user.fullName || t('user.profileView.anonymous')}
            initials={user.avatarLabel || ''}
            defaultColor={user.avatarDefaultColor || ''}
            size="micro"
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

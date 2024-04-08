import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { useLoggedInUser } from '@holi/core/screens/userprofile/useLoggedInUser'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliAvatar from '@holi/ui/components/molecules/HoliAvatar'
import Spacing from '@holi/ui/foundations/Spacing'
import { colors } from '@holi/ui/styles/globalVars'

const StartDiscussion = () => {
  const { t } = useTranslation()
  const { user, isLoggedIn } = useLoggedInUser()

  return (
    <View style={styles.container}>
      {isLoggedIn && user && (
        <HoliAvatar
          imageSrc={user.avatar}
          imageBlurhash={user.avatarBlurhash}
          label={user.fullName || t('user.profileView.anonymous')}
          initials={user.avatarLabel || ''}
          defaultColor={user.avatarDefaultColor || ''}
          size="small"
        />
      )}
      <HoliText color="gray300" bold>
        {t('insights.discussions.start')}
      </HoliText>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: Spacing['3xs'],
    alignItems: 'center',
    paddingHorizontal: Spacing['3xs'],
    paddingVertical: Spacing.xxs,
    backgroundColor: colors.background20,
    borderColor: colors.gray100,
    borderWidth: 1,
    borderRadius: 4,
  },
})

export default StartDiscussion

import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, ViewStyle } from 'react-native'

import { colors } from '@holi//ui/styles/globalVars'
import { AuthContext } from '@holi/core/auth/AuthContextProvider'
import { userFullName } from '@holi/core/helpers'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { UserContext } from '@holi/core/screens/userprofile/UserContextProvider'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliUserAvatar from '@holi/ui/components/molecules/HoliUserAvatar'

export type LoginProfileButtonProps = {
  focused?: boolean
  style?: ViewStyle | Record<string, unknown>
  testID?: string
}

const LoginProfileButton: React.VFC<LoginProfileButtonProps> = ({ focused, ...props }) => {
  const { pathname, navigate } = useRouting()
  const { user } = useContext(UserContext)
  const { isLoggedIn } = useContext(AuthContext)
  const hasUserData = isLoggedIn && user
  const { t } = useTranslation()
  const isWeb = Platform.OS === 'web'

  let pathToGo = '/profile'

  if (isWeb) {
    pathToGo = pathname.includes('/login')
      ? '/registration'
      : pathname.includes('/registration')
      ? '/login'
      : '/profile'
  }

  return (
    <HoliButton
      label={t('profile.title')}
      inline
      transparent
      onPress={() => navigate(pathToGo)}
      {...props}
      testID="btn-to-profile-view"
    >
      {hasUserData ? (
        <HoliUserAvatar
          imageSrc={user.avatar}
          label={userFullName(user) || t('user.profileView.anonymous')}
          initials={user.avatarLabel}
          defaultColor={user.avatarDefaultColor}
          size="micro"
          style={focused && styles.userAvatarHighlighted}
        />
      ) : (
        <HoliIcon
          filled={focused}
          color={focused ? colors.fontColorBlack : colors.fontColorGrey}
          icon="account-circle"
          size={24}
        />
      )}
    </HoliButton>
  )
}

export default LoginProfileButton

const styles = StyleSheet.create({
  userAvatarHighlighted: {
    borderColor: colors.backgroundColorBlack,
    borderWidth: 2,
  },
})

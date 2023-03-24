import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, ViewStyle } from 'react-native'

import { colors } from '@holi//ui/styles/globalVars'
import { useAuth } from '@holi/core/auth/helpers/useAuth'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useLoggedInUser } from '@holi/core/screens/userprofile/UserContextProvider'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliAvatar from '@holi/ui/components/molecules/HoliAvatar'
import HoliButton from '@holi/ui/components/molecules/HoliButton'

export type LoginProfileButtonProps = {
  focused?: boolean
  style?: ViewStyle | Record<string, unknown>
  testID?: string
}

const LoginProfileButton = ({
  focused,
  children,
  style,
  ...props
}: React.PropsWithChildren<LoginProfileButtonProps>) => {
  const { navigate } = useRouting()
  const { user } = useLoggedInUser()
  const { isLoggedIn } = useAuth()
  const hasUserData = isLoggedIn && user
  const { t } = useTranslation()

  return (
    <HoliButton
      label={t('profile.title')}
      inline
      transparent
      onPress={() => navigate('/profile')}
      contentStyle={[styles.button, style]}
      {...props}
      testID="btn-to-profile-view"
    >
      {hasUserData ? (
        <HoliAvatar
          imageSrc={user.avatar}
          label={user.fullName || t('user.profileView.anonymous')}
          initials={user.avatarLabel}
          defaultColor={user.avatarDefaultColor}
          size="micro"
          style={focused && styles.userAvatarHighlighted}
        />
      ) : (
        <HoliIcon
          filled={focused}
          color={focused ? colors.foreground30 : colors.foreground20}
          icon="account-circle"
          size={24}
        />
      )}

      {children}
    </HoliButton>
  )
}

export default LoginProfileButton

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
  },
  userAvatarHighlighted: {
    borderColor: colors.foreground30,
    borderWidth: 2,
  },
})

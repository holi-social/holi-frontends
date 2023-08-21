import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, ViewStyle } from 'react-native'

import { colors } from '@holi//ui/styles/globalVars'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useLoggedInUser } from '@holi/core/screens/userprofile/useLoggedInUser'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { AccountCircle, AccountCircleFilled } from '@holi/icons/src/generated'
import HoliAvatar from '@holi/ui/components/molecules/HoliAvatar'
import HoliButton from '@holi/ui/components/molecules/HoliButton'

export type LoginProfileButtonProps = {
  focused?: boolean
  floatingFooter?: boolean
  style?: ViewStyle | Record<string, unknown>
  testID?: string
}

const LoginProfileButton = ({
  focused,
  floatingFooter,
  children,
  style,
  ...props
}: React.PropsWithChildren<LoginProfileButtonProps>) => {
  const { navigate } = useRouting()
  const { user } = useLoggedInUser()
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
      {user ? (
        <HoliAvatar
          imageSrc={user.avatar}
          imageBlurhash={user.avatarBlurhash}
          label={user.fullName || t('user.profileView.anonymous')}
          initials={user.avatarLabel}
          defaultColor={user.avatarDefaultColor}
          size={floatingFooter ? 'medium' : 'micro'}
          style={[styles.avatar, focused && styles.userAvatarHighlighted]}
          testID="logged-in-profile"
        />
      ) : (
        <HoliIcon
          icon={focused ? AccountCircleFilled : AccountCircle}
          color={focused ? colors.foreground30 : colors.foreground20}
          size={floatingFooter ? 32 : undefined}
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
  avatar: {
    maxWidth: 32,
    maxHeight: 32,
  },
  userAvatarHighlighted: {
    borderColor: colors.foreground30,
    borderWidth: 2,
  },
})

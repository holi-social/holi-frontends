import { createStyleSheet } from 'holi-bricks/styles'
import type React from 'react'
import { useTranslation } from 'react-i18next'
import { type ViewStyle } from 'react-native'

import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { AccountCircle, AccountCircleFilled } from '@holi/icons/src/generated'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { Avatar } from 'holi-bricks/components/avatar'

export type LoginProfileButtonProps = {
  focused?: boolean
  style?: ViewStyle | Record<string, unknown>
  testID?: string
}

const LoginProfileButton = ({
  focused = false,
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
      testID={user ? 'btn-to-profile-view' : 'btn-to-anonymous-profile-view'}
    >
      {user ? (
        <Avatar
          source={user.avatar}
          label={user.fullName || t('user.profileView.anonymous')}
          initials={user.avatarLabel}
          size="xs"
          testID="logged-in-profile"
          border="light"
        />
      ) : (
        <HoliIcon icon={focused ? AccountCircleFilled : AccountCircle} colorOverride={styles.icon(focused).color} />
      )}

      {children}
    </HoliButton>
  )
}

export default LoginProfileButton

const styles = createStyleSheet((theme) => ({
  icon: (focused: boolean) => ({
    color: focused ? theme.colors.fill.main : theme.colors.fill.default,
  }),
  button: {
    alignItems: 'center',
  },
  userAvatarHighlighted: {
    borderColor: theme.colors.border.default,
    borderWidth: 2,
  },
}))

import { useStyles } from 'holi-bricks/hooks'
import { createStyleSheet } from 'holi-bricks/utils'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, ViewStyle } from 'react-native'

import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { AccountCircle, AccountCircleFilled } from '@holi/icons/src/generated'
import HoliAvatar from '@holi/ui/components/molecules/HoliAvatar'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

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
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])
  const { styles: unistyles } = useStyles(stylesheet)

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
          size="micro"
          style={focused && styles.userAvatarHighlighted}
          testID="logged-in-profile"
        />
      ) : (
        <HoliIcon icon={focused ? AccountCircleFilled : AccountCircle} color={unistyles.icon(focused).color} />
      )}

      {children}
    </HoliButton>
  )
}

export default LoginProfileButton

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    button: {
      alignItems: 'center',
    },
    userAvatarHighlighted: {
      borderColor: theme.colors.foreground30,
      borderWidth: 2,
    },
  })

const stylesheet = createStyleSheet((theme) => ({
  icon: (focused: boolean) => ({
    color: focused ? theme.colors.text : theme.colors.textTertiary,
  }),
}))

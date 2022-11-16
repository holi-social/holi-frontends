import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, ViewStyle } from 'react-native'

import { AuthContext } from '@holi/core/auth/AuthContextProvider'
import { userFullName } from '@holi/core/helpers'
import { useNavigationContext } from '@holi/core/navigation/NavigationContextProvider'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { UserContext } from '@holi/core/screens/userprofile/UserContextProvider'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliUserAvatar from '@holi/ui/components/molecules/HoliUserAvatar'

export type HeaderRightProps = {
  focused?: boolean
  style?: ViewStyle | Record<string, unknown>
  testID?: string
}

const HeaderRight: React.VFC<HeaderRightProps> = (props) => {
  const { pathname, navigate } = useRouting()
  const { headerRight } = useNavigationContext()
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

  if (headerRight) return React.cloneElement(headerRight, { style: props.style })

  let userAvatar
  if (hasUserData) {
    const nameLabel = userFullName(user)

    userAvatar = (
      <HoliUserAvatar
        imageSrc={user.avatar}
        label={nameLabel || t('user.profileView.anonymous')}
        initials={user.avatarLabel}
        defaultColor={user.avatarDefaultColor}
        size="micro"
      />
    )
  }
  return (
    <HoliButton
      label={t('profile.title')}
      inline
      transparent
      onPress={() => navigate(pathToGo)}
      {...props}
      style={props.style}
      testID="btn-to-profile-view"
    >
      {hasUserData ? userAvatar : <HoliIcon filled={props.focused} icon="account-circle" size={24} />}
    </HoliButton>
  )
}

export default HeaderRight

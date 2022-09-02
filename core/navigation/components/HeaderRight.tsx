import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { ViewStyle } from 'react-native'

import { AuthContext } from '@holi/core/auth/AuthContextProvider'
import { useNavigationContext } from '@holi/core/navigation/NavigationContextProvider'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { UserContext } from '@holi/core/screens/userprofile/UserContextProvider'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliUserAvatar from '@holi/ui/components/molecules/HoliUserAvatar'

export type HeaderRightProps = {
  style?: ViewStyle | Record<string, unknown>
  testID?: string
}

const HeaderRight: React.VFC<HeaderRightProps> = (props) => {
  const { navigate } = useRouting()
  const { headerRight } = useNavigationContext()
  const { user } = useContext(UserContext)
  const { isLoggedIn } = useContext(AuthContext)
  const hasUserData = isLoggedIn && user
  const { t } = useTranslation()

  // FIXME: login test fails
  // const pathToGo = pathname.includes('/login')
  //   ? '/registration'
  //   : pathname.includes('/registration')
  //   ? '/login'
  //   : '/profile'
  const pathToGo = '/profile'

  if (headerRight) return headerRight

  let userAvatar
  if (hasUserData) {
    const nameLabel = `${user.firstName || ''} ${user.lastName || ''}`.trim()

    userAvatar = (
      <HoliUserAvatar
        imageSrc={user.avatar}
        label={nameLabel === '' ? t('navigation.headerRight.avatarFallbackLabel') : nameLabel}
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
      {hasUserData ? userAvatar : <HoliIcon icon="account-circle" size={24} />}
    </HoliButton>
  )
}

export default HeaderRight

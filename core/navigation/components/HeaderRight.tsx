import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { ViewStyle } from 'react-native'

import { AuthContext } from '@holi/core/auth/AuthProvider'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { UserContext } from '@holi/core/user/UserContextProvider'
import HoliButton from '@holi/ui/components/HoliButton'
import HoliIcon from '@holi/ui/components/HoliIcon'
import HoliUserAvatar from '@holi/ui/components/HoliUserAvatar'

export type HeaderRightProps = {
  style?: ViewStyle | Record<string, unknown>
  testID?: string
}

const HeaderRight: React.VoidFunctionComponent<HeaderRightProps> = (props: HeaderRightProps) => {
  const { navigate } = useRouting()

  const { user } = useContext(UserContext)
  const { isLoggedIn } = useContext(AuthContext)
  const hasUserData = isLoggedIn && user
  const { t } = useTranslation()

  // TODO: navigate to user profile!
  const profileUrl = '/profile/danbim'

  let userAvatar
  if (hasUserData) {
    const avatarLabel = `${user.firstName || ''} ${user.lastName || ''}`.trim()

    userAvatar = (
      <HoliUserAvatar
        imageSrc={user.avatar}
        nameLabel={avatarLabel === '' ? t('navigation.headerRight.avatarFallbackLabel') : avatarLabel}
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
      variant="transparent"
      onPress={() => navigate(profileUrl)}
      {...props}
      style={props.style}
      testID="profile-button"
    >
      {hasUserData ? userAvatar : <HoliIcon icon="user-circled" size={20} />}
    </HoliButton>
  )
}

export default HeaderRight

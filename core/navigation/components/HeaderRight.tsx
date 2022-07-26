import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { ViewStyle } from 'react-native'

import { AuthContext } from '@holi/core/auth/AuthContextProvider'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { UserContext } from '@holi/core/screens/userprofile/UserContextProvider'
import HoliIcon from '@holi/ui/components/HoliIcon'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliUserAvatar from '@holi/ui/components/molecules/HoliUserAvatar'

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
    const nameLabel = `${user.firstName || ''} ${user.lastName || ''}`.trim()

    userAvatar = (
      <HoliUserAvatar
        imageSrc={user.avatar}
        nameLabel={nameLabel === '' ? t('navigation.headerRight.avatarFallbackLabel') : nameLabel}
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
      onPress={() => navigate(profileUrl)}
      {...props}
      style={props.style}
      testID="btn-to-profile-view"
    >
      {hasUserData ? userAvatar : <HoliIcon icon="user-circled" size={20} />}
    </HoliButton>
  )
}

export default HeaderRight

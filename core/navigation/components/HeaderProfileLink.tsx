import React, { useContext } from 'react'
import { ViewStyle } from 'react-native'

import { AuthContext } from '@holi/core/auth/AuthProvider'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { UserContext } from '@holi/core/user/UserContextProvider'
import HoliButton from '@holi/ui/components/HoliButton'
import HoliIcon from '@holi/ui/components/HoliIcon'
import HoliUserAvatar from '@holi/ui/components/HoliUserAvatar'

export type HeaderProfileLinkProps = {
  style?: ViewStyle | Record<string, unknown>
  testID?: string
}

const HeaderProfileLink: React.VoidFunctionComponent<HeaderProfileLinkProps> = (props: HeaderProfileLinkProps) => {
  const { navigate } = useRouting()

  const { user } = useContext(UserContext)
  const { isAuthenticated } = useContext(AuthContext)

  // TODO: navigate to user profile!
  const profileUrl = '/profile/danbim'

  let userAvatar
  if (isAuthenticated && user) {
    // TODO: hand over email, when firstName is empty
    const userImageLabel = user.firstName || 'unnamed user'

    // TODO: should be generated during user registration process (HOLI-1525)
    const userDefaultColor = '#0f0'
    userAvatar = (
      <HoliUserAvatar imageSrc={user.avatar} nameLabel={userImageLabel} defaultColor={userDefaultColor} size="micro" />
    )
  }

  return (
    <HoliButton
      label="Profile"
      inline
      transparent
      onPress={() => navigate(profileUrl)}
      {...props}
      style={[{ paddingHorizontal: 0 }, props.style]}
      testID="profile-button"
    >
      {isAuthenticated && user ? userAvatar : <HoliIcon icon="user-circled" size={20} />}
    </HoliButton>
  )
  //{!isAuthenticated && }
  //{isAuthenticated && userAvatar}
}

export default HeaderProfileLink

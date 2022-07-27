import React, { useContext, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { ViewStyle } from 'react-native'

import { AuthContext } from '@holi/core/auth/AuthContextProvider'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { UserContext } from '@holi/core/screens/userprofile/UserContextProvider'
import HoliIcon from '@holi/ui/components/HoliIcon'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliUserAvatar from '@holi/ui/components/molecules/HoliUserAvatar'

export type HeaderRightProps = {
  style?: ViewStyle | Record<string, unknown>
  testID?: string
}

const HeaderRight: React.VoidFunctionComponent<HeaderRightProps> = (props: HeaderRightProps) => {
  const { navigate, pathname } = useRouting()

  const { user, setEditing } = useContext(UserContext)
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

  useEffect(() => {
    pathname.indexOf('/profile') !== 0 && setEditing(false)
  }, [pathname, setEditing])

  return pathname.indexOf('/profile') === 0 ? (
    <HoliButton
      label={t('profile.edit')}
      onPress={() => {
        setEditing(true)
      }}
      inline
      transparent
      testID="btn-open-profile-edit-view"
    >
      <HoliText size="small">{t('profile.edit')}</HoliText>
    </HoliButton>
  ) : (
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

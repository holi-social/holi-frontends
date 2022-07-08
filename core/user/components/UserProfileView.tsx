import React, { useContext } from 'react'

import { UserContext } from '@holi/core/user/UserContextProvider'
import HoliButton from '@holi/ui/components/HoliButton'
import HoliText from '@holi/ui/components/HoliText'
import HoliUserAvatar from '@holi/ui/components/HoliUserAvatar'

type UserProfileViewProps = {
  editUser: () => void
}

const UserProfileView: React.VoidFunctionComponent<UserProfileViewProps> = ({ editUser }) => {
  const { user } = useContext(UserContext)

  if (!user) {
    return <HoliText>No user fetched</HoliText>
  }

  // TODO: hand over email, when firstName is empty
  const userImageLabel = user.firstName || 'unnamed user'

  // TODO: should be generated during user registration process (HOLI-1525)
  const userDefaultColor = '#0f0'

  return (
    <>
      <HoliUserAvatar
        imageSrc={user.avatar}
        nameLabel={userImageLabel}
        defaultColor={userDefaultColor}
        initials={userImageLabel.charAt(0)}
        size="large"
      />

      <HoliText>{user.firstName}</HoliText>
      <HoliText>{user.lastName}</HoliText>
      <HoliText>{user.pronouns}</HoliText>
      <HoliText>{user.aboutMe}</HoliText>
      <HoliText>{user.location}</HoliText>
      <HoliText>{user.engagementLevel}</HoliText>
      <HoliText>{user.interests.join(', ')}</HoliText>
      <HoliText>{user.sdgs.join(', ')}</HoliText>
      <HoliText>{user.skills.join(', ')}</HoliText>
      <HoliButton label="Profile data" onPress={editUser}>
        Edit
      </HoliButton>
    </>
  )
}

export { UserProfileView }

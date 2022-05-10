import React, { useState } from 'react'

import SpaceLayout from '@holi/core/spaces/spaceLayout'
import { UserProfileForm } from '@holi/core/user/components/UserProfileForm'
import { UserProfileView } from '@holi/core/user/components/UserProfileView'

const UserProfileScreen: React.VoidFunctionComponent = () => {
  const [editing, setEditing] = useState(false)

  return (
    <SpaceLayout>
      {editing ? (
        <UserProfileForm onSubmit={() => setEditing(false)} />
      ) : (
        <UserProfileView editUser={() => setEditing(true)} />
      )}
    </SpaceLayout>
  )
}

export { UserProfileScreen }

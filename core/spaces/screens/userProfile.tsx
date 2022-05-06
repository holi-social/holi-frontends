import React, { useState } from 'react'

import SpaceLayout from '@holi/core/spaces/spaceLayout'
// TODO(SF) linter to prevent relative imports
import { UserProfileForm } from '@holi/core/user/components/UserProfileForm'
import { UserProfileView } from '@holi/core/user/components/UserProfileView'

const UserProfileScreen: React.VoidFunctionComponent = () => {
  // TODO(SF) declare UserContextProvider globally or move here?
  // TODO(SF) use editing state or move form to extra route?
  const [editing, setEditing] = useState(false)

  // TODO(SF) update cache with mutation result? or perform reload? (or both)
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

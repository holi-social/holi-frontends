import React, { memo } from 'react'

import { useAuth } from '@holi/core/auth/helpers/useAuth'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { Space, SpaceConnectionType } from '@holi/core/screens/spaces/types'

export enum PermissionsType {
  SPACES = 'SPACES',
  AUTH = 'AUTH',
}

interface PermissionsGuardProps {
  permissionType: PermissionsType
  redirectRoute?: string
  spaceConnectionType?: SpaceConnectionType
  space?: Space
}

const PermissionsGuard: React.FC<React.PropsWithChildren<PermissionsGuardProps>> = ({
  permissionType,
  spaceConnectionType = SpaceConnectionType.MEMBER,
  redirectRoute,
  space,
  children,
}) => {
  const { navigate } = useRouting()

  // "undefined" is used when we do not know yet, if user is logged in (loading state)
  // "null" is used when we are SURE there is no logged user
  const { userId } = useAuth()

  if (permissionType === PermissionsType.AUTH && userId === null) {
    navigate(redirectRoute || '/')
    return <></>
  }

  if (permissionType === PermissionsType.SPACES && !space?.connectionStatusToMyself?.includes(spaceConnectionType)) {
    navigate(redirectRoute || `/spaces/${space?.name}`)
    return <></>
  }

  return children as React.ReactElement
}

export default memo(PermissionsGuard)

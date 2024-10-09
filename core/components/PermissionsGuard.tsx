import React, { memo } from 'react'

import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { Space, SpaceConnectionType } from '@holi/core/screens/spaces/types'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'

export enum PermissionsType {
  SPACES = 'SPACES',
  AUTH = 'AUTH',
}

interface PermissionsGuardProps {
  permissionType: PermissionsType
  redirectRoute?: string
  spaceConnectionType?: SpaceConnectionType
  space?: Space
  forceRestrict?: boolean // for any extra logic made on a component level to indicate it should restrict the page
}

const PermissionsGuard: React.FC<React.PropsWithChildren<PermissionsGuardProps>> = ({
  permissionType,
  spaceConnectionType = SpaceConnectionType.MEMBER,
  redirectRoute,
  space,
  forceRestrict,
  children,
}) => {
  const { navigate } = useRouting()
  const loginState = useLoggedInUser()

  if (forceRestrict) {
    navigate(redirectRoute || '/')
    return null
  }

  if (permissionType === PermissionsType.AUTH && loginState.isLoading) {
    return <HoliLoader />
  }

  if (permissionType === PermissionsType.AUTH && loginState.isLoggedOut) {
    navigate(redirectRoute || '/')
    return null
  }

  if (permissionType === PermissionsType.SPACES && !space?.connectionStatusToMyself?.includes(spaceConnectionType)) {
    navigate(redirectRoute || `/spaces/${space?.name}`)
    return null
  }

  return children as React.ReactElement
}

export default memo(PermissionsGuard)

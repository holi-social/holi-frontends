import type React from 'react'
import { memo } from 'react'

import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import { type Space, SpaceUserConnectionType } from '@holi/api/graphql/graphql-codegen'
import { useFocusEffect } from 'expo-router'

export enum PermissionsType {
  SPACES = 'SPACES',
  AUTH = 'AUTH',
}

interface PermissionsGuardProps {
  permissionType: PermissionsType
  redirectRoute?: string
  spaceConnectionType?: SpaceUserConnectionType
  space?: Pick<Space, 'id' | 'name' | 'connectionStatusToMyself'>
  forceRestrict?: boolean // for any extra logic made on a component level to indicate it should restrict the page
}

const PermissionsGuard: React.FC<React.PropsWithChildren<PermissionsGuardProps>> = ({
  permissionType,
  spaceConnectionType = SpaceUserConnectionType.Member,
  redirectRoute,
  space,
  forceRestrict,
  children,
}) => {
  const { navigate } = useRouting()
  const loginState = useLoggedInUser()

  useFocusEffect(() => {
    if (forceRestrict) {
      navigate(redirectRoute || '/')
    }

    if (permissionType === PermissionsType.AUTH && loginState.isLoggedOut) {
      navigate(redirectRoute || '/')
    }

    if (permissionType === PermissionsType.SPACES && !space?.connectionStatusToMyself?.includes(spaceConnectionType)) {
      navigate(redirectRoute || `/spaces/${space?.name}`)
    }
  })

  if (permissionType === PermissionsType.AUTH && loginState.isLoading) {
    return <HoliLoader />
  }

  return children as React.ReactElement
}

export default memo(PermissionsGuard)

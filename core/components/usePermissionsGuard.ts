import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { type Space, SpaceUserConnectionType } from '@holi/api/graphql/graphql-codegen'

export enum PermissionsType {
  SPACES = 'SPACES',
  AUTH = 'AUTH',
}

export interface PermissionsGuardProps {
  permissionType: PermissionsType
  redirectRoute?: string
  spaceConnectionType?: SpaceUserConnectionType
  space?: Pick<Space, 'id' | 'name' | 'connectionStatusToMyself'>
  forceRestrict?: boolean
}

export const usePermissionsGuard = ({
  permissionType,
  spaceConnectionType = SpaceUserConnectionType.Member,
  redirectRoute,
  space,
  forceRestrict,
}: PermissionsGuardProps) => {
  const { navigate } = useRouting()
  const loginState = useLoggedInUser()

  const checkPermissions = () => {
    if (forceRestrict) {
      navigate(redirectRoute || '/')
    }

    if (permissionType === PermissionsType.AUTH && loginState.isLoggedOut) {
      navigate(redirectRoute || '/')
    }

    if (permissionType === PermissionsType.SPACES && !space?.connectionStatusToMyself?.includes(spaceConnectionType)) {
      navigate(redirectRoute || `/spaces/${space?.name}`)
    }
  }

  return {
    checkPermissions,
    isLoading: permissionType === PermissionsType.AUTH && loginState.isLoading,
  }
}

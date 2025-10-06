import type React from 'react'
import { memo, useEffect } from 'react'

import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import { usePermissionsGuard, PermissionsType, type PermissionsGuardProps } from './usePermissionsGuard'

export { PermissionsType }

const PermissionsGuard: React.FC<React.PropsWithChildren<PermissionsGuardProps>> = ({
  permissionType,
  spaceConnectionType,
  redirectRoute,
  space,
  forceRestrict,
  children,
}) => {
  const { checkPermissions, isLoading } = usePermissionsGuard({
    permissionType,
    spaceConnectionType,
    redirectRoute,
    space,
    forceRestrict,
  })

  useEffect(() => {
    checkPermissions()
  }, [checkPermissions])

  if (isLoading) {
    return <HoliLoader />
  }

  return children as React.ReactElement
}

export default memo(PermissionsGuard)

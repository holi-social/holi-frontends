import { render } from '@testing-library/react-native'
import React from 'react'
import { Text } from 'react-native'

import PermissionsGuard, { PermissionsType } from '@holi/core/components/PermissionsGuard'
import { Space, SpaceConnectionType } from '@holi/core/screens/spaces/types'
import type { LoggedInState } from '@holi/core/screens/userprofile/useLoggedInUser'

jest.mock('@holi/core/screens/userprofile/useLoggedInUser', () => ({
  useLoggedInUser: () =>
    ({
      isLoading: false,
      isLoggedIn: true,
      isLoggedOut: false,
      user: { id: 'userId' },
    } as LoggedInState),
}))

describe('PermissionsGuard', () => {
  it('should render children when permissionType is AUTH and userId is not null', () => {
    const { getByTestId } = render(
      <PermissionsGuard permissionType={PermissionsType.AUTH} redirectRoute="/">
        <Text testID="child">Child Component</Text>
      </PermissionsGuard>
    )

    expect(getByTestId('child')).toBeDefined()
  })

  it('should render children when permissionType is SPACES and spaceConnectionType is valid', () => {
    const { getByTestId } = render(
      <PermissionsGuard
        permissionType={PermissionsType.SPACES}
        spaceConnectionType={SpaceConnectionType.MEMBER}
        space={{ connectionStatusToMyself: [SpaceConnectionType.MEMBER] } as Space}
      >
        <Text testID="child">Child Component</Text>
      </PermissionsGuard>
    )

    expect(getByTestId('child')).toBeDefined()
  })

  it('should navigate and return an empty fragment when permissionType is SPACES and spaceConnectionType is invalid', () => {
    const { queryByTestId } = render(
      <PermissionsGuard
        permissionType={PermissionsType.SPACES}
        spaceConnectionType={SpaceConnectionType.FOLLOWER}
        space={{ connectionStatusToMyself: [SpaceConnectionType.MEMBER], name: 'space_name' } as Space}
      >
        <Text testID="child">Child Component</Text>
      </PermissionsGuard>
    )

    expect(mockNavigate).toHaveBeenCalledWith('/spaces/space_name')
    expect(queryByTestId('child')).toBeNull()
  })
})

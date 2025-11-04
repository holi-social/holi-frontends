import { act, renderRouter, screen } from 'expo-router/testing-library'
import { Text } from 'holi-bricks/components/text/Text'
import React from 'react'

import type { LoggedInState } from '@holi/core/auth/hooks/useLoggedInUser'
import PermissionsGuard, { PermissionsType } from '@holi/core/components/PermissionsGuard'
import { type Space, SpaceUserConnectionType } from '@holi/api/graphql/graphql-codegen'
import { router } from 'expo-router'

jest.mock('@holi/core/auth/hooks/useLoggedInUser', () => ({
  useLoggedInUser: () =>
    ({
      isLoading: false,
      isLoggedIn: true,
      isLoggedOut: false,
      user: { id: 'userId' },
    }) as LoggedInState,
}))

describe('PermissionsGuard', () => {
  it('should render children when permissionType is AUTH and userId is not null', () => {
    renderRouter({
      index: () => (
        <PermissionsGuard permissionType={PermissionsType.AUTH} redirectRoute="/">
          <Text>Child Component</Text>
        </PermissionsGuard>
      ),
    })

    expect(screen.getByText('Child Component')).toBeDefined()
  })

  it('should render children when permissionType is SPACES and spaceConnectionType is valid', () => {
    renderRouter({
      index: () => (
        <PermissionsGuard
          permissionType={PermissionsType.SPACES}
          spaceConnectionType={SpaceUserConnectionType.Member}
          space={{ connectionStatusToMyself: [SpaceUserConnectionType.Member] } as Space}
        >
          <Text>Child Component</Text>
        </PermissionsGuard>
      ),
    })

    expect(screen.getByText('Child Component')).toBeDefined()
  })

  it('should navigate and return an empty fragment when permissionType is SPACES and spaceConnectionType is invalid', async () => {
    const context = renderRouter(
      {
        index: () => <Text>Home Page</Text>,
        perms: () => (
          <PermissionsGuard
            permissionType={PermissionsType.SPACES}
            spaceConnectionType={SpaceUserConnectionType.Follower}
            space={{ connectionStatusToMyself: [SpaceUserConnectionType.Member], name: 'space_name' } as Space}
          >
            <Text>Child Component</Text>
          </PermissionsGuard>
        ),
        'spaces/[spacedId]': () => <Text>Space Page</Text>,
      },
      { initialUrl: '/' }
    )

    act(() => {
      router.push('/perms')
    })

    expect(context).toHavePathname('/spaces/space_name')
    expect(screen.queryByText('Child Component')).toBeNull()
  })
})

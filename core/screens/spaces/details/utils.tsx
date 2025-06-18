import { type Space, SpaceUserConnectionType } from '@holi/api/graphql/graphql-codegen'
import type { LoggedInState } from '@holi/core/auth/hooks/useLoggedInUser'

export const determineSpaceViewerRelation = (
  loginState: LoggedInState,
  space?: Pick<Space, 'connectionStatusToMyself'> & { creator?: { id: string } }
) => {
  const isGuest = !loginState?.isLoggedIn
  const isMember = space?.connectionStatusToMyself?.includes(SpaceUserConnectionType.Member)
  const isAdmin = space?.connectionStatusToMyself?.includes(SpaceUserConnectionType.Administrator)
  const isNonMember = !isMember && !isAdmin
  const isCreator = space?.creator?.id === loginState?.user?.id
  return { isGuest, isMember, isNonMember, isAdmin, isCreator }
}

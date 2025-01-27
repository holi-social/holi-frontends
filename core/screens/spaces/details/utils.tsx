import { LoggedInState } from '@holi/core/auth/hooks/useLoggedInUser'
import { Space, SpaceConnectionType } from '@holi/core/screens/spaces/types'

export const determineSpaceViewerRelation = (loginState: LoggedInState, space?: Space) => {
  const isGuest = !loginState?.isLoggedIn
  const isMember = space?.connectionStatusToMyself?.includes(SpaceConnectionType.MEMBER)
  const isAdmin = space?.connectionStatusToMyself?.includes(SpaceConnectionType.ADMINISTRATOR)
  const isNonMember = !isMember && !isAdmin
  const isCreator = space?.creator?.id === loginState?.user?.id
  return { isGuest, isMember, isNonMember, isAdmin, isCreator }
}

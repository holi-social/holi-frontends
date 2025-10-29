import { useSpace } from '@holi/core/screens/spaces/hooks/useSpace'

export const useSpaceAdminUsers = (spaceIdOrName?: string) => {
  const { loading, error, space, refetch } = useSpace(spaceIdOrName)

  const members = space?.members.data
  const adminMembers = members?.filter((member) => member.isAdministrator)
  const adminUsers = adminMembers?.map((admin) => admin.user)

  return {
    loading,
    error,
    adminUsers,
    refetch,
  }
}

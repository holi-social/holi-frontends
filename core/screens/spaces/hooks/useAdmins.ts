import { useSpace } from '@holi/core/screens/spaces/hooks/useSpace'

export const useAdmins = (spaceIdOrName?: string) => {
  const { loading, error, space, refetch, called } = useSpace(spaceIdOrName)

  const members = space?.members.data
  const adminsAsMember = members?.filter((member) => member.isAdministrator)
  const adminsAsUser = adminsAsMember?.map((admin) => admin.user)

  return {
    loading,
    error,
    adminsAsUser,
    called,
    refetch,
  }
}

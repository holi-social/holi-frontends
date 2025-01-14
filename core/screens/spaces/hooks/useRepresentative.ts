import { useQuery } from '@apollo/client'
import { isNotFoundError } from '@holi/core/errors/helpers'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { useSpace } from '@holi/core/screens/spaces/hooks/useSpace'
import { type RepresentativeBySpaceIdResponse, spaceRepresentative } from '@holi/core/screens/spaces/queries'

export const useRepresentative = (spaceIdOrName?: string) => {
  const { displayError } = useErrorHandling()

  const { loading, error, data, called, refetch } = useQuery<RepresentativeBySpaceIdResponse>(spaceRepresentative, {
    fetchPolicy: 'no-cache',
    variables: { idOrName: spaceIdOrName },
    skip: !spaceIdOrName,
    onError: (error) => {
      if (isNotFoundError(error)) {
        return null
      }
      displayError(error, 'Failed to load space Representative', {
        location: 'useRepresentative.representativeBySpaceIdQuery',
        spaceIdOrName,
      })
    },
  })

  const space = data?.spaceById
  const representativeIdentity = space && space?.representatives?.length > 0 ? space?.representatives[0] : undefined

  return {
    loading,
    error,
    representativeIdentity: representativeIdentity?.user?.identity,
    called,
    refetch,
  }
}

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

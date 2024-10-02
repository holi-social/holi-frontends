import { useQuery } from '@apollo/client'

import { isNotFoundError, logError } from '@holi/core/errors/helpers'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { appointmentByIdOrSlugQuery, appointmentByIdOrSlugResponse } from '@holi/core/screens/appointments/queries'
import { SpaceByIdResponse, spaceByIdWithAllMembersQuery } from '@holi/core/screens/spaces/queries'

export const useSpaceByIdOrName = (spaceIdOrName?: string) => {
  const { replaceRoute } = useRouting()

  return useQuery<SpaceByIdResponse>(spaceByIdWithAllMembersQuery, {
    variables: { idOrName: spaceIdOrName },
    skip: !spaceIdOrName,
    onError: (error) => {
      if (isNotFoundError(error)) {
        return replaceRoute('/404')
      }

      logError(error, 'Failed to load space', {
        location: 'CreateAppointment.spaceByIdWithAllMembersQuery',
        spaceIdOrName,
      })
    },
  })
}

export const useAppointmentById = (appointmentId?: string) => {
  const { replaceRoute } = useRouting()

  return useQuery<appointmentByIdOrSlugResponse>(appointmentByIdOrSlugQuery, {
    variables: { idOrSlug: appointmentId },
    onError: (error) => {
      if (isNotFoundError(error)) {
        return replaceRoute('/404')
      }
      logError(error, 'Failed to load appointment', {
        location: 'EditAppointment.appointmentByIdOrSlugQuery',
        idOrSlug: appointmentId,
      })
    },
    skip: !appointmentId,
  })
}

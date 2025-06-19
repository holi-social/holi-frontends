import { useQuery } from '@apollo/client'
import { useSpaceByIdQuery } from '@holi/api/graphql/graphql-codegen'

import { isNotFoundError, logError } from '@holi/core/errors/helpers'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { appointmentByIdOrSlugQuery, type appointmentByIdOrSlugResponse } from '@holi/core/screens/appointments/queries'

export const useSpaceByIdOrName = (spaceIdOrName?: string) => {
  const { replaceRoute } = useRouting()

  return useSpaceByIdQuery({
    variables: { idOrName: spaceIdOrName ?? '' },
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

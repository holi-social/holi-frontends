import { useQuery } from '@apollo/client/react'
import { useSpaceByIdQuery } from '@holi/api/graphql/graphql-codegen'

import { useApolloNotFoundErrorHandling } from '@holi/core/hooks/useApolloNotFoundErrorHandling'
import { appointmentByIdOrSlugQuery, type appointmentByIdOrSlugResponse } from '@holi/core/screens/appointments/queries'

export const useSpaceByIdOrName = (spaceIdOrName?: string) => {
  const queryResult = useSpaceByIdQuery({
    variables: { idOrName: spaceIdOrName ?? '' },
    skip: !spaceIdOrName,
  })
  useApolloNotFoundErrorHandling(queryResult.error, 'Failed to load space', {
    location: 'CreateAppointment.spaceByIdWithAllMembersQuery',
    spaceIdOrName,
  })
  return queryResult
}

export const useAppointmentById = (appointmentId?: string) => {
  const queryResult = useQuery<appointmentByIdOrSlugResponse>(appointmentByIdOrSlugQuery, {
    variables: { idOrSlug: appointmentId },
    skip: !appointmentId,
  })
  useApolloNotFoundErrorHandling(queryResult.error, 'Failed to load appointment', {
    location: 'EditAppointment.appointmentByIdOrSlugQuery',
    idOrSlug: appointmentId,
  })
  return queryResult
}

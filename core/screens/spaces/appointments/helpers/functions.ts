import { Appointment, CreateAppointmentInput } from '@holi/api/graphql/graphql-codegen'

export const appointmentToCreateAppointmentInput = (
  appointment: Appointment,
  spaceId: string
): CreateAppointmentInput => {
  const {
    title,
    description,
    inviteOnly,
    participants = [],
    permission,
    thumbnail,
    startDateTime,
    endDateTime,
    videoCallLink,
  } = appointment
  // Exclude __typename
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { locationDetails: { __typename: _, ...locationDetails } = {} } = appointment
  const {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    geolocation: { __typename: __, ...geolocation } = {},
  } = locationDetails

  return {
    spaceId,
    title,
    description,
    inviteOnly,
    permission,
    startDateTime,
    endDateTime,
    thumbnail,
    participantIds: participants.map(({ id }) => id),
    videoCallLink: videoCallLink?.url,
    videoCallInfo: videoCallLink?.additionalInfo,
    locationDetails: {
      ...locationDetails,
      geolocation: 'latitude' in geolocation ? geolocation : undefined,
    },
  }
}

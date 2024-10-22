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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { __typename: _, ...cleanLocationDetails } = appointment?.locationDetails || {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { __typename: __, ...cleanGeolocation } = appointment.locationDetails?.geolocation || {}

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
    ...(cleanLocationDetails.geolocation && {
      locationDetails: {
        ...cleanLocationDetails,
        geolocation: 'latitude' in cleanGeolocation ? cleanGeolocation : undefined,
      },
    }),
  }
}

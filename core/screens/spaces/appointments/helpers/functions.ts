import { Appointment, CreateAppointmentInput, type LocationDetails } from '@holi/api/graphql/graphql-codegen'

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
  // Safely extract locationDetails and geolocation with null checks
  const { locationDetails = {} } = appointment ?? {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { __typename: _, ...cleanLocationDetails } = locationDetails || {}
  const { geolocation = {} as LocationDetails['geolocation'] } = cleanLocationDetails
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { __typename: __, ...cleanGeolocation } = geolocation || {}

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
      ...cleanLocationDetails,
      geolocation: 'latitude' in cleanGeolocation ? cleanGeolocation : undefined,
    },
  }
}

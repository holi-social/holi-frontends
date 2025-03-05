export type EventLocation = {
  street: string
  streetNo: string
  zipCode: string
  city: string
}

export type EventDetails = {
  description: string
  externalLink: string
  meetingLink: string
}

export type HoliEvent = {
  id: string
  title: string
  organisationName: string
  startDate: string
  endDate: string
  location: EventLocation
  isRemote: boolean
  imageUrl: string
  eventDetails: EventDetails
}

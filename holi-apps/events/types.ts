export type EventLocation = {
  street?: string
  streetNo?: string
  zipCode?: string
  city?: string
}

export type EventDetails = {
  description: string
  externalLink?: string
}

export type HoliEvent = {
  id: string
  title: string
  organisationName: string
  startDate?: string
  endDate?: string
  isRemote: boolean
  imageUrl: string
  eventDetails: EventDetails
  location?: EventLocation
}

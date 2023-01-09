export type Organizer = {
  name?: string
  imageUrl?: string
}

export type VolunteeringEngagement = {
  id: string
  title: string
  description: string
  url: string
  source: string
  categories: string[]
  imageUrl?: string
  organizer?: Organizer
  location?: string
  latitude?: number | null
  longitude?: number | null
}

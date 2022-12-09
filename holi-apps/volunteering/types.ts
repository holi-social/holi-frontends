// TODO nullability of fields is based on assumptions, double check once real API implementation is available
export type VolunteeringEngagement = {
  id: number
  title: string
  description: string
  link: string
  image: string | undefined
  source: string
  uses: string[]
  hashTags: string[]
  orga: string
  imageOrga: string | undefined
  location: string | undefined
  latitude: number | undefined
  longitude: number | undefined
}

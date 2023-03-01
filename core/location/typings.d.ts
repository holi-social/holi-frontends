export interface Place {
  id: string
  name: string
  city?: string
  coordinates?: {
    latitude: number
    longitude: number
  }
}

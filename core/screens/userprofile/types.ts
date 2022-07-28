export interface User {
  id: string
  avatarLabel: string
  avatarDefaultColor: string
  avatar?: string
  firstName?: string
  lastName?: string
  aboutMe?: string
  pronouns?: string
  location?: string
  engagementLevel?: string
  interests?: string[]
  sdgs?: string[]
  skills?: string[]
}

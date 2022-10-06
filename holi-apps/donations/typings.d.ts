export type Locale = 'de' | 'en'

export interface ProjectParameters {
  locale?: Locale
  limit?: number
  offset?: number
}

export type PictureType = 'original' | 'small' | 'tiny_square'

export interface Picture {
  url: string
  type: PictureType
}

export interface ProjectInitiative {
  id: number
  name: string
  city: string
  country: string
  picture: Picture[]
  url: string | undefined
}

export interface Project {
  id: number
  title: string
  categories: string[]
  donationsCount: number
  /** Number between 0 and 100 */
  progressPercentage: number
  openAmountInCents: number
  summary: string
  description: string
  /** The project's "profile picture" in different variants */
  picture: Picture[]
  initiative: ProjectInitiative
}

export interface ProjectsResponse {
  projects: Project[]
}

export type Locale = 'de' | 'en'

export interface ProjectParameters {
  locale?: Locale
  limit?: number
  offset?: number
}

export type PictureType = 'original' | 'fill' | 'limit'

export interface Picture {
  url: string
  type: PictureType
  width?: number
  height?: number
}

export interface ProjectInitiative {
  id: number
  name: string
  city: string
  country: string
  picture: Picture[]
  url: string | undefined
}

export interface NewsAuthor {
  name: string
  picture?: Picture[]
}

export interface News {
  title: string
  id: string
  publishDate: string
  author?: NewsAuthor
  body: string
  url: string
}

export interface Project {
  id: number
  title: string
  categories: string[]
  donationsCount: number
  summary: string
  description: string
  /** Number between 0 and 100 */
  progressPercentage: number
  openAmountInCents: number
  summary: string
  description: string
  /** The project's "profile picture" in different variants */
  picture: Picture[]
  initiative: ProjectInitiative
  donationUrl: string
  news: News[]
  newsCount: number
}

export interface ProjectsResponse {
  totalResults: number
  projects: Project[]
}

export interface Place {
  description: string
}

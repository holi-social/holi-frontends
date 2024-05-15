export interface SeoUrls {
  [key: string]: string
}

export interface HoliHeadProps {
  title?: string
  description?: string
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  origin?: string
  urls?: SeoUrls
}

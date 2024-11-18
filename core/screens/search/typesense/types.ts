export type SearchHitType = 'volunteering' | 'profile' | 'post'
export type SearchHitLinkLocatorIdOrSlug = string
export type SearchHitData = {
  type: SearchHitType
  id: string
  title_de?: string
  title_en?: string
  description_de?: string
  description_en?: string
  location?: string
  location_lat_lng?: [number, number]
  image_url?: string
  /**
   * Used to construct links to the entity on client-side. E.g. for a space task, this would look as follows:
   * {
   *   // ...
   *   link_locators: {
   *     space: "kiezputz",
   *     task: "1c83676f-5197-44c7-bea6-51a7e2f41959"
   *   }
   * }
   * This can then be used to reconstruct the URI path /$lang/spaces/kiezputz/tasks/1c83676f-5197-44c7-bea6-51a7e2f41959
   */
  link_locators?: Record<SearchHitType, SearchHitLinkLocatorIdOrSlug>
}

// TODO move to i18n file
export const SearchHitTypes = {
  volunteering: 'Volunteering',
  profile: 'People',
  post: 'Posts',
}

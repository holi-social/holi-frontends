export type TypesenseDocumentType = 'volunteering' | 'space' | 'profile'

export type TypesenseDocumentLinkLocatorIdOrSlug = string | number
export interface TypesenseDocument {
  type: TypesenseDocumentType
  id: string
  title_de?: string
  title_en?: string
  description_de?: string
  description_en?: string
  location?: string
  location_lat_lng?: [number, number]
  image_url?: string
  user_full_name?: string
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
  link_locators?: Partial<Record<TypesenseDocumentType, TypesenseDocumentLinkLocatorIdOrSlug>>
  topics_v2?: string[]
  skills_v2?: string[]
  source?: string
  organizer_name?: string
  organizer_image_url?: string
  external_url?: string
}

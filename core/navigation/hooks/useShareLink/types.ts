export type ShareLinkAction = 'shared' | 'dismissed'

export type UseShareLink = () => Promise<ShareLinkAction>

export interface UseShareLinkProps {
  link: string
  linkType?: LinkType
  message: string
}

export enum LinkType {
  /**
   * Links to external pages, video calls etc.
   */
  EXTERNAL = 'EXTERNAL',
  /**
   * Universal web links, that can also act as deep links.
   */
  UNIVERSAL = 'UNIVERSAL',
  /**
   * Deep links (scheme holi:// on mobile, requires the app to be installed)
   */
  DEEP = 'DEEP',
}

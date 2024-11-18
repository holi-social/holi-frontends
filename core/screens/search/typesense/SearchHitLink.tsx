import { HoliLink } from '@holi/core/navigation/components/HoliLink'
import { SearchHitData, SearchHitLinkLocatorIdOrSlug, SearchHitType } from '@holi/core/screens/search/typesense/types'
import React, { PropsWithChildren } from 'react'

export const SearchHitLink = ({ hit, children }: { hit: SearchHitData } & PropsWithChildren) => {
  const toPath = (locs: Record<SearchHitType, SearchHitLinkLocatorIdOrSlug>): string => {
    if ('volunteering' in locs && locs['volunteering'] !== undefined) return `volunteering/${locs['volunteering']}`
    else if ('profile' in locs && locs['profile'] !== undefined) return `profile/${locs['profile']}`
    else if ('post' in locs && locs['post'] !== undefined) return `feed-posts/${locs['post']}`
    else return '#'
  }
  const path = toPath(hit.link_locators || ({} as Record<SearchHitType, SearchHitLinkLocatorIdOrSlug>))
  return (
    <HoliLink label={hit.title_de ?? hit.title_en ?? ''} href={path}>
      {children}
    </HoliLink>
  )
}

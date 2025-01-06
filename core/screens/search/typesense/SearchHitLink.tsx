import { HoliLink } from '@holi/core/navigation/components/HoliLink'
import { SearchHitData, SearchHitLinkLocatorIdOrSlug, SearchHitType } from '@holi/core/screens/search/typesense/types'
import React, { PropsWithChildren } from 'react'

const toPath = (locs: Partial<Record<SearchHitType, SearchHitLinkLocatorIdOrSlug>>): string => {
  if ('volunteering' in locs && locs['volunteering'] !== undefined) return `volunteering/${locs['volunteering']}`
  else if ('profile' in locs && locs['profile'] !== undefined) return `profile/${locs['profile']}`
  else if ('space' in locs && locs['space'] !== undefined) return `spaces/${locs['space']}`
  else return '#'
}

export const SearchHitLink = ({ hit, label, children }: { hit: SearchHitData; label: string } & PropsWithChildren) => {
  const path = toPath(hit.link_locators || {})
  return (
    <HoliLink label={label} href={path}>
      {children}
    </HoliLink>
  )
}

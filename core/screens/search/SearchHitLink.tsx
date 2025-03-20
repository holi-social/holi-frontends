import { HoliLink } from '@holi/core/navigation/components/HoliLink'
import type { SearchHitData, SearchHitLinkLocatorIdOrSlug, SearchHitType } from '@holi/core/screens/search/types'
import type React from 'react'
import type { PropsWithChildren } from 'react'
import type { GestureResponderEvent } from 'react-native'

const toPath = (locs: Partial<Record<SearchHitType, SearchHitLinkLocatorIdOrSlug>>): string => {
  if ('volunteering' in locs && locs['volunteering'] !== undefined) return `volunteering/${locs['volunteering']}`
  else if ('profile' in locs && locs['profile'] !== undefined) return `profile/${locs['profile']}`
  else if ('space' in locs && locs['space'] !== undefined) return `spaces/${locs['space']}`
  else return '#'
}

export type SearchHitLinkProps = {
  hit: SearchHitData
  label: string
  onPress?: (event: React.SyntheticEvent | GestureResponderEvent) => unknown | Promise<unknown>
} & PropsWithChildren

export const SearchHitLink = ({ hit, label, children, onPress }: SearchHitLinkProps) => {
  const path = toPath(hit.link_locators || {})
  return (
    <HoliLink label={label} href={path} onPress={onPress}>
      {children}
    </HoliLink>
  )
}

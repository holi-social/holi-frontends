import { HoliLink } from '@holi/core/navigation/components/HoliLink'
import { linkFromLocator } from '@holi/core/typesense/helpers/linkFromLocator'
import type { TypesenseDocument } from '@holi/core/typesense/types'
import type React from 'react'
import type { PropsWithChildren } from 'react'
import type { GestureResponderEvent } from 'react-native'

export type SearchHitLinkProps = {
  hit: TypesenseDocument
  label: string
  onPress?: (event: React.SyntheticEvent | GestureResponderEvent) => unknown | Promise<unknown>
} & PropsWithChildren

export const SearchHitLink = ({ hit, label, children, onPress }: SearchHitLinkProps) => {
  const path = linkFromLocator(hit.type, hit.link_locators || {})
  return (
    <HoliLink label={label} href={path} onPress={onPress}>
      {children}
    </HoliLink>
  )
}

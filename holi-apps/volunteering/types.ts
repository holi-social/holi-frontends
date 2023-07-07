import React from 'react'
import { GestureResponderEvent } from 'react-native'

import { StaticImageData } from '@holi/ui/components/atoms/HoliLocalImage.shared'

export type PartnerInfoRowProps = {
  headline?: string
  rowText: string
  showOutlinkIcon?: boolean
  linkTitle?: string
  partner: { imgSource?: StaticImageData; logo?: PartnerAssetProps; url?: string; isSvg?: boolean }
  onPress?: (event: React.SyntheticEvent | GestureResponderEvent) => void
}

export type PartnerAssetProps = {
  src?: StaticImageData
  height?: number
  width?: number
  isSvg?: boolean
}

export type PartnerProps = {
  logo?: PartnerAssetProps
  wordmark?: PartnerAssetProps
  url?: string
}

export type Organizer = {
  name?: string
  imageUrl?: string
}

export type VolunteeringEngagement = {
  id: string
  title: string
  description: string
  url: string
  source: string
  categories: string[]
  imageUrl?: string
  organizer?: Organizer
  location?: string
  latitude?: number | null
  longitude?: number | null
}

export type VolunteeringFilters = {
  location?: string
  category?: string
}

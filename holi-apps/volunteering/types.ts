import React from 'react'
import { GestureResponderEvent } from 'react-native'

import { GeolocationSuggestion } from '@holi/core/geolocation/components/PlacesAutocomplete'
import { StaticImageData } from '@holi/ui/components/atoms/HoliLocalImage.shared'

export type PartnerInfoRowProps = {
  headline?: string
  rowText: string
  showOutlinkIcon?: boolean
  linkTitle?: string
  partners: { [name: string]: PartnerProps }
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
  headline?: string
  text?: string
  buttonText?: string
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
  imageUrl?: string
  organizer?: Organizer
  location?: string
  latitude?: number | null
  longitude?: number | null
  topics?: string[]
  skills?: string[]
}

export type VolunteeringReco = {
  engagement: VolunteeringEngagement
  matchedTopics?: string[]
  matchedSkills?: string[]
}

export type VolunteeringFilterParams = {
  topic?: string[]
  skill?: string[]
  geolocationId?: string
}

export type VolunteeringFilters = {
  location?: GeolocationSuggestion
  topics?: string[]
  skills?: string[]
}

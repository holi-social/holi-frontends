import type React from 'react'
import type { GestureResponderEvent } from 'react-native'

import type { GeolocationSuggestion } from '@holi/core/geolocation/components/PlacesAutocomplete'
import type { StaticImageData } from '@holi/ui/components/atoms/HoliLocalImage.shared'

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

/** Query parameters to be used in the URL */
export type VolunteeringFilterParams = {
  remote?: string
  topic?: string[]
  skill?: string[]
  commitment?: string[]
  duration?: string[]
  geolocationId?: string
}

export type VolunteeringFilters = {
  remote?: boolean
  location?: GeolocationSuggestion
  topics?: string[]
  skills?: string[]
  commitmentLabels?: string[]
  commitmentDurations?: string[]
}

export type VolunteeringFilterKey = keyof VolunteeringFilters

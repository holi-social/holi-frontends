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

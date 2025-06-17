import type React from 'react'
import { useCallback } from 'react'
import { type GestureResponderEvent, Linking } from 'react-native'

import { enhanceYoutubeLinkPreview } from '@holi/core/helpers/youtube'
import HoliButton from '@holi/ui/components/molecules/HoliButton'

import LinkContent from './LinkContent'
import type { HoliLinkPreviewProps } from './holiLinkPreviewProps'

const HoliLinkPreview: React.FC<HoliLinkPreviewProps> = ({ previewData, onPress, ...props }) => {
  const enhancedPreviewData = enhanceYoutubeLinkPreview(previewData)

  const onLinkPress = useCallback(
    (event: React.SyntheticEvent<Element, Event> | GestureResponderEvent) => {
      onPress?.(event)
      Linking.openURL(enhancedPreviewData.requestedUrl)
    },
    [onPress, enhancedPreviewData.requestedUrl]
  )

  return (
    <HoliButton {...props} label={props.label || enhancedPreviewData.title} inline transparent onPress={onLinkPress}>
      <LinkContent {...enhancedPreviewData} />
    </HoliButton>
  )
}

export default HoliLinkPreview

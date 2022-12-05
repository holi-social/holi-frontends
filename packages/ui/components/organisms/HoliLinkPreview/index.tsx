import React, { useCallback } from 'react'
import { GestureResponderEvent, Linking } from 'react-native'

import HoliButton from '@holi/ui/components/molecules/HoliButton'

import LinkContent from './LinkContent'
import { HoliLinkPreviewProps } from './holiLinkPreviewProps'

const HoliLinkPreview: React.VFC<HoliLinkPreviewProps> = ({ previewData, onPress, ...props }) => {
  const onLinkPress = useCallback(
    (event: React.SyntheticEvent<Element, Event> | GestureResponderEvent) => {
      onPress?.(event)
      Linking.openURL(previewData.requestedUrl)
    },
    [onPress, previewData.requestedUrl]
  )

  return (
    <HoliButton {...props} label={props.label || previewData.title} inline transparent onPress={onLinkPress}>
      <LinkContent {...previewData} />
    </HoliButton>
  )
}

export default HoliLinkPreview

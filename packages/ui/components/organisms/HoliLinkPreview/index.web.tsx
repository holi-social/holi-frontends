import React from 'react'
import { View } from 'react-native'

import HoliNavigationLink from '@holi/ui/components/atoms/HoliNavigationLink'

import LinkContent from './LinkContent'
import { HoliLinkPreviewProps } from './holiLinkPreviewProps'

const HoliLinkPreview: React.VFC<HoliLinkPreviewProps> = ({ previewData, onPress, label, style }) => {
  return (
    <View style={style}>
      <HoliNavigationLink href={previewData.requestedUrl} label={label || previewData.title} external onPress={onPress}>
        <LinkContent {...previewData} />
      </HoliNavigationLink>
    </View>
  )
}

export default HoliLinkPreview

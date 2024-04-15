import React from 'react'
import { View } from 'react-native'

import { HoliLink } from '@holi/core/navigation/components/HoliLink'

import LinkContent from './LinkContent'
import { HoliLinkPreviewProps } from './holiLinkPreviewProps'

const HoliLinkPreview: React.FC<HoliLinkPreviewProps> = ({ previewData, onPress, label, style }) => {
  return (
    <View style={style}>
      <HoliLink href={previewData.requestedUrl} label={label || previewData.title} external onPress={onPress}>
        <LinkContent {...previewData} />
      </HoliLink>
    </View>
  )
}

export default HoliLinkPreview

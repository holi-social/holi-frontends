import React from 'react'
import { View } from 'react-native'

import HoliLink from '@holi/ui/components/molecules/HoliLink'

import LinkContent from './LinkContent'
import { HoliLinkPreviewProps } from './holiLinkPreviewProps'

const HoliLinkPreview: React.VFC<HoliLinkPreviewProps> = ({ previewData, onPress, label, style }) => {
  return (
    <View style={style}>
      <HoliLink href={previewData.requestedUrl} label={label || previewData.title} external onPress={onPress}>
        <LinkContent {...previewData} />
      </HoliLink>
    </View>
  )
}

export default HoliLinkPreview

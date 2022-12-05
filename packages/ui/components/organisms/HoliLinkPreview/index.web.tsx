import Link from 'next/link'
import React from 'react'
import { View } from 'react-native'

import LinkContent from './LinkContent'
import { HoliLinkPreviewProps } from './holiLinkPreviewProps'

const HoliLinkPreview: React.VFC<HoliLinkPreviewProps> = ({ previewData, onPress, label, style }) => {
  return (
    <View style={style}>
      <Link href={previewData.requestedUrl}>
        <a target="_blank" aria-label={label || previewData.title} onClick={onPress}>
          <LinkContent {...previewData} />
        </a>
      </Link>
    </View>
  )
}

export default HoliLinkPreview

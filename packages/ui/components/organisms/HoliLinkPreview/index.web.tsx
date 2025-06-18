import type React from 'react'
import { View } from 'react-native'

import { enhanceYoutubeLinkPreview } from '@holi/core/helpers/youtube'
import { HoliLink } from '@holi/core/navigation/components/HoliLink'

import LinkContent from './LinkContent'
import type { HoliLinkPreviewProps } from './holiLinkPreviewProps'

const HoliLinkPreview: React.FC<HoliLinkPreviewProps> = ({ previewData, onPress, label, style }) => {
  const enhancedPreviewData = enhanceYoutubeLinkPreview(previewData)

  return (
    <View style={style}>
      <HoliLink
        href={enhancedPreviewData.requestedUrl}
        label={label || enhancedPreviewData.title}
        external
        onPress={onPress}
      >
        <LinkContent {...enhancedPreviewData} />
      </HoliLink>
    </View>
  )
}

export default HoliLinkPreview

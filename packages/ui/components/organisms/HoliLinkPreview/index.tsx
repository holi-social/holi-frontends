import type React from 'react'

import { enhanceYoutubeLinkPreview } from '@holi/core/helpers/youtube'
import useLink from '@holi/core/navigation/hooks/useLink'
import HoliButton from '@holi/ui/components/molecules/HoliButton'

import LinkContent from './LinkContent'
import type { HoliLinkPreviewProps } from './holiLinkPreviewProps'

const HoliLinkPreview: React.FC<HoliLinkPreviewProps> = ({ previewData, onPress, ...props }) => {
  const enhancedPreviewData = enhanceYoutubeLinkPreview(previewData)

  // Determine if the URL is external
  const isExternal =
    !enhancedPreviewData.requestedUrl.includes('holi.social') &&
    !enhancedPreviewData.requestedUrl.includes('localhost') &&
    !enhancedPreviewData.requestedUrl.startsWith('/')

  const handleLinkPress = useLink({
    href: enhancedPreviewData.requestedUrl,
    external: isExternal,
    onPress,
  })

  return (
    <HoliButton
      {...props}
      label={props.label || enhancedPreviewData.title}
      inline
      transparent
      onPress={handleLinkPress}
    >
      <LinkContent {...enhancedPreviewData} />
    </HoliButton>
  )
}

export default HoliLinkPreview

import { useQuery } from '@apollo/client'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import { logError } from '@holi/core/errors/helpers'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { SpaceByIdResponse, spaceByIdQuery } from '@holi/core/screens/spaces/queries'
import { SpaceConnectionType } from '@holi/core/screens/spaces/types'
import AddVideoCallLink from '@holi/core/screens/spaces/videoCall/components/AddVideoCallLink'
import VideoCallLinkCard from '@holi/core/screens/spaces/videoCall/components/VideoCallLinkCard'
import { useVideoCallLinkStorage } from '@holi/core/screens/spaces/videoCall/useVideoCallLinkStorage'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'

interface VideoCallLinksProps {
  spaceIdOrName: string | undefined
  style?: StyleProp<ViewStyle>
}

const VideoCallLinks: React.FC<VideoCallLinksProps> = ({ spaceIdOrName, style }: VideoCallLinksProps) => {
  const { navigate } = useRouting()
  const { t } = useTranslation()

  const {
    data,
    error: errorSpace,
    loading: loadingSpace,
  } = useQuery<SpaceByIdResponse>(spaceByIdQuery, {
    variables: { idOrName: spaceIdOrName },
  })

  const space = data?.spaceById
  const isAdmin = space?.connectionStatusToMyself?.includes(SpaceConnectionType.ADMINISTRATOR)
  const isCollaborator = space?.connectionStatusToMyself?.includes(SpaceConnectionType.MEMBER)

  const { videoCallLinks } = useVideoCallLinkStorage(space?.name)

  if (errorSpace) {
    logError(errorSpace, `[VideoCallLinks.tsx] ${errorSpace.message}`)
  }

  if (!loadingSpace && !isAdmin && !isCollaborator) {
    navigate(`/spaces/${spaceIdOrName}`)
  }

  if (loadingSpace || !space) {
    // TODO(SF): display skeleton
    return <></>
  }

  return (
    <View style={style}>
      <HoliBox padding={[0, 16, 16, 16]}>
        <AddVideoCallLink space={space} />
        {videoCallLinks.length > 0 && (
          <HoliHeading level="2" size="small" style={styles.heading}>
            {t('spaces.videocall.generatedLinks.heading')}
          </HoliHeading>
        )}
        {videoCallLinks.map((link) => (
          <VideoCallLinkCard key={link.id} space={space} videoCallLink={link} />
        ))}
      </HoliBox>
    </View>
  )
}

export default VideoCallLinks

const styles = StyleSheet.create({
  heading: {
    marginTop: 32,
  },
})

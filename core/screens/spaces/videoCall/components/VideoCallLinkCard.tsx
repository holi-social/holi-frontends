import React, { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Linking, Platform, StyleSheet, View } from 'react-native'

import { useShareLink } from '@holi/core/hooks/useShareLink'
import i18n from '@holi/core/i18n'
import { getRelativeDateString } from '@holi/core/i18n/helpers/dateHelper'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { jitsiUrl } from '@holi/core/screens/spaces/helpers/config'
import { VideoCallLink } from '@holi/core/screens/spaces/types'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { More } from '@holi/icons/src/generated'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliActionDrawer from '@holi/ui/components/organisms/HoliActionDrawer'
import { colors } from '@holi/ui/styles/globalVars'

interface VideoCallLinkCardProps {
  videoCallLink: VideoCallLink
}
const VideoCallLinkCard: React.FC<VideoCallLinkCardProps> = ({ videoCallLink }: VideoCallLinkCardProps) => {
  const { t } = useTranslation()
  const { navigate } = useRouting()

  const navigateToVideoCall = useCallback(() => {
    if (Platform.OS === 'web') {
      // Directly call api that performs redirects
      Linking.openURL(videoCallLink.url.replace(jitsiUrl, '/api/video-call'))
    } else {
      // Open webview that will then navigate to the same page as web above
      navigate(videoCallLink.url.replace(jitsiUrl, '/video-call'))
    }
  }, [navigate, videoCallLink.url])

  const [, shareLink] = useShareLink(videoCallLink.roomName, videoCallLink.url, true)

  const formattedDate = useMemo(() => {
    const dateString = getRelativeDateString(videoCallLink.created, i18n.language)
    return dateString.charAt(0).toUpperCase() + dateString.slice(1)
  }, [videoCallLink.created])

  const cardElement = (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <HoliText style={styles.detailText} size="extrasmall">
          {formattedDate}
        </HoliText>
        <HoliHeading level="3">{videoCallLink.roomName}</HoliHeading>
        <HoliText style={styles.detailText} size="extrasmall">
          {videoCallLink.url}
        </HoliText>
      </View>
      <HoliIcon icon={More} color={colors.foreground20} />
    </View>
  )
  return (
    <HoliActionDrawer.Drawer
      label={t('global.moreOptions')}
      testID="btn-video-call-link-more-options"
      buttonElement={cardElement}
    >
      <HoliHeading level="2" style={styles.optionsHeading}>
        {videoCallLink.roomName}
      </HoliHeading>
      <HoliText style={[styles.detailText, styles.optionsLink]}>{videoCallLink.url}</HoliText>
      <HoliActionDrawer.Action
        action="external"
        title={t('spaces.videocall.link.open')}
        testID="videocall-link-open-btn"
        handleAction={navigateToVideoCall}
      />
      <HoliActionDrawer.Action
        action="share"
        title={t('spaces.videocall.link.share')}
        testID="videocall-link-share-btn"
        handleAction={shareLink}
      />
    </HoliActionDrawer.Drawer>
  )
}

export default VideoCallLinkCard

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.background10,
    padding: 16,
    marginTop: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.background30,
    alignItems: 'center',
  },
  cardContent: {
    flex: 1,
  },
  detailText: {
    color: colors.foreground20,
  },
  optionsHeading: {
    marginBottom: 12,
    fontWeight: '400',
  },
  optionsLink: {
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderColor: colors.background30,
    marginBottom: 24,
  },
})

import type React from 'react'
import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Linking, Platform, StyleSheet, View } from 'react-native'

import { jitsiUrl } from '@holi/core/helpers/config'
import { LinkType, useShareLink } from '@holi/core/hooks/useShareLink'
import i18n from '@holi/core/i18n'
import { getRelativeDateString } from '@holi/core/i18n/helpers/dateHelper'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import type { VideoCallLink } from '@holi/core/screens/spaces/types'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { ArrowRightUp, More, Share } from '@holi/icons/src/generated'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliActionDrawer from '@holi/ui/components/organisms/HoliActionDrawer'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'

interface VideoCallLinkCardProps {
  videoCallLink: VideoCallLink
}
const VideoCallLinkCard: React.FC<VideoCallLinkCardProps> = ({ videoCallLink }: VideoCallLinkCardProps) => {
  const { t } = useTranslation()
  const { navigate } = useRouting()
  const { theme } = useTheme()
  const { colors } = theme
  const styles = useMemo(() => getStyles(theme), [theme])

  const navigateToVideoCall = useCallback(() => {
    if (Platform.OS === 'web') {
      // Directly call api that performs redirects
      Linking.openURL(videoCallLink.url.replace(jitsiUrl, '/api/video-call'))
    } else {
      // Open webview that will then navigate to the same page as web above
      navigate(videoCallLink.url.replace(jitsiUrl, '/video-call'))
    }
  }, [navigate, videoCallLink.url])

  const [, shareLink] = useShareLink({
    link: videoCallLink.url,
    linkType: LinkType.EXTERNAL,
    message: Platform.OS === 'web' ? '' : `${videoCallLink.roomName}`,
  })

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
      <HoliIcon icon={More} colorOverride={colors.foreground20} />
    </View>
  )
  return (
    <HoliActionDrawer.Drawer
      label={t('global.moreOptions')}
      testID="btn-video-call-link-more-options"
      buttonElement={cardElement}
    >
      <HoliHeading level="2">{videoCallLink.roomName}</HoliHeading>
      <HoliBox padding={[12, 0, 0, 0]} />
      <HoliText style={[styles.detailText, styles.optionsLink]}>{videoCallLink.url}</HoliText>
      <HoliActionDrawer.Action
        icon={ArrowRightUp}
        title={t('spaces.videocall.link.open')}
        testID="videocall-link-open-btn"
        handleAction={navigateToVideoCall}
      />
      <HoliActionDrawer.Action
        icon={Share}
        title={t('spaces.videocall.link.share')}
        testID="videocall-link-share-btn"
        handleAction={shareLink}
      />
    </HoliActionDrawer.Drawer>
  )
}

export default VideoCallLinkCard

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    card: {
      flexDirection: 'row',
      backgroundColor: theme.colors.background10,
      padding: 16,
      marginTop: 16,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.colors.background30,
      alignItems: 'center',
    },
    cardContent: {
      flex: 1,
    },
    detailText: {
      color: theme.colors.foreground20,
    },
    optionsLink: {
      paddingBottom: 24,
      borderBottomWidth: 1,
      borderColor: theme.colors.background30,
      marginBottom: 24,
    },
  })

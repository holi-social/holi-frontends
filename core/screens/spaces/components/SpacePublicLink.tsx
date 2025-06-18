import type React from 'react'
import { memo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Linking, type StyleProp, StyleSheet, type ViewStyle } from 'react-native'

import type { ExternalLink } from '@holi/api/graphql/graphql-codegen'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Discord, Facebook, Instagram, Linkedin, Links, Twitter, Whatsapp } from '@holi/icons/src/generated'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliConfirmation from '@holi/ui/components/molecules/HoliConfirmation'
import { useTheme } from '@holi/ui/styles/theme'

type SpacePublicLinkProps = {
  link: ExternalLink
  style?: StyleProp<ViewStyle>
}

const IconBySpaceLinkType = {
  DISCORD: Discord,
  FACEBOOK: Facebook,
  INSTAGRAM: Instagram,
  LINKEDIN: Linkedin,
  TWITTER: Twitter,
  WHATSAPP: Whatsapp,
  OTHER: Links,
}

const SpacePublicLink: React.FC<SpacePublicLinkProps> = ({ link, style }: SpacePublicLinkProps) => {
  const { url, name, type } = link
  const { theme } = useTheme()
  const { colors } = theme
  const { t } = useTranslation()
  const [showConfirmationModal, setShowConfirmationModal] = useState(false)

  const handleConfirm = () => {
    // For web URLs, the protocol ("http://", "https://") must be set accordingly: https://reactnative.dev/docs/linking
    const urlPrefix = !url.includes('http://') && !url.includes('https://') ? 'https://' : ''
    Linking.openURL(`${urlPrefix}${url}`)
    setShowConfirmationModal(false)
    return true
  }

  return (
    <>
      <HoliButton
        inline
        transparent
        label={type}
        role="link"
        onPress={() => setShowConfirmationModal(true)}
        style={style}
        contentStyle={styles.button}
        testID="btn-to-social-link"
      >
        <HoliIcon icon={IconBySpaceLinkType[type]} colorOverride={colors.foreground20} />
        <HoliText size="small" bold style={styles.text}>
          {name}
        </HoliText>
      </HoliButton>
      <HoliConfirmation
        show={showConfirmationModal}
        label={t('spaces.spaceDetails.publicLinks.change.title')}
        title={t('spaces.spaceDetails.publicLinks.change.title')}
        description={`${t('spaces.spaceDetails.publicLinks.change.url')}${url}`}
        onDismiss={() => setShowConfirmationModal(false)}
        onPrimary={handleConfirm}
        secondaryText={t('global.dismiss')}
        primaryText={t('global.proceed')}
        testID="confirm-proceed-external-space-link"
      />
    </>
  )
}
export default memo(SpacePublicLink)

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    marginLeft: 8,
  },
})

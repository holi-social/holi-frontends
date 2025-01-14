import type React from 'react'
import { memo, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Linking, type StyleProp, StyleSheet, View, type ViewStyle } from 'react-native'

import type { SpaceLink } from '@holi/core/screens/spaces/types'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import {
  Delete,
  Discord,
  Edit2,
  Facebook,
  Instagram,
  Linkedin,
  Links,
  Twitter,
  Whatsapp,
} from '@holi/icons/src/generated'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliConfirmation from '@holi/ui/components/molecules/HoliConfirmation'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { ButtonIcon } from 'holi-bricks/components/button'

type SpaceLinkInputProps = {
  link: SpaceLink
  style?: StyleProp<ViewStyle>
  onEdit?: (link: SpaceLink) => void
  onDelete?: (linkId: string) => void
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

const SpaceLinkInput: React.FC<SpaceLinkInputProps> = ({ link, onEdit, onDelete }: SpaceLinkInputProps) => {
  const { t } = useTranslation()
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const { url, type, name } = link
  const { theme } = useTheme()
  const { colors } = theme
  const styles = useMemo(() => getStyles(theme), [theme])

  // For web URLs, the protocol ("http://", "https://") must be set accordingly: https://reactnative.dev/docs/linking
  const urlPrefix = !url.includes('http://') && !url.includes('https://') ? 'https://' : ''

  return (
    <View style={styles.container}>
      <View style={styles.upper}>
        <View style={styles.header}>
          <HoliIcon icon={IconBySpaceLinkType[type]} color={colors.foreground20} />
          <HoliText size="small" bold style={styles.text}>
            {name}
          </HoliText>
        </View>
        <View style={styles.actions}>
          <ButtonIcon
            transparent
            label={type}
            role="link"
            onPress={() => onEdit && onEdit(link)}
            testID="btn-to-social-link"
            icon={Edit2}
            size="lg"
          />
          <ButtonIcon
            transparent
            label={type}
            role="link"
            onPress={() => setDeleteModalVisible(true)}
            testID="btn-to-social-link"
            icon={Delete}
            size="lg"
          />

          <HoliConfirmation
            show={deleteModalVisible}
            label={t('spaces.input.publicLinks.delete.confirmation.title')}
            title={t('spaces.input.publicLinks.delete.confirmation.title')}
            description={t('spaces.input.publicLinks.delete.confirmation.description')}
            onDismiss={() => setDeleteModalVisible(false)}
            secondaryText={t('spaces.input.publicLinks.delete.confirmation.no')}
            primaryText={t('spaces.input.publicLinks.delete.confirmation.yes')}
            testID="spaces-links-delete-confirmation"
            onPrimary={() => {
              if (onDelete) onDelete(link.id)
            }}
          />
        </View>
      </View>

      <HoliButton
        inline
        transparent
        label={type}
        role="link"
        onPress={() => Linking.openURL(`${urlPrefix}${url}`)}
        testID="btn-to-social-link"
      >
        <HoliText size="small" style={styles.url}>
          {url}
        </HoliText>
      </HoliButton>
    </View>
  )
}
export default memo(SpaceLinkInput)

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background10,
      borderRadius: 16,
      marginBottom: 16,
    },
    upper: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottomColor: theme.colors.background30,
      borderBottomWidth: 1,
      paddingHorizontal: 16,
      paddingVertical: 16,
    },
    actions: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 32,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    text: {
      marginLeft: 8,
    },
    url: {
      color: theme.colors.foreground20,
      paddingHorizontal: 16,
      paddingVertical: 16,
    },
  })

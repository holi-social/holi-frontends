import React, { memo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Linking, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import { SpaceLink, SpaceLinkType } from '@holi/core/screens/spaces/types'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliConfirmation from '@holi/ui/components/molecules/HoliConfirmation'
import { colors } from '@holi/ui/styles/globalVars'

type SpaceLinkInputProps = {
  link: SpaceLink
  style?: StyleProp<ViewStyle>
  onEdit?: (link: SpaceLink) => void
  onDelete?: (linkId: string) => void
}

const SpaceLinkInput: React.VFC<SpaceLinkInputProps> = ({ link, onEdit, onDelete }: SpaceLinkInputProps) => {
  const { t } = useTranslation()
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const { url, type, name } = link

  // For web URLs, the protocol ("http://", "https://") must be set accordingly: https://reactnative.dev/docs/linking
  const urlPrefix = !url.includes('http://') && !url.includes('https://') ? 'https://' : ''

  return (
    <View style={styles.container}>
      <View style={styles.upper}>
        <View style={styles.header}>
          <HoliIcon
            size={24}
            color={colors.foreground20}
            icon={type === SpaceLinkType.OTHER ? 'links' : type.toLowerCase()}
          />
          <HoliText size="small" bold style={styles.text}>
            {name}
          </HoliText>
        </View>
        <View style={styles.actions}>
          <HoliButton
            inline
            transparent
            label={type}
            accessibilityRole="link"
            onPress={() => onEdit && onEdit(link)}
            testID="btn-to-social-link"
          >
            <HoliIcon size={24} color={colors.foreground20} icon="edit-2" />
          </HoliButton>
          <HoliButton
            inline
            transparent
            label={type}
            accessibilityRole="link"
            onPress={() => setDeleteModalVisible(true)}
            testID="btn-to-social-link"
          >
            <HoliIcon size={24} color={colors.foreground20} icon="delete" />

            <HoliConfirmation
              show={deleteModalVisible}
              label={t('spaces.input.publicLinks.delete.confirmation.title')}
              title={t('spaces.input.publicLinks.delete.confirmation.title')}
              description={t('spaces.input.publicLinks.delete.confirmation.description')}
              onDismiss={() => setDeleteModalVisible(false)}
              dismissText={t('spaces.input.publicLinks.delete.confirmation.no')}
              confirmText={t('spaces.input.publicLinks.delete.confirmation.yes')}
              testID="spaces-links-delete-confirmation"
              onConfirm={() => {
                onDelete && onDelete(link.id)
              }}
            />
          </HoliButton>
        </View>
      </View>

      <HoliButton
        inline
        transparent
        label={type}
        accessibilityRole="link"
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

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background10,
    borderRadius: 16,
    marginBottom: 16,
  },
  upper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomColor: colors.background30,
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
    color: colors.foreground20,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
})

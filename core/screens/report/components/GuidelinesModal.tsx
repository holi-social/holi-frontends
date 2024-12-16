import { Button } from 'holi-bricks/components/button'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Linking, Platform, Pressable, StyleSheet, View } from 'react-native'

import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Hearts, Information } from '@holi/icons/src/generated'
import { HoliDivider } from '@holi/ui/components/atoms/HoliDivider'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliModal from '@holi/ui/components/molecules/HoliModal'
import Spacing from '@holi/ui/foundations/Spacing'
import { dimensions } from '@holi/ui/styles/globalVars'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'

const GuidelinesModal = ({ visible, hide }: { visible: boolean; hide: () => void }) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])

  return (
    <HoliModal shown={visible} label={t('report.guidelines.title')} onDismiss={hide} headerStyle={styles.modalHeader}>
      <View style={styles.modalContainer}>
        <View style={styles.header}>
          <HoliHeading>{t('report.guidelines.title')}</HoliHeading>
          <HoliText style={styles.subline}>{t('report.guidelines.description')}</HoliText>
        </View>
        <HoliDivider />
        <View style={styles.icons}>
          <Pressable
            style={styles.iconContainer}
            onPress={() =>
              Linking.openURL(
                'https://app.holi.social/en/profile/settings/legalDocuments/document?type=communityGuidelines'
              )
            }
          >
            <HoliIcon icon={Hearts} />
            <HoliText>{t('report.guidelines.communityGuidelines')}</HoliText>
          </Pressable>
          <Pressable
            style={styles.iconContainer}
            onPress={() => Linking.openURL('https://holi.social/help-center/moderation')}
          >
            <HoliIcon icon={Information} />
            <HoliText>{t('report.guidelines.howWeModerate')}</HoliText>
          </Pressable>
        </View>
        <Button onPress={hide} label={t('report.guidelines.close')} />
      </View>
    </HoliModal>
  )
}

export default GuidelinesModal

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    modalHeader: {
      paddingBottom: 0,
    },
    modalContainer: {
      padding: Spacing.md,
      paddingTop: 0,
      ...Platform.select({
        web: {
          maxWidth: dimensions.maxScreenWidth,
          alignSelf: 'center',
        },
      }),
    },
    header: {
      gap: Spacing.xxs,
      paddingBottom: Spacing.md,
    },
    icons: {
      flexDirection: 'column',
      gap: Spacing.md,
      paddingVertical: Spacing.md,
    },
    iconContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing['3xs'],
    },
    subline: {
      color: theme.colors.gray300,
    },
  })

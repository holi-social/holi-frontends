import * as React from 'react'
import { useTranslation } from 'react-i18next'
import {
  NativeScrollEvent,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ViewStyle,
  useWindowDimensions,
} from 'react-native'

import HoliButton from '@holi/ui/components/HoliButton'
import HoliText from '@holi/ui/components/HoliText'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

export type HoliChipRowProps = {
  title?: string
  editable?: boolean
  children?: React.ReactChild | React.ReactChildren | React.ReactNode | Element
  onEdit?: () => void
}

const HoliChipRow: React.FunctionComponent<HoliChipRowProps> = ({
  title,
  editable,
  children,
  onEdit,
}: HoliChipRowProps) => {
  const { theme } = useTheme()
  const styles = getStyles(theme)
  const { t } = useTranslation()
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <HoliText style={styles.title}>{title}</HoliText>
        {editable && (
          <HoliButton
            label={t('profile.tabs.edit')}
            transparent
            inline
            style={{ width: 'fit-content' }}
            onPress={onEdit}
          >
            <HoliText style={styles.editButton}>{t('profile.tabs.edit')}</HoliText>
          </HoliButton>
        )}
      </View>
      <View style={styles.chipsContainer}>{children}</View>
    </View>
  )
}

export default HoliChipRow

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    container: {
      width: '100%',
      paddingHorizontal: 24,
      paddingTop: 24,
      paddingBottom: 0,
    },
    header: {
      display: 'flex',
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'space-between',
    },
    title: {
      fontSize: 14,
    },
    editButton: {
      color: theme.colors.grey,
      fontSize: 14,
      fontWeight: '500',
    },
    chipsContainer: {
      marginTop: 8,
    },
  })

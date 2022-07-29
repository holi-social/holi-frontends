import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View, ViewStyle } from 'react-native'

import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

export type HoliChipRowProps = {
  title?: string
  editable?: boolean
  editButtonText?: string
  children?: React.ReactChild | React.ReactChildren | React.ReactNode | Element
  onPressEdit?: () => void
  style?: (ViewStyle | Record<string, unknown>) | (ViewStyle | Record<string, unknown>)[]
}

const HoliChipRow: React.FunctionComponent<HoliChipRowProps> = ({
  title,
  editButtonText,
  editable,
  children,
  onPressEdit,
  style,
}: HoliChipRowProps) => {
  const { theme } = useTheme()
  const styles = getStyles(theme)
  const { t } = useTranslation()
  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <HoliText size="small">{title}</HoliText>
        {editable && (
          <HoliButton
            label={t('profile.tabs.edit')}
            transparent
            inline
            style={{ width: 'fit-content' }}
            onPress={onPressEdit}
          >
            <HoliText size="small" bold style={styles.editButton}>
              {editButtonText || t('profile.tabs.edit')}
            </HoliText>
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
      // paddingTop: 24,
      paddingBottom: 0,
    },
    header: {
      display: 'flex',
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'space-between',
    },
    editButton: {
      color: theme.colors.grey,
    },
    chipsContainer: {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      flexShrink: 1,
      marginTop: 8,
    },
  })

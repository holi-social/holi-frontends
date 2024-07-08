import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View, ViewStyle } from 'react-native'

import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

export type HoliChipRowProps = {
  title?: string
  editable?: boolean
  editButtonText?: string
  editButtonLabel?: string
  onPressEdit?: () => void
  style?: (ViewStyle | Record<string, unknown>) | (ViewStyle | Record<string, unknown>)[]
  testID?: string
}

const HoliChipRow = ({
  title,
  editButtonText,
  editButtonLabel,
  editable,
  children,
  onPressEdit,
  style,
  testID = undefined,
}: React.PropsWithChildren<HoliChipRowProps>) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])

  return (
    <View style={[styles.container, style]} testID={testID}>
      <View style={styles.header}>
        <HoliText size="small">{title}</HoliText>
        {editable && (
          <HoliButton
            label={editButtonLabel || editButtonText || t('global.edit')}
            transparent
            inline
            onPress={onPressEdit}
            testID={[testID, 'edit'].filter((e) => e).join('-')}
          >
            <HoliText selectable={false} size="small" bold style={styles.editButtonText}>
              {editButtonText || t('global.edit')}
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
      paddingBottom: 0,
    },
    header: {
      display: 'flex',
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'space-between',
    },
    editButtonText: {
      color: theme.colors.foreground20,
    },
    chipsContainer: {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      flexShrink: 1,
      marginTop: 8,
      gap: 8,
    },
  })

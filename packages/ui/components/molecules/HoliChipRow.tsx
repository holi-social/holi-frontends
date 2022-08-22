import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View, ViewStyle } from 'react-native'

import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { colors } from '@holi/ui/styles/globalVars'

export type HoliChipRowProps = {
  title?: string
  editable?: boolean
  editButtonText?: string
  editButtonLabel?: string
  children?: React.ReactChild | React.ReactChildren | React.ReactNode | Element
  onPressEdit?: () => void
  style?: (ViewStyle | Record<string, unknown>) | (ViewStyle | Record<string, unknown>)[]
  testID?: string
}

const HoliChipRow: React.FunctionComponent<HoliChipRowProps> = ({
  title,
  editButtonText,
  editButtonLabel,
  editable,
  children,
  onPressEdit,
  style,
  testID = undefined,
}: HoliChipRowProps) => {
  const { t } = useTranslation()
  return (
    <View style={[styles.container, style]} testID={testID}>
      <View style={styles.header}>
        <HoliText size="small">{title}</HoliText>
        {editable && (
          <HoliButton
            label={editButtonLabel ? editButtonLabel : t('general.edit') + ' ' + title}
            transparent
            inline
            style={{ width: 'fit-content' }}
            onPress={onPressEdit}
            testID={[testID, 'edit'].filter((e) => e).join('-')}
          >
            <HoliText selectable={false} size="small" bold style={styles.editButton}>
              {editButtonText || t('general.edit')}
            </HoliText>
          </HoliButton>
        )}
      </View>
      <View style={styles.chipsContainer}>{children}</View>
    </View>
  )
}

export default HoliChipRow

const styles = StyleSheet.create({
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
    color: colors.grey,
  },
  chipsContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    flexShrink: 1,
    marginTop: 8,
  },
})

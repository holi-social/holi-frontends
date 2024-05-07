import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { GestureResponderEvent, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Edit2, Information } from '@holi/icons/src/generated'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

type SpaceSectionProps = {
  title: string
  infoIcon?: boolean
  onPressInfo?: (event: React.SyntheticEvent | GestureResponderEvent) => void
  editable?: boolean
  onPressEdit?: (event: React.SyntheticEvent | GestureResponderEvent) => void
  style?: StyleProp<ViewStyle>
  testID?: string
}

const SpaceSection = ({
  title,
  infoIcon,
  onPressInfo,
  editable,
  onPressEdit,
  style,
  testID = 'space-section',
  children,
}: React.PropsWithChildren<SpaceSectionProps>) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])

  return (
    <View style={[styles.wrapper, style]} testID={testID}>
      <View style={styles.rowContainer}>
        <View style={styles.headingContainer}>
          <View style={styles.title}>
            <HoliHeading level="2">{title}</HoliHeading>
          </View>
          {infoIcon && (
            <HoliButton label={'infoLabel'} transparent inline onPress={onPressInfo}>
              <HoliIcon icon={Information} color={theme.colors.foreground10} />
            </HoliButton>
          )}
        </View>
        {editable && (
          <HoliButton
            style={styles.editButton}
            label={t('global.edit')}
            type="secondary"
            inline
            onPress={onPressEdit}
            testID={`btn-${testID}`}
          >
            <HoliText style={styles.editButtonText}>{t('global.edit')}</HoliText>
            <HoliIcon icon={Edit2} />
          </HoliButton>
        )}
      </View>
      {children && <View style={styles.body}>{children}</View>}
    </View>
  )
}
export default SpaceSection

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    wrapper: {
      borderTopWidth: 1,
      borderTopColor: theme.colors.background30,
      paddingVertical: 32,
    },
    rowContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    headingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      flex: 1,
    },
    title: {
      flex: 1,
    },
    body: {
      marginTop: 24,
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      flexShrink: 1,
    },
    editButton: {
      marginLeft: 12,
      paddingHorizontal: 12,
      paddingVertical: 8,
    },
    editButtonText: {
      marginRight: 6,
    },
  })

import type React from 'react'
import { useMemo } from 'react'
import { type GestureResponderEvent, type StyleProp, StyleSheet, View, type ViewStyle } from 'react-native'

import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Information } from '@holi/icons/src/generated'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'

export interface SpaceSectionProps {
  title: string
  infoIcon?: boolean
  onPressInfo?: (event: React.SyntheticEvent | GestureResponderEvent) => void
  actionButton?: React.ReactNode
  style?: StyleProp<ViewStyle>
  testID?: string
}

const SpaceSection = ({
  title,
  infoIcon,
  onPressInfo,
  actionButton,
  style,
  testID = 'space-section',
  children,
}: React.PropsWithChildren<SpaceSectionProps>) => {
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
              <HoliIcon icon={Information} colorOverride={theme.colors.foreground10} />
            </HoliButton>
          )}
        </View>

        {actionButton}
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
  })

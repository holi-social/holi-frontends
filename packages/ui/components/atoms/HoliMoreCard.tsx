import type React from 'react'
import { useMemo } from 'react'
import type { PropsWithChildren } from 'react'
import { type GestureResponderEvent, Pressable, type Role, StyleSheet, View } from 'react-native'

import HoliText from '@holi/ui/components/atoms/HoliText'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'

import HoliLocalImage from './HoliLocalImage'

export interface HoliMoreCardProps {
  onPress: (event: React.SyntheticEvent | GestureResponderEvent) => void
  label?: string
  role: Role
  testID?: string
  size?: 'sm' | 'md'
}

const HoliMoreCard = ({
  children,
  onPress,
  role,
  testID,
  label = '',
  size = 'md',
}: PropsWithChildren<HoliMoreCardProps>) => {
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])

  return (
    <Pressable style={styles.container} role={role} aria-label={label} accessible onPress={onPress} testID={testID}>
      <View style={styles.image}>
        <HoliLocalImage
          label="more"
          imageSource={require('@holi/ui/assets/img/illustrations/plus-circle.svg')}
          isSvg
          width={size === 'sm' ? 48 : 96}
          height={size === 'sm' ? 48 : 96}
        />
      </View>
      <View style={styles.caption}>
        <HoliText color="black300" size="small" bold>
          {children}
        </HoliText>
      </View>
    </Pressable>
  )
}

export default HoliMoreCard

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-around',
      alignItems: 'stretch',
      padding: 8,
      borderRadius: 16,
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: theme.colors.gray200,
      backgroundColor: theme.colors.background10,
    },
    image: {
      flex: 7,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      padding: 16,
      borderRadius: 8,
      backgroundColor: theme.colors.brandB100,
    },
    caption: {
      paddingHorizontal: 8,
      paddingTop: 16,
      paddingBottom: 8,
    },
  })

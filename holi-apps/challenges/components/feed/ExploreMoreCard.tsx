import type React from 'react'
import { useMemo } from 'react'
import type { PropsWithChildren } from 'react'
import { type GestureResponderEvent, Pressable, type Role, StyleSheet, View } from 'react-native'

import { Text } from 'holi-bricks/components/text'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'

import { BorderRadius } from 'holi-bricks/foundations'
import { mono } from 'holi-bricks/foundations'
import { Spacing } from 'holi-bricks/foundations'
import { Image } from 'holi-bricks/components/image'

export interface HoliMoreCardProps {
  onPress: (event: React.SyntheticEvent | GestureResponderEvent) => void
  label?: string
  role: Role
}

const HoliMoreCard = ({ children, onPress, role, label = '' }: PropsWithChildren<HoliMoreCardProps>) => {
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])

  return (
    <Pressable style={styles.container} role={role} aria-label={label} accessible onPress={onPress}>
      <View style={styles.image}>
        <Image
          source={require('@holi/ui/assets/img/illustrations/arrow-right-circle.svg')}
          width={64}
          height={64}
          alt="more"
        />
      </View>
      <View style={styles.caption}>
        <Text size="lg">{children}</Text>
      </View>
    </Pressable>
  )
}

export default HoliMoreCard

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    container: {
      flexDirection: 'column',
      justifyContent: 'space-around',
      alignItems: 'stretch',
      paddingTop: 10,
    },
    image: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: 130,
      width: '100%',
      borderRadius: BorderRadius.md,
      backgroundColor: theme.colors.brandB100,
      borderWidth: 1,
      borderColor: mono['100'],
    },
    caption: {
      paddingHorizontal: Spacing['4xs'],
      paddingVertical: Spacing['3xs'],
    },
  })

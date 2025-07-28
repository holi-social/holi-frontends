import type React from 'react'
import { useState } from 'react'
import { Pressable, useWindowDimensions, View, type GestureResponderEvent } from 'react-native'
import { Stack } from 'holi-bricks/components/stack'
import { Text } from 'holi-bricks/components/text'
import { BorderRadius, breakpoints, layoutStyle, type LayoutProps } from 'holi-bricks/foundations'
import { accessibilityProps, type AccessibilityProps } from 'holi-bricks/foundations/accessibility'
import { BorderWidth } from 'holi-bricks/foundations/dimensions/borderWidth'
import { createStyleSheet, useStyles } from 'holi-bricks/styles'

type RadioButtonProps = AccessibilityProps &
  LayoutProps & {
    label: string
    selected?: boolean
    disabled?: boolean
    onPress?: (selected: boolean, event: React.SyntheticEvent | GestureResponderEvent) => void
  }

export const RadioButton = ({ label, selected = false, disabled = false, onPress, ...rest }: RadioButtonProps) => {
  const [hovered, setHovered] = useState(false)
  const { styles } = useStyles(stylesheet, { selected, hovered, disabled })
  const { width } = useWindowDimensions()
  const leftAligned = width > breakpoints.lg
  const textColor = disabled ? 'muted' : selected || hovered ? 'main' : 'support'

  return (
    <Pressable
      onPress={(event) => onPress?.(!selected, event)}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      disabled={disabled}
      role="radio"
      aria-checked={selected}
      {...accessibilityProps(rest)}
      style={layoutStyle(rest)}
    >
      <Stack
        direction={leftAligned ? 'row' : 'row-reverse'}
        gap="3xs"
        alignItems="center"
        minHeight={40}
        justifyContent={leftAligned ? 'flex-start' : 'space-between'}
      >
        <View style={styles.radio}>
          <View style={styles.radioDot(selected)} />
        </View>
        <Text size="md" color={textColor} selectable={false}>
          {label}
        </Text>
      </Stack>
    </Pressable>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  radio: {
    color: theme.colors.bg.support,
    borderColor: theme.colors.border.support,
    width: 24,
    height: 24,
    borderRadius: BorderRadius.pill,
    borderWidth: BorderWidth.sm,
    backgroundColor: theme.colors.bg.support,
    alignItems: 'center',
    justifyContent: 'center',
    variants: {
      hovered: {
        true: {
          borderColor: theme.colors.border.main,
        },
      },
      selected: {
        true: {
          backgroundColor: theme.colors.bg.selected,
          borderColor: theme.colors.border.main,
        },
      },
      disabled: {
        true: {
          backgroundColor: theme.colors.bg.muted,
          borderColor: theme.colors.border.support,
        },
      },
    },
  },
  radioDot: (selected: boolean) => ({
    width: 12,
    height: 12,
    borderRadius: BorderRadius.pill,
    variants: {
      selected: {
        true: {
          backgroundColor: theme.colors.fill.selected,
        },
      },
      hovered: {
        true: {
          backgroundColor: selected ? theme.colors.fill.muted : theme.colors.fill.support,
        },
      },
      disabled: {
        true: {
          backgroundColor: selected ? theme.colors.fill.muted : undefined,
        },
      },
    },
  }),
}))

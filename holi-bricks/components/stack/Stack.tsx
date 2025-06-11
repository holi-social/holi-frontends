import type React from 'react'
import { createStyleSheet } from 'holi-bricks/styles'
import { type BreakpointsSize, Spacing, type SpacingSize, breakpoints } from 'holi-bricks/foundations'
import {
  type GestureResponderEvent,
  Pressable,
  View,
  type AccessibilityRole,
  type DimensionValue,
  type FlexStyle,
} from 'react-native'
import { makePadding, makeMargin, type SizeToEdge } from 'holi-bricks/foundations/dimensions/spacing'
import { makeRadius, type RadiusToEdge } from 'holi-bricks/foundations/dimensions/borderRadius'
import { makeBorderWidth, type BorderSizeToEdge } from 'holi-bricks/foundations/dimensions/borderWidth'
import type { BackgroundColors, BorderColors, ElevationLevel } from 'holi-bricks/foundations/colors/themes/types'
import { type AccessibilityProps, accessibilityProps } from 'holi-bricks/foundations/accessibility'
import { resolveBackgroundColor } from 'holi-bricks/components/stack/helpers'

type FlexAlignments = 'flex-end' | 'flex-start' | 'center' | 'space-around' | 'space-between' | 'space-evenly'
export type StackProps = AccessibilityProps &
  React.PropsWithChildren & {
    gap?: SpacingSize
    direction?: 'column' | 'row' | 'row-reverse' | 'column-reverse'
    backgroundColor?: BackgroundColors
    alignContent?: FlexAlignments
    alignItems?: 'flex-end' | 'flex-start' | 'center' | 'stretch' | 'baseline'
    justifyContent?: FlexAlignments
    alignSelf?: 'flex-end' | 'flex-start' | 'center' | 'auto' | 'stretch' | 'baseline'
    textAlign?: 'left' | 'right' | 'center'
    padding?: SizeToEdge
    margin?: SizeToEdge
    borderRadius?: RadiusToEdge
    borderWidth?: BorderSizeToEdge
    borderStyle?: 'solid' | 'dotted' | 'dashed'
    borderColor?: BorderColors
    flex?: number
    shouldRender?: boolean
    onPress?: (event: React.SyntheticEvent | GestureResponderEvent) => void
    disabled?: boolean
    accessibilityLabel?: string
    accessibilityRole?: AccessibilityRole
    testID?: string
    maxWidth?: keyof BreakpointsSize
    maxHeight?: DimensionValue
    minWidth?: DimensionValue
    minHeight?: DimensionValue
    height?: DimensionValue
    width?: DimensionValue
    wrap?: FlexStyle['flexWrap']
    flexShrink?: FlexStyle['flexShrink']
    flexBasis?: FlexStyle['flexBasis']
    overflow?: 'hidden' | 'visible'
    aspectRatio?: number | string
    elevation?: ElevationLevel
  }

export const Stack = ({ children, shouldRender = true, accessibilityRole = 'none', ...otherProps }: StackProps) => {
  const Wrapper = otherProps?.onPress ? Pressable : View

  return shouldRender ? (
    <Wrapper
      disabled={otherProps.disabled}
      onPress={otherProps.onPress}
      style={styles.container(otherProps)}
      accessibilityRole={otherProps.onPress ? 'button' : accessibilityRole}
      accessibilityState={otherProps.disabled ? { disabled: true } : undefined}
      accessibilityLabel={otherProps.accessibilityLabel}
      testID={otherProps?.testID}
      {...accessibilityProps(otherProps)}
    >
      {children}
    </Wrapper>
  ) : null
}

const styles = createStyleSheet((theme) => ({
  container: (props: Omit<StackProps, 'children'>) => ({
    backgroundColor: props?.backgroundColor ? resolveBackgroundColor(props?.backgroundColor, theme) : undefined,
    borderColor: props?.borderColor ? theme.colors.border[props?.borderColor] : undefined,
    gap: props?.gap ? Spacing[props?.gap] : 0,
    display: 'flex',
    height: props.height,
    width: props.width,
    flexDirection: props?.direction || 'column',
    alignContent: props?.alignContent || 'flex-start',
    justifyContent: props?.justifyContent || 'flex-start',
    textAlign: props.textAlign || 'left',
    flex: props.flex || undefined,
    flexShrink: props?.flexShrink,
    flexBasis: props?.flexBasis,
    alignItems: props?.alignItems || undefined,
    maxWidth: props?.maxWidth ? breakpoints[props?.maxWidth] : undefined,
    maxHeight: props?.maxHeight,
    minWidth: props?.minWidth,
    minHeight: props?.minHeight,
    alignSelf: props?.alignSelf,
    flexWrap: props?.wrap,
    borderStyle: props?.borderStyle,
    aspectRatio: props?.aspectRatio,
    overflow: props?.overflow,
    ...makePadding(props?.padding),
    ...makeMargin(props?.margin),
    ...makeRadius(props?.borderRadius),
    ...makeBorderWidth(props?.borderWidth),
    ...(props.elevation && theme.shadows[props.elevation]),
  }),
}))
Stack.displayName = 'Stack'

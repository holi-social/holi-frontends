import type React from 'react'
import { createStyleSheet, useStyles } from 'holi-bricks/styles'
import { type BreakpointsSize, Spacing, type SpacingSize, breakpoints } from 'holi-bricks/foundations'
import { Pressable, View, type AccessibilityRole, type DimensionValue, type FlexStyle } from 'react-native'
import { makePadding, makeMargin, type SizeToEdge } from 'holi-bricks/foundations/dimensions/spacing'
import { makeRadius, type RadiusToEdge } from 'holi-bricks/foundations/dimensions/borderRadius'
import { makeBorderWidth, type BorderSizeToEdge } from 'holi-bricks/foundations/dimensions/borderWidth'
import type { BackgroundColors, BorderColors } from 'holi-bricks/foundations/colors/themes/types'

type FlexAlignments = 'flex-end' | 'flex-start' | 'center' | 'space-around' | 'space-between' | 'space-evenly'
interface StackProps extends React.PropsWithChildren {
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
  onPress?: () => void
  disabled?: boolean
  accessibilityLabel?: string
  accessibilityRole?: AccessibilityRole
  testID?: string
  maxWidth?: BreakpointsSize
  maxHeight?: DimensionValue
  minWidth?: DimensionValue
  minHeight?: DimensionValue
  height?: DimensionValue
  width?: DimensionValue
  wrap?: FlexStyle['flexWrap']
  flexShrink?: FlexStyle['flexShrink']
  overflow?: 'hidden' | 'visible'
  aspectRatio?: number | string
}

export const Stack = ({ children, shouldRender = true, accessibilityRole = 'none', ...otherProps }: StackProps) => {
  const { styles } = useStyles(containerStylesheet)
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
    >
      {children}
    </Wrapper>
  ) : null
}

const containerStylesheet = createStyleSheet((theme) => ({
  container: (props: Omit<StackProps, 'children'>) => ({
    backgroundColor: props?.backgroundColor && theme.colors.bg?.[props?.backgroundColor],
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
  }),
}))
Stack.displayName = 'Stack'

import type { PropsWithChildren } from 'react'
import * as React from 'react'
import { type FlexStyle, View } from 'react-native'

import { BorderRadius, Spacing } from 'holi-bricks/tokens'
import { createStyleSheet } from 'holi-bricks/utils'
import { useStyles } from 'holi-bricks/hooks'

export interface CardContainerProps {
  borderRadius?: number
  hasBorder?: boolean
  extraBottomPadding?: boolean
  testID?: string
  flexDirection?: FlexStyle['flexDirection']
}

export const CardContainer = ({
  hasBorder,
  borderRadius = BorderRadius.md,
  extraBottomPadding = false,
  flexDirection = 'column',
  children,
  testID,
}: PropsWithChildren<CardContainerProps>) => {
  const { styles } = useStyles(stylesheet)

  return (
    <View
      testID={testID}
      style={[styles.container(extraBottomPadding, flexDirection), hasBorder && styles.withBorder(borderRadius)]}
    >
      {children}
    </View>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  container: (extraBottomPadding: boolean, flexDirection: FlexStyle['flexDirection']) => ({
    flexDirection: flexDirection,
    padding: Spacing['3xs'],
    backgroundColor: theme.colors.bg.container,
    justifyContent: 'space-between',
    paddingBottom: extraBottomPadding ? Spacing.xs : 0,
  }),
  withBorder: (borderRadius: number) => ({
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: theme.colors.border.support,
    borderRadius: borderRadius,
  }),
}))

export default CardContainer

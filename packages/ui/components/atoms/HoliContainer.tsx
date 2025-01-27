import React, { type PropsWithChildren, useMemo } from 'react'
import { type FlexStyle, View } from 'react-native'
import StyleSheet from 'react-native-media-query'

import Spacing from '@holi/ui/foundations/Spacing'
import { dimensions } from '@holi/ui/styles/globalVars'

export interface ContainerProps {
  alignItems?: FlexStyle['alignItems']
  justifyContent?: FlexStyle['justifyContent']
  gap?: FlexStyle['gap']
  flex?: number
  flexWrap?: FlexStyle['flexWrap']
  flexDirection?: FlexStyle['flexDirection']
  noPadding?: boolean
  noPaddingOnSmallViewports?: boolean
  testID?: string
}

const HoliContainer = ({
  children,
  flex,
  flexWrap = 'nowrap',
  flexDirection = 'column',
  gap,
  alignItems = 'stretch',
  justifyContent = 'flex-start',
  noPadding,
  noPaddingOnSmallViewports,
  testID = 'holi-container',
}: PropsWithChildren<ContainerProps>) => {
  const { styles, ids } = useMemo(
    () => getStyles(noPadding, noPaddingOnSmallViewports),
    [noPadding, noPaddingOnSmallViewports]
  )

  return (
    <View
      style={[
        styles.container,
        buildContainerFlexStyle({ alignItems, flexDirection, gap, justifyContent, flex, flexWrap }),
      ]}
      dataSet={{ media: ids.container }}
      testID={testID}
    >
      {children}
    </View>
  )
}

export default HoliContainer

const buildContainerFlexStyle = (
  flexProps: Pick<ContainerProps, 'gap' | 'flex' | 'flexDirection' | 'alignItems' | 'justifyContent' | 'flexWrap'>
) => {
  if (Object.keys(flexProps).length === 0) return null
  const sheet = StyleSheet.create({
    container: {
      flex: flexProps.flex,
      flexDirection: flexProps.flexDirection,
      flexWrap: flexProps.flexWrap,
      alignItems: flexProps.alignItems,
      justifyContent: flexProps.justifyContent,
      gap: flexProps.gap,
    },
  })

  return sheet.styles.container
}

const getStyles = (noPadding?: boolean, noPaddingOnSmallViewports?: boolean) => {
  const horizontalPadding = noPadding
    ? {
        /* none – fill container */
      }
    : {
        ...(noPaddingOnSmallViewports
          ? { paddingLeft: 0, paddingRight: 0 }
          : { paddingLeft: Spacing.xs, paddingRight: Spacing.xs }),

        [`@media (min-width: ${dimensions.breakpointS}px)`]: {
          paddingRight: Spacing.lg,
          paddingLeft: Spacing.lg,
        },
        [`@media (min-width: ${dimensions.breakpointL}px)`]: {
          paddingRight: Spacing['4xl'],
          paddingLeft: Spacing['4xl'],
        },
      }

  return StyleSheet.create({
    container: {
      display: 'flex',
      alignSelf: 'center',
      width: '100%',
      maxWidth: dimensions.maxScreenWidth,
      ...horizontalPadding,
    },
  })
}

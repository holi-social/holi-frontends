import React, { type PropsWithChildren } from 'react'
import { type FlexStyle, View } from 'react-native'
import StyleSheet from 'react-native-media-query'

import { dimensions } from '@holi/ui/styles/globalVars'

export interface ContainerProps {
  alignItems?: FlexStyle['alignItems']
  flexDirection?: FlexStyle['flexDirection']
  justifyContent?: FlexStyle['justifyContent']
  flex?: number
  paddingHorizontal?: number
  testID?: string
}

const generateStyles = (flexStyles: ContainerProps) => {
  if (Object.keys(flexStyles).length === 0) return null
  const { styles: dinamicStyles } = StyleSheet.create({ container: { ...flexStyles } })

  return dinamicStyles.container
}

const HoliContainer = ({
  children,
  flex,
  alignItems = 'stretch',
  flexDirection = 'column',
  justifyContent = 'flex-start',
  paddingHorizontal = 16,
  testID = 'holi-container',
}: PropsWithChildren<ContainerProps>) => (
  <View
    style={[styles.container, generateStyles({ alignItems, flexDirection, justifyContent, flex, paddingHorizontal })]}
    dataSet={{ media: ids.container }}
    testID={testID}
  >
    {children}
  </View>
)

export default HoliContainer

const { styles, ids } = StyleSheet.create({
  container: {
    display: 'flex',
    alignSelf: 'center',
    width: '100%',
    maxWidth: dimensions.maxScreenWidth,

    [`@media (min-width: ${dimensions.breakpointS}px)`]: {
      paddingRight: 32,
      paddingLeft: 32,
    },
    [`@media (min-width: ${dimensions.breakpointL}px)`]: {
      paddingRight: 64,
      paddingLeft: 64,
    },
  },
})

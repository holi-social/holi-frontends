import React, { type PropsWithChildren } from 'react'
import { type FlexStyle, View } from 'react-native'
import StyleSheet from 'react-native-media-query'

import { dimensions } from '@holi/ui/styles/globalVars'

export interface ContainerProps {
  alignItems?: FlexStyle['alignItems']
  flexDirection?: FlexStyle['flexDirection']
  justifyContent?: FlexStyle['justifyContent']
}

const generateStyles = ({ alignItems, flexDirection, justifyContent }: Required<ContainerProps>) => {
  const { styles: dinamicStyles } = StyleSheet.create({ container: { alignItems, flexDirection, justifyContent } })

  return dinamicStyles.container
}

const HoliContainer = ({
  children,
  alignItems = 'stretch',
  flexDirection = 'column',
  justifyContent = 'flex-start',
}: PropsWithChildren<ContainerProps>) => (
  <View
    style={[styles.container, generateStyles({ alignItems, flexDirection, justifyContent })]}
    dataSet={{ media: ids.container }}
  >
    {children}
  </View>
)

export default HoliContainer

const { styles, ids } = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    alignSelf: 'center',
    width: '100%',
    maxWidth: dimensions.maxScreenWidth,
    paddingHorizontal: 16,

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

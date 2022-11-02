import React from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import { colors } from '@holi/ui/styles/globalVars'

export type CommentConnectorProps = {
  style?: StyleProp<ViewStyle>
}

const CommentConnector: React.VFC<CommentConnectorProps> = ({ style }) => {
  return <View style={[styles.connector, style]} />
}

const styles = StyleSheet.create({
  connector: {
    minHeight: 24,
    width: 0,
    borderWidth: 0.5,
    marginHorizontal: 20,
    marginBottom: 12,
    borderColor: colors.borderColorGrey,
  },
})

export default CommentConnector

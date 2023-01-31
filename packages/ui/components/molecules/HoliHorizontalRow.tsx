import React from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

export interface HoliItemRowProps {
  gap?: number
  style?: StyleProp<ViewStyle>
}

export const HoliHorizontalRow: React.FC<HoliItemRowProps> = ({ children, gap = 24, style }) => {
  return React.Children.toArray(children).length ? (
    <View style={[style, styles.rowWrapper, { marginHorizontal: -gap / 2 }]}>
      {
        /** FIXME convert to VirtualizedList, FlatList or SectionList */
        React.Children.map(children, (item, idx) => (
          <View key={idx} style={{ marginHorizontal: gap / 2 }}>
            {item}
          </View>
        ))
      }
    </View>
  ) : (
    <>{children}</>
  )
}

const styles = StyleSheet.create({
  rowWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
})

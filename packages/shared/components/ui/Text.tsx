import React from 'react'
import { Text, StyleSheet, TextStyle } from 'react-native'

import { useTheme } from 'shared/styles/theme/theme'

export const Paragraph: React.VoidFunctionComponent<{ children: string }> = ({ children }) => {
  const { theme } = useTheme()

  const styles = StyleSheet.create<{ text: TextStyle }>({
    text: {
      paddingBottom: 8,
      color: theme.colors.text,
    },
  })

  return <Text style={styles.text}>{children}</Text>
}

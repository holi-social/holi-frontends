import { useTheme } from '../../styles/theme/theme'
import { Text, StyleSheet, TextStyle } from 'react-native'

export const Paragraph: React.FC<{ children: string }> = ({ children }) => {
  const { theme } = useTheme()

  const styles = StyleSheet.create<{ text: TextStyle }>({
    text: {
      paddingBottom: 8,
      color: theme.colors.text,
      fontFamily: theme.fontFamily.paragraph,
    },
  })

  return <Text style={styles.text}>{children}</Text>
}

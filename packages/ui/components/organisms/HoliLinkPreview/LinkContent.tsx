import type React from 'react'
import { useMemo } from 'react'
import { type StyleProp, StyleSheet, View, type ViewStyle } from 'react-native'

import type { Link } from '@holi/core/screens/posts/types'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { ShareBox } from '@holi/icons/src/generated'
import HoliImage from '@holi/ui/components/atoms/HoliImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'

export interface LinkContentProps extends Link {
  style?: StyleProp<ViewStyle>
}

const LinkContent: React.FC<LinkContentProps> = ({ image, title, description, origin, style }) => {
  const { theme } = useTheme()
  const { colors } = theme
  const styles = useMemo(() => getStyles(theme), [theme])

  return (
    <View style={[styles.container, style]}>
      {!!image && <HoliImage style={styles.image} source={{ uri: image }} label={title} testID="link-preview-image" />}

      <View style={styles.contentContainer}>
        <View style={styles.textContainer}>
          <HoliText bold size="small" numberOfLines={3}>
            {title}
          </HoliText>

          <HoliText size="extrasmall" numberOfLines={2} style={[styles.fontColor, styles.textMarginTop]}>
            {description}
          </HoliText>

          <HoliText size="extrasmall" bold style={[styles.fontColor, styles.textMarginTop]}>
            {origin}
          </HoliText>
        </View>

        <HoliIcon icon={ShareBox} colorOverride={colors.foreground20} size={18} style={styles.shareIcon} />
      </View>
    </View>
  )
}

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    container: {
      borderRadius: 16,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: theme.colors.background30,
    },
    image: {
      aspectRatio: 295 / 151,
      width: '100%',
      backgroundColor: theme.colors.background30,
    },
    contentContainer: {
      paddingHorizontal: 16,
      paddingTop: 12,
      paddingBottom: 16,
      flexDirection: 'row',
    },
    textContainer: {
      flex: 1,
    },
    shareIcon: {
      marginLeft: 12,
      marginTop: 4,
    },
    textMarginTop: {
      marginTop: 8,
    },
    fontColor: {
      color: theme.colors.foreground20,
    },
  })

export default LinkContent

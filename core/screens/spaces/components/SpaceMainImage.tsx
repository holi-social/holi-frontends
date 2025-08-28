import type React from 'react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { type GestureResponderEvent, type StyleProp, View, type ViewStyle } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

import HoliImage from '@holi/ui/components/atoms/HoliImage'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { Button } from 'holi-bricks/components/button'

type SpaceMainImageProps = {
  uri?: string
  label: string
  blurhash?: string
  editable?: boolean
  onPress?: (event: React.SyntheticEvent | GestureResponderEvent) => void
  style?: StyleProp<ViewStyle>
}

const IMAGE_ASPECT_RATIO = 327 / 194

const SpaceMainImage: React.FC<SpaceMainImageProps> = ({ uri, label, blurhash, editable, onPress, style }) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])

  return (
    <View style={[styles.imageContainer, style]}>
      <View style={styles.wrapper}>
        <HoliImage source={{ uri: uri }} blurhash={blurhash} style={styles.mainImage} label={label} />
        {editable && (
          <>
            <View style={styles.editOverlay} />
            <View style={styles.editButton}>
              <Button
                label={t('spaces.edit.mainImage')}
                inline
                onPress={onPress}
                variant="secondary"
                testID="btn-space-edit-cover"
              />
            </View>
          </>
        )}
      </View>
    </View>
  )
}

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    imageContainer: {
      width: '100%',
      aspectRatio: IMAGE_ASPECT_RATIO,
      padding: 8,
      borderWidth: 1,
      borderRadius: 16,
      borderColor: theme.colors.foreground10,
      backgroundColor: theme.colors.background10,
    },
    wrapper: {
      width: '100%',
      maxHeight: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    mainImage: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
      borderRadius: 8,
    },
    editOverlay: {
      width: '100%',
      height: '100%',
      flex: 1,
      position: 'absolute',
      top: 0,
      left: 0,
      backgroundColor: theme.colors.foreground30at48Percent,
      borderRadius: 8,
    },
    editButton: {
      position: 'absolute',
    },
  })

export default SpaceMainImage

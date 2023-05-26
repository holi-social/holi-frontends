import React from 'react'
import { useTranslation } from 'react-i18next'
import { GestureResponderEvent, Platform, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import { useFallbackImage } from '@holi/core/helpers'
import HoliImage from '@holi/ui/components/atoms/HoliImage'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { colors } from '@holi/ui/styles/globalVars'

type SpaceMainImageProps = {
  uri: string
  label: string
  editable?: boolean
  onPress?: (event: React.SyntheticEvent | GestureResponderEvent) => void
  style?: StyleProp<ViewStyle>
}

const IMAGE_ASPECT_RATIO = 327 / 210

const SpaceMainImage: React.VFC<SpaceMainImageProps> = ({ uri, label, editable, onPress, style }) => {
  const { t } = useTranslation()

  const fallbackImageUri = useFallbackImage().uri

  return (
    <View style={[styles.imageContainer, style]}>
      <View style={styles.wrapper}>
        <HoliImage source={{ uri: uri ? uri : fallbackImageUri }} style={styles.mainImage} label={label} />
        {editable && (
          <>
            <View style={styles.editOverlay} />
            <HoliButton
              style={styles.editButton}
              label={t('spaces.edit.mainImage')}
              inline
              onPress={onPress}
              type="secondary"
              testID="btn-space-edit-cover"
            >
              {t('spaces.edit.mainImage')}
            </HoliButton>
          </>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  imageContainer: {
    width: '100%',
    aspectRatio: IMAGE_ASPECT_RATIO,
    height: Platform.OS === 'web' ? '100%' : 'auto',
    padding: 8,
    borderWidth: 1,
    borderRadius: 16,
    borderColor: colors.background30,
    backgroundColor: colors.background10,
  },
  wrapper: {
    width: '100%',
    height: '100%',
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
    backgroundColor: colors.foreground30at48Percent,
    borderRadius: 8,
  },
  editButton: {
    position: 'absolute',
  },
})

export default SpaceMainImage

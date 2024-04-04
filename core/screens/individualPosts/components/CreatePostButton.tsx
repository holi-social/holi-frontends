import React, { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View, useWindowDimensions } from 'react-native'

import useRouting from '@holi/core/navigation/hooks/useRouting'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Pencil } from '@holi/icons/src/generated'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { dimensions } from '@holi/ui/styles/globalVars'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

const CreatePostButton: React.FC = () => {
  const { t } = useTranslation()
  const { navigate } = useRouting()
  const { width: screenWidth } = useWindowDimensions()
  const screenOffset = Math.min(screenWidth, dimensions.maxScreenWidth) / 2
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])
  const { colors } = theme

  const navigateToCreatePost = useCallback(() => {
    navigate('/createPost')
  }, [navigate])

  return (
    <>
      <View
        style={[
          styles.overlayContainer,
          // @ts-ignore percentage only supported and used for web
          { transform: [{ translateX: Platform.OS === 'web' ? '-50%' : -screenOffset }] },
        ]}
      >
        <HoliButton
          label={t('individuals.post.create.title')}
          testID="create-post-button"
          style={styles.overlayButton}
          transparent={Platform.OS !== 'web'}
          onPress={() => {
            navigateToCreatePost()
          }}
        >
          <HoliIcon icon={Pencil} size={24} color={colors.foreground30} />
        </HoliButton>
      </View>
    </>
  )
}

export default CreatePostButton

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    overlayContainer: {
      width: '100%',
      maxWidth: dimensions.maxScreenWidth,
      position: Platform.OS === 'web' ? 'fixed' : 'absolute',
      bottom: (Platform.OS === 'web' ? dimensions.bottomBarHeight : 0) + 16,
      alignItems: 'flex-end',
      left: '50%',
    },
    overlayButton: {
      transform: [{ translateX: -16 }],
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 20,
      borderColor: theme.colors.foreground30,
      borderWidth: 1,
      borderRadius: 84,
      shadowColor: theme.colors.foreground30,
      shadowOffset: {
        width: 2,
        height: 2,
      },
      height: 56,
      width: 56,
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 4,
      overflow: 'visible',
      backgroundColor: theme.colors.brandColorA20,
    },
  })

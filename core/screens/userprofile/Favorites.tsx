import React, { useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View } from 'react-native'

import LoginProtection from '@holi/core/auth/components/LoginProtection'
import PermissionsGuard, { PermissionsType } from '@holi/core/components/PermissionsGuard'
import ScrollHeaderLayout from '@holi/core/components/ScrollHeaderLayout'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import FavoritesList from '@holi/core/screens/favorites/components/FavoritesList'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import { colors, dimensions } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

const Favorites = () => {
  const { t } = useTranslation()
  const setScreenOptions = useSetScreenOptions()
  const mixins = useStyleMixins()

  useLayoutEffect(() => {
    setScreenOptions({ title: t('profile.settings.favorites.title') })
  }, [setScreenOptions, t])

  return (
    <PermissionsGuard permissionType={PermissionsType.AUTH}>
      <LoginProtection>
        <ScrollHeaderLayout.Default style={styles.defaultLayout} headerOverlap keyboardShouldPersistTaps="handled">
          <HoliBox padding={[24, 0]}>
            <View style={mixins.container}>
              <FavoritesList />
            </View>
          </HoliBox>
        </ScrollHeaderLayout.Default>
      </LoginProtection>
    </PermissionsGuard>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 0,
  },
  defaultLayout: {
    minHeight: Platform.OS === 'web' ? '100vh' : '100%',
    backgroundColor: colors.background20,
    paddingTop: dimensions.topBarHeight,
  },
})

export default Favorites

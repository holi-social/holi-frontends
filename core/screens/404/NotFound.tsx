import { Spacing } from 'holi-bricks/tokens'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { useSafeAreaInsets } from '@holi/core/helpers/useSafeAreaInsets'
import NotificationAndSearchHeader from '@holi/core/navigation/components/header/NotificationAndSearchHeader'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import SafeArea from '@holi/ui/components/atoms/SafeArea'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { dimensions } from '@holi/ui/styles/globalVars'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

const NotFound = () => {
  const { t } = useTranslation()
  const setScreenOptions = useSetScreenOptions()
  const { navigate } = useRouting()
  const { top: safeAreaInsetTop } = useSafeAreaInsets()
  const { theme } = useTheme()
  const { colors } = theme

  const styles = getStyles(safeAreaInsetTop, theme)

  useEffect(() => {
    setScreenOptions({
      headerBackTitleVisible: true,
      headerBackVisible: true,
      headerTransparent: true,
      headerStyle: { backgroundColor: colors.background20 },
      headerTitle: () => null,
      headerLeft: () => (
        <HoliButton label={t('navigation.home')} inline transparent onPress={() => navigate('/')}>
          <HoliLocalImage
            imageSource={require('@holi/ui/assets/img/holi/holi.svg')}
            isSvg
            width={56}
            height={24}
            label={t('navigation.title')}
          />
        </HoliButton>
      ),
      headerRight: (props) => <NotificationAndSearchHeader {...props} />,
    })
  }, [navigate, setScreenOptions, t, colors.background20])

  return (
    <SafeArea style={styles.container}>
      <View style={styles.card}>
        <HoliLocalImage
          imageSource={require('@holi/ui/assets/img/illustrations/Illustration_not_found.png')}
          width={235}
          height={136}
          resizeMode="contain"
          label={t('notFound.page.title')}
        />
        <View style={styles.content}>
          <HoliHeading level="1">{t('notFound.page.title')}</HoliHeading>
          <HoliText size="large" style={styles.description}>
            {t('notFound.page.text')}
          </HoliText>
          <HoliButton
            label={t('notFound.page.title')}
            style={styles.button}
            // eslint-disable-next-line no-console
            onPress={() => navigate('/')}
            testID="go-back-home"
          >
            {t('notFound.page.button')}
          </HoliButton>
        </View>
      </View>
    </SafeArea>
  )
}

const getStyles = (safeAreaInsetTop: number, theme: HoliTheme) =>
  StyleSheet.create({
    button: {
      marginTop: 24,
    },
    card: {
      display: 'flex',
      paddingVertical: 32,
      paddingHorizontal: 24,
      flexDirection: 'column',
      alignItems: 'center',
      gap: 24,
      backgroundColor: theme.colors.background10,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: 'rgba(38, 36, 36, 0.12)',
      justifyContent: 'center',
    },
    container: {
      alignItems: 'center',
      height: '100%',
      backgroundColor: theme.colors.background20,
      paddingHorizontal: 16,
      marginTop: dimensions.topBarHeight + Spacing.sm,
      justifyContent: 'flex-start',
    },
    content: {
      alignItems: 'center',
      gap: 8,
    },
    description: {
      textAlign: 'center',
    },
  })

export default NotFound

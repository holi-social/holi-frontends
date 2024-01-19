import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View } from 'react-native'

import { useSafeAreaInsets } from '@holi/core/helpers/useSafeAreaInsets'
import NotificationAndSearchHeader from '@holi/core/navigation/components/header/NotificationAndSearchHeader'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { colors, vars } from '@holi/ui/styles/globalVars'

const NotFound = () => {
  const { t } = useTranslation()
  const setScreenOptions = useSetScreenOptions()
  const { navigate } = useRouting()
  const { top: safeAreaInsetTop } = useSafeAreaInsets()

  const styles = getStyles(safeAreaInsetTop)

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
            imageSource={require('@holi/ui/assets/img/holi/holi_beta.svg')}
            isSvg
            width={78}
            height={24}
            label={t('navigation.title')}
          />
        </HoliButton>
      ),
      headerRight: (props) => <NotificationAndSearchHeader {...props} />,
    })
  }, [navigate, setScreenOptions, t])

  return (
    <View style={styles.container}>
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
    </View>
  )
}

const getStyles = (safeAreaInsetTop: number) =>
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
      backgroundColor: colors.background10,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: 'rgba(38, 36, 36, 0.12)',
      justifyContent: 'center',
    },
    container: {
      alignItems: 'center',
      height: '100%',
      backgroundColor: colors.background20,
      paddingHorizontal: 16,
      paddingTop: +vars.topBarHeight + 24 + (Platform.OS !== 'web' ? safeAreaInsetTop : 0),
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

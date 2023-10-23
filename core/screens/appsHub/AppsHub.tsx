import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Trans } from 'react-i18next'
import { Platform, StyleSheet, View } from 'react-native'

import DefaultLayout from '@holi/core/components/DefaultLayout'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import SpacesFilterPill from '@holi/core/screens/spaces/components/SpacesFilterPill'
import { ArrowLeft, Close } from '@holi/icons/src/generated'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { colors, vars } from '@holi/ui/styles/globalVars'

const AppsHub = () => {
  const setScreenOptions = useSetScreenOptions()
  const { t } = useTranslation()

  useEffect(() => {
    setScreenOptions({
      headerBackTitleVisible: true,
      headerBackVisible: true,
      headerStyle: { backgroundColor: colors.background20 },
      headerTitle: () => (
        <HoliHeading level="1" size="small">
          Apps Hub
        </HoliHeading>
      ),
      headerLeft: () => (Platform.OS === 'web' ? null : <HeaderBackButton icon={ArrowLeft} />),
      headerRight: () => (Platform.OS === 'web' ? <HeaderBackButton icon={Close} /> : null),

      navigationCustomOptions: {
        footerShown: false,
      },
    })
  }, [setScreenOptions])

  return (
    <DefaultLayout style={styles.container} backgroundColor={colors.background20} headerOverlap scrollEnabled={false}>
      <View style={styles.content}>
        <HoliText>
          <SpacesFilterPill label={t('apps.drawer.pill')} filterType="planned" small style={{ width: 'auto' }} />
        </HoliText>
        <HoliText size="extralarge" style={styles.title}>
          <Trans t={t} i18nKey="appsHub.preview.title">
            <HoliText size="extralarge" style={[styles.title, styles.italic]} />
          </Trans>
        </HoliText>
        <HoliText style={styles.description}>{t('appsHub.preview.body')}</HoliText>
      </View>
      <View style={styles.imageContainer}>
        <HoliLocalImage
          imageSource={require('@holi/ui/assets/img/appsHub/apps_hub_preview.svg')}
          style={styles.image}
          isSvg
          resizeMode="contain"
          label={''}
          width={327}
          height={382}
        />
      </View>
      <HoliText size="small" style={{ alignSelf: 'center' }}>
        <Trans t={t} i18nKey="appsHub.preview.footer">
          <HoliText size="small" style={styles.italic} />
        </Trans>
      </HoliText>
    </DefaultLayout>
  )
}

export default AppsHub

const styles = StyleSheet.create({
  content: {
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    maxWidth: +vars.breakpointS,
  },
  container: {
    alignItems: 'center',
    height: Platform.OS === 'web' ? '100vh' : '100%',
    paddingTop: vars.topBarHeight + (Platform.OS === 'ios' ? 48 : 0),
    paddingBottom: 48,
  },
  image: {
    alignSelf: 'center',
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: 32,
    paddingHorizontal: 16,
  },
  insightImage: {
    ...Platform.select({ web: { height: 'auto' } }),
  },
  title: {
    marginTop: 8,
    lineHeight: 33.6,
  },
  description: {
    marginTop: 16,
    lineHeight: 23.68,
  },
  italic: {
    fontStyle: 'italic',
  },
})

import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, ScrollView, StyleSheet, View } from 'react-native'

import { useSafeAreaInsets } from '@holi/core/helpers/useSafeAreaInsets'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import { ArrowLeft, Close } from '@holi/icons/src/generated'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { colors, vars } from '@holi/ui/styles/globalVars'

const AboutSpaces = () => {
  const setScreenOptions = useSetScreenOptions()
  const { navigate, navigateBack } = useRouting()
  const { t } = useTranslation()
  const { top: safeAreaInsetTop } = useSafeAreaInsets()
  const styles = getStyles(safeAreaInsetTop)

  useEffect(() => {
    setScreenOptions({
      headerBackTitleVisible: true,
      headerBackVisible: true,
      headerStyle: { backgroundColor: colors.background20 },
      headerTitle: () => (
        <HoliHeading level="1" size="small">
          {t('spaces.about.page.title')}
        </HoliHeading>
      ),
      headerLeft: () => (Platform.OS === 'web' ? null : <HeaderBackButton icon={ArrowLeft} />),
      headerRight: () => (Platform.OS === 'web' ? <HeaderBackButton icon={Close} /> : null),
    })
  }, [setScreenOptions, t])

  return (
    <ScrollView contentContainerStyle={styles.container} style={{ backgroundColor: colors.background20 }}>
      <View
        style={[
          styles.content,
          styles.transparentCard,
          { paddingTop: Platform.OS === 'android' ? safeAreaInsetTop : 24 },
        ]}
      >
        <HoliText size="extralarge">{t('spaces.about.page.section1.title')}</HoliText>
        <HoliText style={styles.description}>{t('spaces.about.page.section1.description')}</HoliText>
        <View style={styles.imageContainer}>
          <HoliLocalImage
            imageSource={require('@holi/ui/assets/img/spaces/about/first_composition.png')}
            resizeMode="contain"
            label={t('spaces.about.page.section1.title')}
            width={Platform.OS === 'web' ? 324 : 324 * 1.2}
            height={Platform.OS === 'web' ? 188 : 188 * 1.2}
          />
        </View>
      </View>

      <View style={[styles.content, styles.greenCard]}>
        <HoliText size="extralarge" style={styles.title}>
          {t('spaces.about.page.section2.title')}
        </HoliText>
        <HoliText style={styles.description}>{t('spaces.about.page.section2.description')}</HoliText>
        <View style={styles.imageContainer}>
          <HoliLocalImage
            imageSource={require('@holi/ui/assets/img/spaces/about/second_composition.png')}
            resizeMode="contain"
            label={t('spaces.about.page.section2.title')}
            width={Platform.OS === 'web' ? 343 : 343 * 1.15}
            height={Platform.OS === 'web' ? 291 : 291 * 1.15}
          />
        </View>
      </View>
      <View style={[styles.content, styles.blueCard]}>
        <HoliText size="extralarge" style={styles.title}>
          {t('spaces.about.page.section3.title')}
        </HoliText>
        <HoliText style={styles.description}>{t('spaces.about.page.section3.description')}</HoliText>
        <View style={styles.imageContainer}>
          <HoliLocalImage
            imageSource={require('@holi/ui/assets/img/spaces/about/third_composition.png')}
            resizeMode="contain"
            label={t('spaces.about.page.section3.title')}
            width={Platform.OS === 'web' ? 345 : 345 * 1.15}
            height={Platform.OS === 'web' ? 312 : 312 * 1.15}
          />
        </View>
      </View>
      <View style={styles.footerSection}>
        <HoliText size="extralarge" align="center" style={styles.title}>
          {t('spaces.about.page.lastPhrase')}
        </HoliText>
        <View style={styles.buttonContainer}>
          <HoliButton
            style={styles.actionButton}
            label="Create a Space"
            onPress={() => navigate('/spaces/create')}
            testID="discover-spaces-create-button"
          >
            {t('spaces.about.page.button.primary')}
          </HoliButton>
          <HoliButton
            style={styles.actionButton}
            label="Learn more"
            onPress={() => navigateBack()}
            testID="discover-spaces-create-button"
            type="secondary"
          >
            {t('spaces.about.page.button.secondary')}
          </HoliButton>
        </View>
      </View>
    </ScrollView>
  )
}

export default AboutSpaces

const getStyles = (safeAreaInsetTop: number) =>
  StyleSheet.create({
    transparentCard: {
      ...Platform.select({ android: { paddingTop: safeAreaInsetTop, marginTop: 24 } }),
      backgroundColor: colors.background20,
      borderWidth: 0,
    },
    content: {
      paddingHorizontal: 16,
      paddingTop: 40,
      maxWidth: +vars.breakpointS,
      borderRadius: 24,
      borderWidth: 1,
      paddingBottom: 8,
      width: '100%',
    },
    greenCard: {
      backgroundColor: colors.brandColorC20,
      bottom: -1,
    },
    blueCard: {
      backgroundColor: colors.brandColorD20,
    },
    container: {
      paddingTop: vars.topBarHeight + (Platform.OS === 'ios' ? 48 : 0),
      backgroundColor: colors.background20,
      paddingBottom: 48,
      alignItems: 'center',
    },
    imageContainer: {
      alignItems: 'center',
      marginVertical: 32,
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
    footerSection: {
      display: 'flex',
      paddingVertical: 40,
      gap: 32,
      flexDirection: 'column',
      alignItems: 'center',
      maxWidth: +vars.breakpointS,
    },
    actionButton: {
      width: 327,
      borderWidth: 1,
    },
    buttonContainer: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 16,
    },
  })

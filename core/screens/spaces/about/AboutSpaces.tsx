import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, ScrollView, View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

import { useClientWindowDimensions } from '@holi/core/helpers/useClientWindowDimensions'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import { useSafeAreaInsets } from '@holi/core/helpers/useSafeAreaInsets'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import { ArrowLeft, Close } from '@holi/icons/src/generated'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'
import useAuthRequiredNavigation from '@holi/core/navigation/hooks/useAuthRequiredNavigation'
import { Button } from 'holi-bricks/components/button'
import { breakpoints } from 'holi-bricks/foundations'

const AboutSpaces = () => {
  const setScreenOptions = useSetScreenOptions()
  const { navigateBack } = useRouting()
  const { t } = useTranslation()
  const { top: safeAreaInsetTop } = useSafeAreaInsets()
  const { width: screenWidth } = useClientWindowDimensions()
  const { navigateWithAuth } = useAuthRequiredNavigation()

  const { theme } = useTheme()
  const { colors } = theme
  const styles = useMemo(() => getStyles(safeAreaInsetTop, screenWidth, theme), [safeAreaInsetTop, screenWidth, theme])

  useIsomorphicLayoutEffect(() => {
    setScreenOptions({
      headerBackVisible: false,
      headerTitleAlign: 'center',
      headerStyle: { backgroundColor: colors.background20 },
      headerTitle: () => (
        <HoliHeading level="1" size="s">
          {t('spaces.about.page.title')}
        </HoliHeading>
      ),
      headerLeft: () => (Platform.OS === 'web' ? null : <HeaderBackButton icon={ArrowLeft} />),
      headerRight: () => (Platform.OS === 'web' ? <HeaderBackButton icon={Close} /> : null),
    })
  }, [setScreenOptions, t, colors.background20])

  return (
    <ScrollView contentContainerStyle={styles.container} style={styles.scrollViewBackground}>
      <View
        style={[
          screenWidth > breakpoints.sm ? styles.contentLarge : styles.content,
          styles.transparentCard,
          styles.transparentCardWithPadding,
        ]}
      >
        <View style={styles.flexContainer}>
          <HoliText size="extralarge">{t('spaces.about.page.section1.title')}</HoliText>
          <HoliText style={styles.description}>{t('spaces.about.page.section1.description')}</HoliText>
        </View>
        <View style={[styles.imageContainer]}>
          <HoliLocalImage
            imageSource={require('@holi/ui/assets/img/spaces/about/first_composition.png')}
            resizeMode="contain"
            label={t('spaces.about.page.section1.title')}
            width={324}
            height={188}
          />
        </View>
      </View>

      <View style={[screenWidth > breakpoints.sm ? styles.contentLarge : styles.content, styles.sectionTwoContainer]}>
        <View style={[styles.flexContainer, styles.sectionTwoContent]}>
          <HoliText size="extralarge" style={styles.title}>
            {t('spaces.about.page.section2.title')}
          </HoliText>
          <HoliText style={styles.description}>{t('spaces.about.page.section2.description')} </HoliText>
        </View>
        <View style={styles.imageContainer}>
          <HoliLocalImage
            imageSource={require('@holi/ui/assets/img/spaces/about/second_composition.png')}
            resizeMode="contain"
            label={t('spaces.about.page.section2.title')}
            width={343}
            height={291}
          />
        </View>
      </View>
      <View
        style={[
          screenWidth > breakpoints.sm ? [styles.contentLarge, styles.contentLargeDirection] : styles.content,
          styles.sectionThreeContainer,
        ]}
      >
        <View style={styles.flexContainer}>
          <HoliText size="extralarge" style={styles.title}>
            {t('spaces.about.page.section3.title')}
          </HoliText>
          <HoliText style={styles.description}>{t('spaces.about.page.section3.description')}</HoliText>
        </View>
        <View style={styles.imageContainer}>
          <HoliLocalImage
            imageSource={require('@holi/ui/assets/img/spaces/about/third_composition.png')}
            resizeMode="contain"
            label={t('spaces.about.page.section3.title')}
            width={345}
            height={312}
          />
        </View>
      </View>
      <View style={styles.footerSection}>
        <HoliText size="extralarge" align="center" style={styles.title}>
          {t('spaces.about.page.lastPhrase')}
        </HoliText>
        <View style={[styles.buttonContainer, styles.buttonContainerDirection]}>
          <View style={styles.actionButton}>
            <Button
              label={t('spaces.about.page.button.primary')}
              onPress={() =>
                navigateWithAuth('/spaces/create', {
                  description: t('spaces.create.loginRedirect.text'),
                  trackTrigger: 'CREATE_SPACE',
                })
              }
              testID="discover-spaces-create-button"
            />
          </View>
          <View style={styles.actionButton}>
            <Button
              label={t('spaces.about.page.button.secondary')}
              onPress={() => navigateBack()}
              testID="discover-spaces-create-button"
              variant="secondary"
            />
          </View>
        </View>
      </View>
    </ScrollView>
  )
}

export default AboutSpaces

const getStyles = (safeAreaInsetTop: number, screenWidth: number, theme: HoliTheme) =>
  StyleSheet.create({
    actionButton: {
      width: 327,
    },
    sectionThreeContainer: {
      backgroundColor: theme.colors.brandColorD20,
      paddingBottom: 24,
    },
    buttonContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 16,
      paddingHorizontal: 16,
    },
    buttonContainerDirection: {
      flexDirection: screenWidth > breakpoints.md ? 'row' : 'column',
    },
    container: {
      backgroundColor: theme.colors.background20,
      paddingBottom: 48,
      alignItems: 'center',
    },
    content: {
      paddingHorizontal: 16,
      paddingTop: 40,
      justifyContent: 'center',
      maxWidth: breakpoints.md,
      borderRadius: 24,
      borderWidth: 1,
      paddingBottom: 8,
      width: '100%',
      gap: 32,
    },
    contentLarge: {
      flexDirection: 'row',
      paddingHorizontal: screenWidth > breakpoints.sm ? 24 : 16,
      paddingTop: 40,
      maxWidth: breakpoints.md,
      borderRadius: 24,
      borderWidth: 1,
      gap: 32,
    },
    contentLargeDirection: {
      flexDirection: screenWidth > breakpoints.sm ? 'row-reverse' : 'column',
    },
    description: {
      marginTop: 16,
      lineHeight: 23.68,
    },
    flexContainer: {
      flex: 1,
    },
    footerSection: {
      display: 'flex',
      paddingVertical: 40,
      paddingHorizontal: 16,
      gap: 32,
      flexDirection: 'column',
      alignItems: 'center',
      maxWidth: breakpoints.md,
      marginBottom: 48,
    },
    sectionTwoContainer: {
      backgroundColor: theme.colors.brandColorC20,
      paddingBottom: 24,
      marginBottom: screenWidth > breakpoints.sm ? 24 : 0,
      bottom: -1,
    },
    sectionTwoContent: {
      paddingHorizontal: screenWidth > breakpoints.sm ? 16 : 0,
    },
    imageContainer: {
      alignSelf: 'center',
      paddingBottom: screenWidth < breakpoints.md ? 16 : 0,
    },
    title: {
      lineHeight: 33.6,
    },
    transparentCard: {
      paddingHorizontal: screenWidth > breakpoints.md ? 0 : 16,
      backgroundColor: theme.colors.background20,
      borderWidth: 0,
      paddingBottom: screenWidth < breakpoints.md ? 24 : 48,
    },
    transparentCardWithPadding: {
      paddingTop: 24,
    },
    scrollViewBackground: {
      backgroundColor: theme.colors.background20,
    },
  })

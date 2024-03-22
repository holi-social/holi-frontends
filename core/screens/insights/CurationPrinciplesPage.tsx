import { useQuery } from '@apollo/client'
import { StatusBar } from 'expo-status-bar'
import React, { memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Linking, Platform, Pressable, StyleSheet, View } from 'react-native'

import ScrollHeaderLayout from '@holi/core/components/ScrollHeaderLayout'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import { InsightAuthorsResponse, insightAuthors } from '@holi/core/screens/insights/queries'
import HoliGridCell from '@holi/ui/components/atoms/HoliGridCell'
import HoliGridWrapper from '@holi/ui/components/atoms/HoliGridWrapper'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliAvatar from '@holi/ui/components/molecules/HoliAvatar'
import HoliCarousel from '@holi/ui/components/organisms/HoliCarousel'
import Spacing from '@holi/ui/foundations/Spacing'
import { dimensions } from '@holi/ui/styles/globalVars'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

const CircledNumber = ({ number }: { number: number }) => {
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])

  // TODO(alex): This doesn't show on iOS for some reason
  return (
    <View style={styles.circledNumber}>
      <HoliText>{number}</HoliText>
    </View>
  )
}

const CurationPrinciplesPage: React.FC = () => {
  const { t } = useTranslation()
  const setScreenOptions = useSetScreenOptions()
  const { navigate } = useRouting()

  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])
  const mixins = useStyleMixins()

  const { data, loading } = useQuery<InsightAuthorsResponse>(insightAuthors, {
    variables: { limit: 30 },
  })

  const authors = data?.insightAuthors?.data || []

  const slides = [...Array(3)].map((_, index) => {
    const sequenceNumber = index * 2 + 1

    return {
      children: (
        <View style={{ gap: Spacing['3xs'], width: '100%', justifyContent: 'center' }} key={index}>
          <View style={styles.card}>
            <CircledNumber number={sequenceNumber} />
            <HoliText>{t(`insights.curationPrinciples.principles.${sequenceNumber}`)}</HoliText>
          </View>
          <View style={styles.card}>
            <CircledNumber number={sequenceNumber + 1} />
            <HoliText>{t(`insights.curationPrinciples.principles.${sequenceNumber + 1}`)}</HoliText>
          </View>
        </View>
      ),
    }
  })

  useIsomorphicLayoutEffect(() => {
    setScreenOptions({
      title: t('insights.curationPrinciples.title'),
      headerTransparent: false,
    })
  })

  const authorGridBreakpoints: [number, number][] = [
    [1, 1],
    [dimensions.breakpointXs, 3],
    [dimensions.breakpointS, 5],
  ]

  return (
    <>
      <StatusBar style="dark" animated />

      <ScrollHeaderLayout.Default style={styles.wrapper} headerOverlap={Platform.OS !== 'web'}>
        <View style={[mixins.container, { gap: Spacing.xs, paddingTop: Spacing.md }]}>
          <HoliHeading level="1">{t('insights.curationPrinciples.intro.heading')}</HoliHeading>
          <HoliText>{t('insights.curationPrinciples.intro.description')}</HoliText>
        </View>

        <View
          style={[
            mixins.container,
            { gap: Spacing.xs, paddingTop: Spacing.md, width: '100%', maxWidth: dimensions.maxScreenWidth },
          ]}
        >
          <HoliHeading level="1">{t('insights.curationPrinciples.principles.heading')}</HoliHeading>
          {/* TODO(alex): This has the same alignment issues as previously with the carousel */}
          <HoliCarousel slides={slides} marginHorizontal={Spacing.xs} />
        </View>

        <View style={Platform.OS === 'web' ? [mixins.container] : []}>
          <View style={[mixins.container, styles.section, styles.contributorSection]}>
            <HoliHeading level="1" {...Platform.select({ web: { align: 'center' }, default: { align: 'left' } })}>
              {t('insights.curationPrinciples.curators.heading')}
            </HoliHeading>

            {/* TODO(alex): last row should be centered if it doesn't contain max amount of items */}
            <HoliGridWrapper breakpoints={authorGridBreakpoints}>
              {(loading || !authors) &&
                [...new Array(5).keys()].map((i) => (
                  <HoliGridCell key={i}>
                    <View style={styles.contributor}>
                      <HoliAvatar loading label={`Author ${i}`} />
                      <HoliText size="small" align="center" loading />
                    </View>
                  </HoliGridCell>
                ))}
              {!loading &&
                authors &&
                authors.map((author) => (
                  <HoliGridCell key={author.id}>
                    <Pressable style={styles.contributor} onPress={() => navigate(`/profile/${author.id}`)}>
                      <HoliAvatar
                        imageSrc={author.avatar}
                        loading={loading || !author}
                        imageBlurhash={author.avatarBlurhash}
                        label={author.avatarLabel}
                        defaultColor={author.avatarDefaultColor}
                      />
                      <HoliText size="small" align="center">
                        {author.fullName}
                      </HoliText>
                    </Pressable>
                  </HoliGridCell>
                ))}
            </HoliGridWrapper>
          </View>
        </View>

        <View style={Platform.OS === 'web' ? [mixins.container] : []}>
          <View style={[mixins.container, styles.section, styles.partnersSection]}>
            <HoliHeading level="1" {...Platform.select({ web: { align: 'center' }, default: { align: 'left' } })}>
              {t('insights.curationPrinciples.partners.heading')}
            </HoliHeading>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: Spacing.xs,
                flexWrap: 'wrap',
                flex: 1,
              }}
            >
              <Pressable style={styles.partner} onPress={() => Linking.openURL('https://www.kohero-magazin.de')}>
                <HoliLocalImage
                  imageSource={require('@holi/ui/assets/img/logo/partner_kohero.png')}
                  resizeMode="contain"
                  label="kohero magazin"
                  width={110}
                  height={36}
                />
              </Pressable>
              <Pressable style={styles.partner} onPress={() => Linking.openURL('https://piqd.de')}>
                <HoliLocalImage
                  imageSource={require('@holi/ui/assets/img/logo/partner_piqd.svg')}
                  resizeMode="contain"
                  label="piqd"
                  width={64}
                  height={36}
                  isSvg
                />
              </Pressable>
              <Pressable style={styles.partner} onPress={() => Linking.openURL('https://medwatch.de')}>
                <HoliLocalImage
                  imageSource={require('@holi/ui/assets/img/logo/partner_medwatch.svg')}
                  resizeMode="contain"
                  label="MEDWATCH"
                  width={106}
                  height={36}
                  isSvg
                />
              </Pressable>
              <Pressable style={styles.partner} onPress={() => Linking.openURL('https://andererseits.org')}>
                <HoliLocalImage
                  imageSource={require('@holi/ui/assets/img/logo/partner_andererseits.svg')}
                  resizeMode="contain"
                  label="andererseits"
                  width={136}
                  height={36}
                  isSvg
                />
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollHeaderLayout.Default>
    </>
  )
}

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    wrapper: {
      backgroundColor: theme.colors.background20,
      ...Platform.select({
        web: { paddingBottom: Spacing.lg },
      }),
    },

    card: {
      backgroundColor: theme.colors.background10,
      paddingHorizontal: Spacing.xxs,
      paddingVertical: Spacing.xs,
      borderRadius: Spacing['3xs'],
      borderWidth: 1,
      borderColor: theme.colors.foreground10,
      flex: 1,
      flexDirection: 'row',
      gap: Spacing.xxs,
    },

    circledNumber: {
      backgroundColor: theme.colors.brandB200,
      height: 8,
      width: 8,
      padding: 12,
      borderWidth: 1,
      borderRadius: 200,
      alignItems: 'center',
      justifyContent: 'center',
    },

    section: {
      paddingVertical: Spacing.xl,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: theme.colors.black300,
      gap: Spacing.md,
    },

    contributorSection: {
      marginTop: Spacing.md,
      backgroundColor: theme.colors.brandD200,
    },

    contributor: {
      justifyContent: 'center',
      alignItems: 'center',
      gap: Spacing['3xs'],
    },

    partnersSection: {
      ...Platform.select({
        web: { marginTop: Spacing.lg },
        native: { marginTop: -1 },
      }),
      backgroundColor: theme.colors.brandA200,
    },

    partner: {
      padding: 8,
      backgroundColor: theme.colors.background20,
      borderColor: theme.colors.black300,
      borderWidth: 1,
      borderRadius: 8,
      height: 52,
    },
  })

export default memo(CurationPrinciplesPage)

import { useQuery } from '@apollo/client'
import type React from 'react'
import { memo, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Linking, Platform, Pressable, ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native'

import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import HeaderTitle from '@holi/core/navigation/components/HeaderTitle'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import { type InsightAuthorsResponse, insightAuthors } from '@holi/core/screens/insights/queries'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import HoliGridCell from '@holi/ui/components/atoms/HoliGridCell'
import HoliGridWrapper from '@holi/ui/components/atoms/HoliGridWrapper'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliAvatar from '@holi/ui/components/molecules/HoliAvatar'
import HoliCarousel from '@holi/ui/components/organisms/HoliCarousel'
import Spacing from '@holi/ui/foundations/Spacing'
import { dimensions } from '@holi/ui/styles/globalVars'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { Avatar } from 'holi-bricks/components/avatar'

const CircledNumber = ({ number }: { number: number }) => {
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme, false), [theme])

  return (
    <View style={styles.circledNumber}>
      <HoliText>{number}</HoliText>
    </View>
  )
}

const PrinciplesSectionCarousel: React.FC = () => {
  const { t } = useTranslation()

  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme, false), [theme])

  const slides = [...Array(3)].map((_, index) => {
    const sequenceNumber = index * 2 + 1

    return {
      children: (
        <View style={{ gap: Spacing['3xs'], width: '100%', justifyContent: 'center' }} key={index}>
          <View style={styles.card}>
            <CircledNumber number={sequenceNumber} />
            <HoliText style={styles.cardText}>{t(`insights.curationPrinciples.principles.${sequenceNumber}`)}</HoliText>
          </View>
          <View style={styles.card}>
            <CircledNumber number={sequenceNumber + 1} />
            <HoliText style={styles.cardText}>
              {t(`insights.curationPrinciples.principles.${sequenceNumber + 1}`)}
            </HoliText>
          </View>
        </View>
      ),
    }
  })

  return <HoliCarousel slides={slides} marginHorizontal={Spacing.xs} />
}

const PrinciplesSectionGrid: React.FC = () => {
  const { t } = useTranslation()

  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme, true), [theme])

  return (
    <HoliContainer>
      <HoliGridWrapper breakpoints={[[1, 2]]} gap={Spacing.xxs}>
        {[1, 4, 2, 5, 3, 6].map((principle) => (
          <HoliGridCell key={principle}>
            <View style={styles.card}>
              <CircledNumber number={principle} />
              <HoliText style={styles.cardText}>{t(`insights.curationPrinciples.principles.${principle}`)}</HoliText>
            </View>
          </HoliGridCell>
        ))}
      </HoliGridWrapper>
    </HoliContainer>
  )
}

const CurationPrinciplesPage: React.FC = () => {
  const { t } = useTranslation()
  const setScreenOptions = useSetScreenOptions()
  const { navigate } = useRouting()

  const { width: screenWidth } = useWindowDimensions()
  const [isWideLayout, setWideLayout] = useState<boolean>(false)

  useIsomorphicLayoutEffect(() => {
    if (screenWidth >= dimensions.breakpointS) {
      setWideLayout(true)
    }
  }, [isWideLayout, screenWidth])

  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme, isWideLayout), [theme, isWideLayout])

  const { data, loading } = useQuery<InsightAuthorsResponse>(insightAuthors, {
    variables: { limit: 30 },
  })
  const authors = data?.insightAuthors?.data || []

  useIsomorphicLayoutEffect(() => {
    setScreenOptions({
      headerBackTitleVisible: true,
      headerBackVisible: false,
      headerStyle: {
        backgroundColor: theme.colors.background20,
      },
      headerTitle: ({ tintColor }) => (
        <HeaderTitle tintColor={tintColor}>{t('insights.curationPrinciples.title')}</HeaderTitle>
      ),
    })
  }, [t, setScreenOptions, theme.colors.background20])

  return (
    <ScrollView style={styles.wrapper}>
      <HoliContainer noPadding>
        <HoliContainer>
          <View style={styles.intro}>
            <HoliHeading level="1">{t('insights.curationPrinciples.intro.heading')}</HoliHeading>
            <HoliText>{t('insights.curationPrinciples.intro.description')}</HoliText>
          </View>
        </HoliContainer>

        <HoliGap size={'m'} />

        <HoliContainer>
          <HoliHeading level="2" size="l">
            {t('insights.curationPrinciples.principles.heading')}
          </HoliHeading>
        </HoliContainer>

        <HoliGap size={'m'} />

        {isWideLayout ? <PrinciplesSectionGrid /> : <PrinciplesSectionCarousel />}
        <View style={styles.container}>
          <View style={[styles.section, styles.contributorSection]}>
            <HoliHeading
              level="2"
              size="l"
              {...Platform.select({ web: { align: 'center' }, default: { align: 'left' } })}
            >
              {t('insights.curationPrinciples.curators.heading')}
            </HoliHeading>

            {(loading || !authors) &&
              [...new Array(5).keys()].map((i) => (
                <View style={styles.contributor} key={i}>
                  <HoliAvatar loading label={`Author ${i}`} />
                  <HoliText
                    size="small"
                    align="center"
                    numberOfLines={1}
                    loading
                    ellipsizeMode="tail"
                    style={styles.contributorName}
                  />
                </View>
              ))}
            {!loading && authors && (
              <View style={styles.contributors}>
                {authors.map((author) => (
                  <Pressable
                    key={author.id}
                    style={styles.contributor}
                    onPress={() => navigate(`/profile/${author.id}`)}
                  >
                    <Avatar
                      imgSrc={author.avatar}
                      imgPlaceholder={author.avatarBlurhash}
                      label={author.avatarLabel}
                      initials={author.avatarLabel}
                    />
                    <HoliText size="small" align="center">
                      {author.fullName}
                    </HoliText>
                  </Pressable>
                ))}
              </View>
            )}
          </View>

          <View style={[styles.section, styles.partnersSection]}>
            <HoliHeading
              level="2"
              size="l"
              {...Platform.select({ web: { align: 'center' }, default: { align: 'left' } })}
            >
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
      </HoliContainer>
    </ScrollView>
  )
}

const getStyles = (theme: HoliTheme, isWideLayout: boolean) =>
  StyleSheet.create({
    intro: {
      gap: Spacing.xs,
      paddingTop: Spacing.md,
    },

    wrapper: {
      backgroundColor: theme.colors.background20,
      ...Platform.select({
        web: {
          minHeight: '100%',
          paddingTop: dimensions.topBarHeight,
          paddingBottom: Spacing.lg,
        },
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

    cardText: {
      flex: 1,
    },

    circledNumber: {
      backgroundColor: theme.colors.brandB200,
      height: 32,
      width: 32,
      borderWidth: 1,
      borderRadius: 200,
      alignItems: 'center',
      justifyContent: 'center',
    },

    container: {
      ...(isWideLayout && {
        width: dimensions.maxScreenWidth,
        paddingHorizontal: Spacing['4xl'],
        alignSelf: 'center',
      }),
    },

    section: {
      paddingVertical: Spacing.xl,
      paddingHorizontal: Spacing.xs,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: theme.colors.black300,
      gap: Spacing.md,
    },

    contributorSection: {
      marginTop: Spacing.md,
      backgroundColor: theme.dark ? theme.colors.brandD300 : theme.colors.brandD200,
    },

    contributors: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      columnGap: isWideLayout ? Spacing.xs : Spacing['3xs'],
      rowGap: Spacing.md,
    },

    contributor: {
      justifyContent: 'flex-start',
      alignItems: 'center',
      gap: Spacing['3xs'],
      width: 110,
    },

    contributorName: {
      flex: 1,
      paddingHorizontal: 2,
    },

    partnersSection: {
      ...(isWideLayout ? { marginTop: Spacing.lg } : { marginTop: -1 }),
      backgroundColor: theme.colors.brandA200,
      marginTop: Spacing.sm,
      marginBottom: Spacing.xl,
    },

    partner: {
      padding: 8,
      backgroundColor: theme.colors.light,
      borderColor: theme.colors.black300,
      borderWidth: 1,
      borderRadius: 8,
      height: 52,
    },
  })

export default memo(CurationPrinciplesPage)

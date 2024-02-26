import React, { useLayoutEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, SafeAreaView, StyleSheet, View } from 'react-native'

import ScrollHeaderLayout from '@holi/core/components/ScrollHeaderLayout'
import { useToastForNotAvailableFeature } from '@holi/core/helpers'
import { HoliLink } from '@holi/core/navigation/components/HoliLink'
import createParamHooks from '@holi/core/navigation/hooks/useParam'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import { useSpace } from '@holi/core/screens/spaces/hooks/useSpace'
import { SpaceConnectionType } from '@holi/core/screens/spaces/types'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { ArrowRightS, Checkbox, Team } from '@holi/icons/src/generated'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

export type SpaceOnboardingParams = {
  spaceIdOrName: string
}

const { useParam } = createParamHooks<SpaceOnboardingParams>()

const SpaceOnboarding = () => {
  const { t } = useTranslation()
  const [spaceIdOrName] = useParam('spaceIdOrName')
  const setScreenOptions = useSetScreenOptions()
  const { navigate } = useRouting()
  const mixins = useStyleMixins()
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])

  const { space } = useSpace(spaceIdOrName)

  const isAdmin = space?.connectionStatusToMyself?.includes(SpaceConnectionType.ADMINISTRATOR)

  useLayoutEffect(() => {
    setScreenOptions({
      title: t('spaces.onboarding.title'),
      navigationCustomOptions: {
        footerShown: false,
      },
    })
  }, [setScreenOptions, t])

  const showFeatureNotImplementedToast = useToastForNotAvailableFeature()

  if (space && !isAdmin) {
    navigate(`/spaces/${spaceIdOrName}`)
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollHeaderLayout.Default style={styles.layout}>
        <View style={mixins.container}>
          <HoliHeading level="2">{t('spaces.onboarding.setup.title')}</HoliHeading>
          <HoliText style={styles.desc}>{t('spaces.onboarding.setup.text')}</HoliText>
          <HoliLink
            label={t('spaces.onboarding.setup.nextSteps.title')}
            href={`/spaces/${spaceIdOrName}/onboarding/steps`}
          >
            <View style={styles.link}>
              <View style={styles.row}>
                <HoliIcon icon={Team} style={styles.icon} />
                <View style={styles.textWrapper}>
                  <HoliText>{t('spaces.onboarding.setup.nextSteps.title')}</HoliText>
                  <HoliText size="small" style={styles.text}>
                    {t('spaces.onboarding.setup.nextSteps.text')}
                  </HoliText>
                </View>
              </View>
              <HoliIcon icon={ArrowRightS} />
            </View>
          </HoliLink>
          <HoliButton
            label={t('spaces.onboarding.setup.checklist.title')}
            transparent
            onPress={showFeatureNotImplementedToast}
          >
            <View style={styles.link}>
              <View style={styles.row}>
                <HoliIcon icon={Checkbox} style={styles.icon} />
                <View style={styles.textWrapper}>
                  <HoliText>{t('spaces.onboarding.setup.checklist.title')}</HoliText>
                  <HoliText size="small" style={styles.text}>
                    {t('spaces.onboarding.setup.checklist.text')}
                  </HoliText>
                </View>
              </View>
              <HoliIcon icon={ArrowRightS} />
            </View>
          </HoliButton>
        </View>
      </ScrollHeaderLayout.Default>
    </SafeAreaView>
  )
}

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    layout: {
      backgroundColor: theme.colors.background20,
      ...Platform.select({
        native: {
          height: '100%',
        },
        web: {
          minHeight: '100vh',
        },
      }),
      paddingTop: 24,
    },
    desc: {
      marginTop: 8,
      marginBottom: 14,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
    },
    link: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 14,
    },
    icon: {
      marginRight: 12,
    },
    textWrapper: {
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
      width: '100%',
      paddingRight: 12,
    },
    text: {
      color: theme.colors.foreground20,
      marginTop: 4,
      marginRight: 20,
    },
    safeArea: {
      flex: 1,
      backgroundColor: theme.colors.background20,
    },
  })

export default SpaceOnboarding

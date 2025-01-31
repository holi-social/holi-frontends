import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { type DimensionValue, Platform, ScrollView, StyleSheet, View } from 'react-native'

import PermissionsGuard, { PermissionsType } from '@holi/core/components/PermissionsGuard'
import { useToastForNotAvailableFeature } from '@holi/core/helpers'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import { HoliLink } from '@holi/core/navigation/components/HoliLink'
import createParamHooks from '@holi/core/navigation/hooks/useParam'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import { useSpace } from '@holi/core/screens/spaces/hooks/useSpace'
import { SpaceConnectionType } from '@holi/core/screens/spaces/types'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { ArrowRightS, Checkbox, Team } from '@holi/icons/src/generated'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'

export type SpaceOnboardingParams = {
  spaceIdOrName: string
}

const { useParam } = createParamHooks<SpaceOnboardingParams>()

const SpaceOnboarding = () => {
  const { t } = useTranslation()
  const spaceIdOrName = useParam('spaceIdOrName')
  const setScreenOptions = useSetScreenOptions()
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])

  const { loading, error, space } = useSpace(spaceIdOrName)

  useIsomorphicLayoutEffect(() => {
    setScreenOptions({
      title: t('spaces.onboarding.title'),
      headerLeft: () => <HeaderBackButton />,
      headerTitleAlign: 'center',
      headerBackVisible: false,
      navigationCustomOptions: {
        footerShown: false,
      },
      headerStyle: { backgroundColor: theme.colors.background20 },
    })
  }, [setScreenOptions, t, theme.colors.background20])

  const showFeatureNotImplementedToast = useToastForNotAvailableFeature({ feature: 'SPACE_ONBOARDING_CHECKLIST' })

  if (loading) {
    return (
      <View style={styles.loaderWrapper}>
        <HoliLoader />
      </View>
    )
  }

  if (error || !space) {
    return null
  }

  return (
    <PermissionsGuard
      space={space}
      spaceConnectionType={SpaceConnectionType.ADMINISTRATOR}
      permissionType={PermissionsType.SPACES}
    >
      <ScrollView style={styles.layout}>
        <HoliContainer>
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
        </HoliContainer>
      </ScrollView>
    </PermissionsGuard>
  )
}

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    loaderWrapper: {
      flex: 1,
      backgroundColor: theme.colors.background20,
    },
    layout: {
      backgroundColor: theme.colors.background20,
      ...Platform.select({
        native: {
          flex: 1,
          minHeight: '100%',
        },
        web: {
          minHeight: '100vh' as DimensionValue,
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
  })

export default SpaceOnboarding

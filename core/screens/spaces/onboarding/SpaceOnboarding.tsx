import { useLazyQuery } from '@apollo/client'
import React, { useEffect, useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, SafeAreaView, StyleSheet, View } from 'react-native'

import ScrollHeaderLayout from '@holi/core/components/ScrollHeaderLayout'
import { logError } from '@holi/core/errors/helpers'
import { useToastForNotAvailableFeature } from '@holi/core/helpers'
import createParam from '@holi/core/navigation/hooks/useParam'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import { SpaceByIdResponse, spaceByIdQuery } from '@holi/core/screens/spaces/queries'
import { SpaceConnectionType } from '@holi/core/screens/spaces/types'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliLink from '@holi/ui/components/atoms/HoliLink'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { colors } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

export type SpaceOnboardingParams = {
  spaceIdOrName: string
}

const { useParam } = createParam<SpaceOnboardingParams>()

const SpaceOnboarding = () => {
  const { t } = useTranslation()
  const [spaceIdOrName] = useParam('spaceIdOrName')
  const mixins = useStyleMixins()
  const setScreenOptions = useSetScreenOptions()
  const { navigate } = useRouting()

  const [fetchSpace, { data }] = useLazyQuery<SpaceByIdResponse>(spaceByIdQuery)

  useEffect(() => {
    if (spaceIdOrName) {
      fetchSpace({
        variables: { idOrName: spaceIdOrName || '' },
        onError: (error) => logError(error, `[SpaceOnboarding.tsx] ${error.message}`),
      })
    }
  }, [fetchSpace, spaceIdOrName])

  const space = data?.spaceById
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
    <ScrollHeaderLayout.Default style={styles.layout}>
      <SafeAreaView style={mixins.container}>
        <HoliHeading level="2">{t('spaces.onboarding.setup.title')}</HoliHeading>
        <HoliText style={styles.desc}>{t('spaces.onboarding.setup.text')}</HoliText>
        <HoliLink
          label={t('spaces.onboarding.setup.nextSteps.title')}
          href={`/spaces/${spaceIdOrName}/onboarding/steps`}
        >
          <View style={styles.link}>
            <View style={styles.row}>
              <HoliIcon icon="team" style={styles.icon} />
              <View style={styles.textWrapper}>
                <HoliText>{t('spaces.onboarding.setup.nextSteps.title')}</HoliText>
                <HoliText size="extrasmall" style={styles.text}>
                  {t('spaces.onboarding.setup.nextSteps.text')}
                </HoliText>
              </View>
            </View>
            <HoliIcon icon="arrow-right-s" />
          </View>
        </HoliLink>
        <HoliButton
          label={t('spaces.onboarding.setup.checklist.title')}
          transparent
          onPress={showFeatureNotImplementedToast}
        >
          <View style={styles.link}>
            <View style={styles.row}>
              <HoliIcon icon="checkbox" style={styles.icon} />
              <View style={styles.textWrapper}>
                <HoliText>{t('spaces.onboarding.setup.checklist.title')}</HoliText>
                <HoliText size="extrasmall" style={styles.text}>
                  {t('spaces.onboarding.setup.checklist.text')}
                </HoliText>
              </View>
            </View>
            <HoliIcon icon="arrow-right-s" />
          </View>
        </HoliButton>
      </SafeAreaView>
    </ScrollHeaderLayout.Default>
  )
}

const styles = StyleSheet.create({
  layout: {
    backgroundColor: colors.background20,
    ...Platform.select({
      native: {
        height: '100%',
      },
      web: {
        minHeight: '100vh',
      },
    }),
    paddingTop: 24,
    paddingHorizontal: 24,
  },
  desc: {
    marginTop: 8,
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    textAlign: 'center',
  },
  link: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    marginTop: 20,
    marginBottom: 8,
  },
  icon: {
    marginRight: 12,
  },
  textWrapper: {
    alignItems: 'flex-start',
  },
  text: {
    color: colors.foreground20,
  },
})

export default SpaceOnboarding

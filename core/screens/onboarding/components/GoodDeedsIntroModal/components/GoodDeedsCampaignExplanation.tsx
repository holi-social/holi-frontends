import type React from 'react'
import { useState } from 'react'
import { View } from 'react-native'
import { useTranslation } from 'react-i18next'

import { Stack } from 'holi-bricks/components/stack'
import { Image } from 'holi-bricks/components/image'
import { Text } from 'holi-bricks/components/text'
import { useGlobalRewardsCounterQuery } from '@holi/api/graphql/graphql-codegen'
import { GoodDeedsBanner } from '@holi/core/screens/userprofile/components/GoodDeedsBanner'

import { GoodDeedsIntroFooterNavigation } from './GoodDeedsIntroFooterNavigation'
// eslint-disable-next-line no-restricted-imports
import { useIsDesktopView } from '../helpers/isDesktopView'
// eslint-disable-next-line no-restricted-imports
import type { IntroFlowType } from '../helpers/useGoodDeedsIntroModalState'

const SVG_ASPECT_RATIO = 338 / 249

type GoodDeedsCampaignExplanationProps = {
  type: IntroFlowType
  onNextPress: () => void
  onBackPress: () => void
}

export const GoodDeedsCampaignExplanation = ({ type, onNextPress, onBackPress }: GoodDeedsCampaignExplanationProps) => {
  const { t } = useTranslation()
  const isDesktopView = useIsDesktopView()

  const { data: globalGoodDeeds } = useGlobalRewardsCounterQuery({
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
  })

  const [heroExplanaitonHeight, setHeroExplanaitonHeight] = useState(0)

  // resusable elements
  const textContent = (
    <Stack padding={{ top: 'lg', bottom: 'lg', left: 'md', right: 'md' }} gap="xs">
      <Text size="3xl">{t('onboarding.modal.goodDeed.campaignExplanation.title')}</Text>

      <Text>{t('onboarding.modal.goodDeed.campaignExplanation.text')}</Text>
    </Stack>
  )

  const navigation = (
    <GoodDeedsIntroFooterNavigation
      isBackButtonAvailable
      onBackPress={onBackPress}
      onNextPress={onNextPress}
      nextButtonLabel={
        type === 'onboarding'
          ? 'onboarding.modal.goodDeed.campaignExplanation.button'
          : 'onboarding.modal.goodDeed.campaignExplanation.nextGoodDeedButton'
      }
    />
  )

  if (isDesktopView) {
    return (
      <Stack flex={1} maxHeight="100%" overflow="hidden" direction="row">
        <Stack
          flex={353}
          padding={{ top: 'md' }}
          borderRadius={{ topRight: 'xxl', bottomRight: 'xxl' }}
          backgroundColor="yellowDefault"
        >
          <Stack padding={{ left: 'md', right: 'md' }}>
            <GoodDeedsBanner counter={globalGoodDeeds?.rewards_globalCounter.counter ?? 0} />
          </Stack>

          <View style={{ flex: 1, zIndex: -1 }}>
            <Stack flex={1}>
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  position: 'absolute',
                  top: heroExplanaitonHeight * -0.01,
                  left: 0,
                  right: 0,
                  bottom: 0,
                }}
                onLayout={(event) => setHeroExplanaitonHeight(event.nativeEvent.layout.height * 1.2)}
              >
                <Image
                  source={require('@holi/ui/assets/img/goodDeeds/holi-heroes-holding-something.svg')}
                  height={heroExplanaitonHeight}
                  width={heroExplanaitonHeight * SVG_ASPECT_RATIO}
                  alt={t('navigation.title')}
                />
              </View>
            </Stack>
          </View>
        </Stack>

        <Stack flex={447} justifyContent="space-between" backgroundColor="white">
          {textContent}
          {navigation}
        </Stack>
      </Stack>
    )
  }

  return (
    <Stack justifyContent="space-between" flex={1} backgroundColor="yellowDefault">
      <Stack justifyContent="space-between">{textContent}</Stack>

      <Stack backgroundColor="yellowDefault" borderRadius={{ bottomLeft: 'xxl', bottomRight: 'xxl' }} flex={1}>
        <Stack padding={{ left: 'md', right: 'md' }}>
          <GoodDeedsBanner counter={globalGoodDeeds?.rewards_globalCounter.counter ?? 0} />
        </Stack>

        <View style={{ flex: 1, zIndex: -1 }}>
          <Stack flex={1}>
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                position: 'absolute',
                top: heroExplanaitonHeight * -0.01,
                left: 0,
                right: 0,
                bottom: 0,
              }}
              onLayout={(event) => {
                const estimatedWidth = event.nativeEvent.layout.height * SVG_ASPECT_RATIO
                if (estimatedWidth > event.nativeEvent.layout.width - 24) {
                  setHeroExplanaitonHeight((event.nativeEvent.layout.width - 24) / SVG_ASPECT_RATIO)
                } else {
                  setHeroExplanaitonHeight(event.nativeEvent.layout.height)
                }
              }}
            >
              <Image
                source={require('@holi/ui/assets/img/goodDeeds/holi-heroes-holding-something.svg')}
                height={heroExplanaitonHeight}
                width={heroExplanaitonHeight * SVG_ASPECT_RATIO}
                alt={t('navigation.title')}
              />
            </View>
          </Stack>
        </View>
      </Stack>

      {navigation}
    </Stack>
  )
}

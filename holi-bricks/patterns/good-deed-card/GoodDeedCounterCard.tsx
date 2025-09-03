import React from 'react'
import { TextLink } from 'holi-bricks/components/text'
import { useTranslation } from 'react-i18next'
import { Stack } from 'holi-bricks/components/stack'
import { Question } from '@holi/icons/src/generated'
import { Spacing } from 'holi-bricks/foundations'
import { Image } from 'holi-bricks/components/image'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { createStyleSheet } from 'react-native-unistyles'
import { View } from 'react-native'
import { GoodDeedCard, type GoodDeedCardProps } from 'holi-bricks/patterns/good-deed-card/GoodDeedCard'

type GoodDeedCardCounterProps = GoodDeedCardProps & {
  totalCount: number
}

export const GoodDeedCounterCard = ({ totalCount, ...rest }: GoodDeedCardCounterProps) => {
  const { t } = useTranslation()

  //const handleOpenCampaign = useLink({ href: 'https://holi.social/1million', external: true })
  const handleOpenCampaign = () => {}
  return (
    <Stack gap="3xs">
      <View style={stylesheet.container}>
        <Image
          source={require('@holi/ui/assets/img/goodDeeds/campaignGradient.jpg')}
          height={0}
          width={0}
          stretch
          alt={t('oneMioGoodDeeds.hashtag')}
        />
      </View>
      <GoodDeedCard {...rest} />

      <Stack justifyContent="center" direction="row" gap="4xs" alignItems="center" margin={{ bottom: '3xs' }}>
        {totalCount > 0 && (
          <TextLink size="sm" textAlign="center" onPress={handleOpenCampaign}>
            {t('task.card.goodDeeds.globalCounter', { count: totalCount })}
          </TextLink>
        )}
        <HoliIcon icon={Question} size={Spacing.xs} />
      </Stack>
    </Stack>
  )
}

const stylesheet = createStyleSheet({
  container: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    borderRadius: Spacing.xs,
    overflow: 'hidden',
  },
})

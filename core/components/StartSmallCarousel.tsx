import { Text } from 'holi-bricks/components/text'
import type React from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, View } from 'react-native'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Stack } from 'holi-bricks/components/stack'
import { BorderRadius, Spacing } from 'holi-bricks/foundations'
import { MiniCard } from 'holi-bricks/components/miniCard/MiniCard'
import { Footprints, MapPin2Filled } from '@holi/icons/src/generated'
import { createStyleSheet, useStyles } from 'holi-bricks/styles'

// to be replaced by real data ------------------------------------------------------------
export type TempGoodDeeds = {
  id: string
  title: string
  duration?: string
  location?: string
  imageUrl?: string
}
const doingGood: TempGoodDeeds[] = [
  {
    id: '1',
    title: 'Help cleaning at the animal shelter',
    duration: '30-60 Minuten',
    location: 'Remote',
    imageUrl: 'https://picsum.photos/id/1018/800/600',
  },
  {
    id: '2',
    title: 'Need help with social media designs',
    duration: '30-60 Minuten',
    location: 'Remote',
    imageUrl: 'https://picsum.photos/id/1020/800/600',
  },
  {
    id: '3',
    title: 'Join public discussion on democracy',
    duration: '30-60 Minuten',
    location: 'Remote',
    imageUrl: 'https://picsum.photos/id/1019/800/600',
  },
]
// ----------------------------------------------------------------------------------------

const StartSmallCarousel = () => {
  const { t } = useTranslation()
  const { styles } = useStyles(stylesheet)

  const listProps = {
    horizontal: true,
    contentContainerStyle: {
      paddingHorizontal: Spacing.xs,
      gap: Spacing['3xs'],
    },
    data: doingGood,
  }

  const ListComponent = (
    <FlatList
      renderItem={({ item }) => (
        <MiniCard
          title={item.title}
          chipLabel={item.duration}
          bottomIconLeft={MapPin2Filled}
          bottomLabel={item.location}
          imageSrc={item.imageUrl}
        />
      )}
      {...listProps}
    />
  )

  return (
    <View style={styles.StartSmallCarousel}>
      <Stack gap="sm" minHeight="auto" flex={1}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" padding={{ left: 'xs', right: 'xs' }}>
          <Stack direction="row" gap="xs" justifyContent="center" alignItems="center">
            <Stack direction="column">
              <Stack direction="row" gap="3xs">
                <HoliIcon icon={Footprints} size={24} color="informative" />
                <Text size="xxl" headingLevel="3">
                  {t('act.startSmall.title')}
                </Text>
              </Stack>
              <Stack padding={{ left: 'lg' }}>
                <Text size="sm" color="support">
                  {t('act.startSmall.subline')}
                </Text>
              </Stack>
            </Stack>
          </Stack>
        </Stack>

        {ListComponent}
      </Stack>
    </View>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  StartSmallCarousel: {
    backgroundColor: theme.colors.decorative.purpleLight,
    paddingVertical: Spacing['xs'],
    borderRadius: BorderRadius.md,
    gap: Spacing['xs'],
  },
}))

export default StartSmallCarousel

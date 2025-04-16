import { Text } from 'holi-bricks/components/text'
import type React from 'react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'
import ImagePreview from '@holi/core/screens/individualPosts/components/ImagePreview'
import { Spacing } from 'holi-bricks/tokens'
import { HoliLink } from '@holi/core/navigation/components/HoliLink'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { ArrowRightS, MapPin2 } from '@holi/icons/src/generated'
import type { VolunteeringEngagement, VolunteeringReco } from '@holi-apps/volunteering/types'
import { VolunteeringLabels } from '@holi-apps/volunteering/components/VolunteeringLabels'

type VolunteeringCardProps = {
  engagementOrReco: VolunteeringReco | VolunteeringEngagement
  style?: StyleProp<ViewStyle>
}

const VolunteeringCard: React.FC<VolunteeringCardProps> = ({ engagementOrReco, style }: VolunteeringCardProps) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])

  const isReco = 'engagement' in engagementOrReco
  const engagement = isReco ? engagementOrReco.engagement : engagementOrReco

  return (
    <View style={[styles.container, style]} testID="volunteering-card">
      <HoliLink label={t('volunteering:recommended.title')} href={'/volunteering'}>
        <View style={styles.header}>
          <Text size="xs" colorOverride={theme.colors.gray300}>
            {t('volunteering:recommended.title')}
          </Text>
          <View style={styles.seeMore}>
            <Text size="xs">{t('global.seeMore')}</Text>
            <HoliIcon icon={ArrowRightS} size={16} />
          </View>
        </View>
      </HoliLink>
      <HoliLink label={engagement.title ?? ''} href={`/volunteering/${engagement.id}`}>
        <View style={styles.content}>
          <ImagePreview currentImage={engagement.imageUrl} />
          <View>
            <VolunteeringLabels
              displayAll={false}
              topicSlugs={isReco ? engagementOrReco.matchedTopicsV2 : engagement?.topicsV2}
              skillSlugs={isReco ? engagementOrReco.matchedSkillsV2 : engagement?.skillsV2}
            />
          </View>
          <Text size="lg">{engagement.title}</Text>
          <View style={styles.locationFooter}>
            <HoliIcon icon={MapPin2} size={16} colorOverride={theme.colors.gray300} />
            <Text size="xs" colorOverride={theme.colors.gray300}>
              {engagement.location}
            </Text>
          </View>
        </View>
      </HoliLink>
    </View>
  )
}

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background10,
      borderRadius: Spacing.xs,
      borderColor: theme.colors.gray200,
      borderWidth: 1,
      gap: Spacing['xxs'],
    },
    header: {
      paddingHorizontal: Spacing.xs,
      paddingTop: Spacing.xs,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    content: {
      paddingHorizontal: Spacing.xs,
      paddingBottom: Spacing.xs,
      gap: Spacing['xxs'],
    },
    seeMore: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    locationFooter: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing['4xs'],
    },
  })

export default VolunteeringCard

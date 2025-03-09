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
import type { VolunteeringReco } from '@holi-apps/volunteering/types'
import { VolunteeringLabels } from '@holi-apps/volunteering/components/VolunteeringLabels'

type VolunteeringCardProps = {
  recommendation: VolunteeringReco
  style?: StyleProp<ViewStyle>
}

const VolunteeringCard: React.FC<VolunteeringCardProps> = ({ recommendation, style }: VolunteeringCardProps) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])

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
      <HoliLink label={recommendation.engagement.title} href={`/volunteering/${recommendation.engagement.id}`}>
        <View style={styles.content}>
          <ImagePreview currentImage={recommendation.engagement.imageUrl} />
          <View>
            <VolunteeringLabels
              displayAll={false}
              topicSlugs={recommendation.matchedTopicsV2}
              skillSlugs={recommendation.matchedSkillsV2}
            />
          </View>
          <Text size="lg">{recommendation.engagement.title}</Text>
          <View style={styles.locationFooter}>
            <HoliIcon icon={MapPin2} size={16} color={theme.colors.gray300} />
            <Text size="xs" colorOverride={theme.colors.gray300}>
              {recommendation.engagement.location}
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

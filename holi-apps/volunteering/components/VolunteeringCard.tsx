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
import { VolunteeringLabels } from '@holi-apps/volunteering/components/VolunteeringLabels'
import type { LocalizedTypesenseDocument } from '@holi/core/typesense/types'
import { linkFromLocator } from '@holi/core/typesense/helpers/linkFromLocator'
import { Image } from 'holi-bricks/components/image'

type VolunteeringCardProps = {
  engagement: LocalizedTypesenseDocument
  style?: StyleProp<ViewStyle>
}

const VolunteeringCard: React.FC<VolunteeringCardProps> = ({ engagement, style }: VolunteeringCardProps) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])
  const link = linkFromLocator(engagement.type, engagement.link_locators)

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
      <HoliLink label={engagement.title} href={link}>
        <View style={styles.content}>
          {engagement.image_url ? (
            <ImagePreview currentImage={engagement.image_url} />
          ) : (
            <Image
              source={require('@holi/ui/assets/img/illustrations/illustration_task.svg')}
              width={296}
              height={166}
              alt={''}
            />
          )}
          <View>
            <VolunteeringLabels
              displayAll={false}
              topicSlugs={engagement?.topics_v2}
              skillSlugs={engagement?.skills_v2}
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

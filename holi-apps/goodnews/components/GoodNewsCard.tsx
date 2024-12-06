import { Text } from 'holi-bricks/components/text'
import type React from 'react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'
import type { GoodNewsArticle } from '@holi-apps/goodnews/types'
import ImagePreview from '@holi/core/screens/individualPosts/components/ImagePreview'
import { Spacing } from 'holi-bricks/tokens'
import { HoliLink } from '@holi/core/navigation/components/HoliLink'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { ArrowRightS } from '@holi/icons/src/generated'
import { getRelativeDateString } from '@holi/core/i18n/helpers/dateHelper'

type GoodNewsCardProps = {
  article: GoodNewsArticle
  style?: StyleProp<ViewStyle>
}

const GoodNewsCard: React.FC<GoodNewsCardProps> = ({ article, style }: GoodNewsCardProps) => {
  const { t, i18n } = useTranslation()
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])

  const date =
    getRelativeDateString(article.date, i18n.language).charAt(0).toUpperCase() +
    getRelativeDateString(article.date, i18n.language).slice(1)

  return (
    <HoliLink label={article.headline} href={`/apps/goodnews?articleId=${article.id}`}>
      <View style={[styles.container, style]} testID="goodnews-card">
        <View style={styles.header}>
          <HoliLocalImage
            imageSource={require('@holi/ui/assets/img/goodnews/goodnews-wordmark.png')}
            isSvg={false}
            label={article.headline}
            width={107}
            height={16}
            resizeMode={'contain'}
          />
          <View style={styles.seeMore}>
            <Text size="xs">{t('global.seeMore')}</Text>
            <HoliIcon icon={ArrowRightS} size={16} />
          </View>
        </View>
        <Text size="xs">{t('goodnews:listing.partnerModal.goodnews.eu.buttonText')}</Text>
        <ImagePreview currentImage={article.pictureUrl} />
        <Text size="sm">{article.headline}</Text>
        <Text size="xs">{date}</Text>
      </View>
    </HoliLink>
  )
}

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background10,
      borderRadius: Spacing.xs,
      padding: Spacing.xs,
      borderColor: theme.colors.gray200,
      borderWidth: 1,
      gap: Spacing['xxs'],
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    seeMore: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing['4xs'],
    },
  })

export default GoodNewsCard

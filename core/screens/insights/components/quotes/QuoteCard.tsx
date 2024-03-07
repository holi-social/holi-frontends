import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import LinkInfo from '@holi/core/screens/insights/recommendations/LinkInfo'
import { Quote } from '@holi/core/screens/insights/types'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliImage from '@holi/ui/components/atoms/HoliImage'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliBadge from '@holi/ui/components/molecules/HoliBadge'
import Spacing from '@holi/ui/foundations/Spacing'
import { colors } from '@holi/ui/styles/globalVars'

export interface QuoteCardProps {
  quote: Quote
}

const QuoteCard: React.FC<QuoteCardProps> = ({ quote }) => {
  const { t } = useTranslation()

  return (
    <View style={styles.cardContainer}>
      <View style={styles.quoteCard}>
        <HoliLocalImage
          imageSource={require('@holi/ui/assets/img/illustrations/illustrations_quote.svg')}
          label="Quote icon"
          width={26}
          height={15}
          resizeMode="contain"
          isSvg
        />
        <HoliGap size="s" />
        <HoliText numberOfLines={5}>{quote.text}</HoliText>
        <HoliGap size="xs" />
        <HoliText size="extrasmall" color="gray300">
          {quote.author} ∙ {quote.authorProfession}
        </HoliText>
      </View>
      <HoliGap size="xs" />
      <View style={styles.sourceCard}>
        {!!quote.linkPreview.image && (
          <View style={styles.linkPreviewImageContainer}>
            <HoliImage
              source={{ uri: quote.linkPreview.image }}
              label={quote.linkPreview.title}
              style={styles.linkPreviewImage}
            />
          </View>
        )}
        <View style={styles.linkPreviewDetailsContainer}>
          <HoliBadge textSize="extrasmall">
            {t(`insights.recommendations.category.${quote.category.toLowerCase()}`)}
          </HoliBadge>
          <View>
            <HoliHeading level="2" size="s" selectable numberOfLines={2}>
              {quote.linkPreview.title}
            </HoliHeading>
          </View>
          <LinkInfo link={quote.link} icon={quote.linkPreview.icon} size="sm" />
        </View>
      </View>
    </View>
  )
}

export default memo(QuoteCard)

const styles = StyleSheet.create({
  cardContainer: {
    width: '100%',
    justifyContent: 'center',
    flex: 1,
  },

  quoteCard: {
    backgroundColor: colors.background10,
    padding: Spacing.xs,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.background30,
    height: 240,
  },

  sourceCard: {
    flexDirection: 'row',
    backgroundColor: colors.background10,
    padding: Spacing['3xs'],
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.background30,
    flex: 1,
  },

  linkPreviewImageContainer: {
    width: 86,
    height: '100%',
    marginRight: Spacing.xxs,
  },

  linkPreviewImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },

  linkPreviewDetailsContainer: {
    flex: 1,
    justifyContent: 'space-between',
    gap: Spacing['4xs'],
  },
})

import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable, StyleSheet, View, ViewStyle } from 'react-native'

import useRouting from '@holi/core/navigation/hooks/useRouting'
import { Quote } from '@holi/core/screens/insights/types'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { LinkM } from '@holi/icons/src/generated'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliImage from '@holi/ui/components/atoms/HoliImage'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliBadge from '@holi/ui/components/molecules/HoliBadge'
import Spacing from '@holi/ui/foundations/Spacing'
import { colors } from '@holi/ui/styles/globalVars'

export interface QuoteCardProps {
  insightId: string
  quote: Quote
}

type OptionalStyles = {
  style?: ViewStyle
}

const QuoteCard: React.FC<Pick<QuoteCardProps, 'quote'> & OptionalStyles> = ({ quote, style = {} }) => {
  return (
    <View style={[styles.quoteCard, style]}>
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
  )
}

const SourceCard: React.FC<Pick<QuoteCardProps, 'quote'>> = ({ quote }) => {
  const { t } = useTranslation()
  const linkHost = new URL(quote.link).host.replace(/^(www.)/, '')

  return (
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
        <View style={styles.linkPreviewSourceLineContainer}>
          {!!quote.linkPreview.icon && (
            <View style={styles.linkPreviewFavicon}>
              <HoliImage
                source={{ uri: quote.linkPreview.icon }}
                label={quote.linkPreview.title}
                style={{ width: 18, height: 18 }}
              />
            </View>
          )}
          {!quote.linkPreview.icon && (
            <View style={[styles.linkPreviewFavicon, styles.linkPreviewDefaultIcon]}>
              <HoliIcon icon={LinkM} size={18} color={colors.brandB300} />
            </View>
          )}
          <HoliText size="extrasmall" color="gray300" numberOfLines={1}>
            {linkHost}
          </HoliText>
        </View>
      </View>
    </View>
  )
}

const InsightQuoteCard: React.FC<QuoteCardProps> = ({ insightId, quote }) => {
  const { navigate } = useRouting()

  return (
    <Pressable style={styles.card} onPress={() => navigate(`/insights/${insightId}/quotes/${quote.id}`)}>
      <QuoteCard quote={quote} />
      <HoliGap size="xs" />
      <SourceCard quote={quote} />
    </Pressable>
  )
}

export default memo(InsightQuoteCard)

const styles = StyleSheet.create({
  card: {
    width: '100%',
    justifyContent: 'center',
    flex: 1,
  },
  quoteCard: {
    backgroundColor: colors.background10,
    padding: Spacing.xxs,
    borderRadius: Spacing.xs,
    borderWidth: 1,
    borderColor: colors.foreground10,
    height: 240,
  },
  sourceCard: {
    flexDirection: 'row',
    backgroundColor: colors.background10,
    padding: Spacing['3xs'],
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.foreground10,
    flex: 1,
  },
  linkPreviewImageContainer: {
    width: 86,
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
  linkPreviewSourceLineContainer: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    alignItems: 'center',
    gap: Spacing['3xs'],
  },
  linkPreviewFavicon: {
    height: 24,
    width: 24,
    borderRadius: 4,
    backgroundColor: colors.white200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  linkPreviewDefaultIcon: {
    backgroundColor: colors.brandB100,
  },
})

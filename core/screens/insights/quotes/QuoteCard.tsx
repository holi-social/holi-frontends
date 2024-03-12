import React, { memo } from 'react'
import { Pressable, StyleSheet, View, ViewStyle } from 'react-native'

import useRouting from '@holi/core/navigation/hooks/useRouting'
import ExternalContentCategoryBadge from '@holi/core/screens/insights/components/ExternalContentCategoryBadge'
import LinkInfo from '@holi/core/screens/insights/components/LinkInfo'
import { Quote } from '@holi/core/screens/insights/types'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliImage from '@holi/ui/components/atoms/HoliImage'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import Spacing from '@holi/ui/foundations/Spacing'
import { colors } from '@holi/ui/styles/globalVars'

export interface QuoteCardProps {
  quote: Quote
  numberOfLines?: number
  style?: ViewStyle
}

export interface SourceCardProps {
  quote: Quote
}

export interface QuoteAndSourceCardProps {
  insightId: string
  quote: Quote
  quoteCardStyle?: ViewStyle
}

const QuoteCard: React.FC<QuoteCardProps> = ({ quote, numberOfLines, style = {} }) => {
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
      <HoliText numberOfLines={numberOfLines}>{quote.text}</HoliText>
      <HoliGap size="xs" />
      <HoliText size="extrasmall" color="gray300">
        {quote.author} ∙ {quote.authorProfession}
      </HoliText>
    </View>
  )
}

const SourceCard: React.FC<SourceCardProps> = ({ quote }) => {
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
        <ExternalContentCategoryBadge category={quote.category} />
        <View>
          <HoliHeading level="2" size="s" selectable numberOfLines={2}>
            {quote.linkPreview.title}
          </HoliHeading>
        </View>
        <LinkInfo link={quote.link} icon={quote.linkPreview.icon} size="sm" />
      </View>
    </View>
  )
}

const QuoteAndSourceCard: React.FC<QuoteAndSourceCardProps> = ({ insightId, quote, quoteCardStyle = {} }) => {
  const { navigate } = useRouting()

  return (
    <Pressable style={styles.card} onPress={() => navigate(`/insights/${insightId}/quotes/${quote.id}`)}>
      <QuoteCard quote={quote} numberOfLines={5} style={quoteCardStyle} />
      <HoliGap size="xs" />
      <SourceCard quote={quote} />
    </Pressable>
  )
}

export default {
  QuoteOnly: memo(QuoteCard),
  SourceOnly: memo(SourceCard),
  QuoteAndSource: memo(QuoteAndSourceCard),
}

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
})

import type React from 'react'
import { memo, useMemo, useState } from 'react'
import { Platform, Pressable, StyleSheet, View, type ViewStyle } from 'react-native'

import useRouting from '@holi/core/navigation/hooks/useRouting'
import InsightReactions, { ItemType } from '@holi/core/screens/insights/InsightReactions'
import ExternalContentCategoryBadge from '@holi/core/screens/insights/components/ExternalContentCategoryBadge'
import LinkInfo from '@holi/core/screens/insights/components/LinkInfo'
import type { Quote } from '@holi/core/screens/insights/types'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { QuoteFilledOutlined } from '@holi/icons/src/generated'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliImage from '@holi/ui/components/atoms/HoliImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import Spacing from '@holi/ui/foundations/Spacing'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'

export interface QuoteCardProps {
  quote: Quote
  quoteColor?: string
  numberOfLines?: number
  showReaction?: boolean
  style?: ViewStyle
}

export interface SourceCardProps {
  quote: Quote
  style?: ViewStyle
}

export interface QuoteAndSourceCardProps {
  insightId: string
  quote: Quote
  quoteColor: string
  showReaction?: boolean
}

const QuoteCard: React.FC<QuoteCardProps> = ({ quote, quoteColor, numberOfLines, showReaction, style }) => {
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])

  return (
    <View style={[styles.quoteCard, style]} testID={'quote-card-quote'}>
      <HoliIcon icon={QuoteFilledOutlined} colorOverride={quoteColor} testID={'quote-card-quote-icon'} size={26} />
      <HoliGap size="xs" />
      <HoliText numberOfLines={numberOfLines}>{quote.text}</HoliText>
      <HoliGap size="xs" />
      <HoliText size="extrasmall" color="gray300" style={styles.author}>
        {quote.author} ∙ {quote.authorProfession}
      </HoliText>
      {showReaction && <InsightReactions item={quote} itemType={ItemType.QUOTE} style={styles.reaction} />}
    </View>
  )
}

const SourceCard: React.FC<SourceCardProps> = ({ quote, style }) => {
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])

  return (
    <View style={[styles.sourceCard, style]} testID={'quote-card-source'}>
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
        <LinkInfo link={quote.link} icon={quote.linkPreview.icon} size="sm" color="gray300" />
      </View>
    </View>
  )
}

const QuoteAndSourceCard: React.FC<QuoteAndSourceCardProps> = ({ insightId, quote, quoteColor, showReaction }) => {
  const [hovered, setHovered] = useState(false)
  const { navigate } = useRouting()
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])

  return (
    <Pressable
      style={styles.card}
      onPress={() => navigate(`/insights/${insightId}/quotes/${quote.id}`)}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
    >
      <QuoteCard
        quote={quote}
        quoteColor={quoteColor}
        numberOfLines={5}
        style={hovered ? styles.hovered : {}}
        showReaction={showReaction}
      />
      <HoliGap size="xs" />
      <SourceCard quote={quote} style={hovered ? styles.hovered : {}} />
    </Pressable>
  )
}

export default {
  QuoteOnly: memo(QuoteCard),
  SourceOnly: memo(SourceCard),
  QuoteAndSource: memo(QuoteAndSourceCard),
}

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    card: {
      width: '100%',
      justifyContent: 'center',
    },

    quoteCard: {
      backgroundColor: theme.colors.background10,
      padding: Spacing.xxs,
      borderRadius: Spacing.xs,
      borderWidth: 1,
      borderColor: theme.colors.foreground10,
      flex: 1,
    },

    sourceCard: {
      flexDirection: 'row',
      backgroundColor: theme.colors.background10,
      padding: Spacing['3xs'],
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.colors.foreground10,
      height: 110,
      ...Platform.select({
        web: { marginBottom: 4 },
      }),
    },

    hovered: {
      borderColor: theme.colors.black300,
      shadowColor: theme.colors.black300,
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.12,
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

    reaction: {
      position: 'absolute',
      bottom: 12,
      right: 16,
    },

    author: {
      marginBottom: 57,
    },
  })

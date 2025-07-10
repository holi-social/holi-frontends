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
import { Image } from 'holi-bricks/components/image'
import { Text } from 'holi-bricks/components/text'
import Spacing from '@holi/ui/foundations/Spacing'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { Stack } from 'holi-bricks/components/stack'
import ReactionCount from '@holi/core/components/reactions/ReactionCount'

export interface QuoteCardProps {
  quote: Quote
  quoteColor?: string
  numberOfLines?: number
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
}

const QuoteCard: React.FC<QuoteCardProps> = ({ quote, quoteColor, numberOfLines, style }) => {
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])

  return (
    <View style={[styles.quoteCard, style]} testID={'quote-card-quote'}>
      <View style={styles.content}>
        <HoliIcon icon={QuoteFilledOutlined} colorOverride={quoteColor} testID={'quote-card-quote-icon'} size={26} />
        <HoliGap size="xs" />
        <Text numberOfLines={numberOfLines} size="sm" margin={{ bottom: 'xs' }}>
          {quote.text}
        </Text>
        <Text size="xs" color="default" margin={{ bottom: '3xl' }}>
          {quote.author} ∙ {quote.authorProfession}
        </Text>
      </View>
      <Stack direction="row" justifyContent="space-between">
        <ReactionCount count={quote.reactions.HEART} />
        <InsightReactions item={quote} itemType={ItemType.QUOTE} />
      </Stack>
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
          <Image
            source={quote.linkPreview.image}
            alt={quote.linkPreview.title}
            width={88}
            height={88}
            stretch
            resizeMode="cover"
          />
        </View>
      )}
      <View style={styles.linkPreviewDetailsContainer}>
        <ExternalContentCategoryBadge category={quote.category} />
        <View>
          <Text headingLevel="2" size="lg" numberOfLines={2}>
            {quote.linkPreview.title}
          </Text>
        </View>
        <LinkInfo link={quote.link} icon={quote.linkPreview.icon} size="sm" color="gray300" />
      </View>
    </View>
  )
}

const QuoteAndSourceCard: React.FC<QuoteAndSourceCardProps> = ({ insightId, quote, quoteColor }) => {
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
      <QuoteCard quote={quote} quoteColor={quoteColor} numberOfLines={5} style={hovered ? styles.hovered : {}} />
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
    content: {
      flexGrow: 1,
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
      borderRadius: Spacing['3xs'],
      overflow: 'hidden',
    },
    linkPreviewDetailsContainer: {
      flex: 1,
      justifyContent: 'space-between',
      gap: Spacing['4xs'],
    },
  })

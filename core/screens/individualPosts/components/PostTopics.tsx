import { ChipSelect } from 'holi-bricks/components/chips'
import type React from 'react'
import { useContext, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, ScrollView, StyleSheet, View } from 'react-native'

import {
  type SortedTerm,
  type Term,
  termsBySortNumberComparator,
  termsByTitleComparator,
} from '@holi/core/domain/shared/types'
import { SpaceTermContext } from '@holi/core/screens/spaces/providers/SpaceTermContextProvider'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Information, Search } from '@holi/icons/src/generated'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliTextInput from '@holi/ui/components/molecules/HoliTextInput'
import Spacing from '@holi/ui/foundations/Spacing'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'

export type PostTopicsProps = {
  selectedTopicsIds: Term[]
  onChangeSelectedTopics: (topics: Term[]) => void
}

const PostTopics: React.FC<PostTopicsProps> = ({ selectedTopicsIds, onChangeSelectedTopics }: PostTopicsProps) => {
  const { t } = useTranslation()
  const { topics } = useContext(SpaceTermContext)
  const { theme } = useTheme()
  const { colors } = theme
  const styles = useMemo(() => getStyles(theme), [theme])

  const [filterString, setFilterString] = useState<string>('')
  const [orderedTerms, setOrderedTerms] = useState<SortedTerm[]>([])
  const [filteredTerms, setFilteredTerms] = useState<SortedTerm[]>([])
  const showSortNumber = true

  const selectedTopics: Term[] = useMemo(
    () => topics?.filter((topic) => selectedTopicsIds.some((selectedTopic) => selectedTopic.id === topic.id)) || [],
    [topics, selectedTopicsIds]
  )

  useEffect(() => {
    const unselected = topics && topics.filter((topic) => !selectedTopics?.find((item) => item.id === topic.id))
    const copyOfSelected = [...selectedTopics]
    setOrderedTerms([
      ...copyOfSelected.sort(showSortNumber ? termsBySortNumberComparator : termsByTitleComparator),
      ...unselected.sort(showSortNumber ? termsBySortNumberComparator : termsByTitleComparator),
    ])
  }, [topics, showSortNumber, selectedTopics])

  useEffect(
    () =>
      setFilteredTerms(
        filterString === ''
          ? orderedTerms
          : orderedTerms.filter((term) => term.title.toLowerCase().includes(filterString.toLowerCase()))
      ),
    [orderedTerms, filterString]
  )

  const updateValues = (term: Term) => {
    if (selectedTopics?.includes(term)) {
      onChangeSelectedTopics(selectedTopics?.filter((selectedTerm) => selectedTerm !== term))
    } else if (selectedTopics?.length < 6) {
      onChangeSelectedTopics([...selectedTopics, term])
    }
  }

  return (
    <ScrollView>
      <View style={styles.modal}>
        <View style={styles.container} testID={'post-topics-list'}>
          <HoliText style={styles.description}>{t('individuals.post.input.topics.description')}</HoliText>
          <HoliTextInput
            aria-label={t('spaces.input.topics.search')}
            value={filterString}
            placeholder={t('spaces.input.topics.search')}
            onChange={(text: string) => setFilterString(text)}
            trailingIcon={Search}
            style={styles.input}
            testID="post-topics-search-input"
          />
          <View style={styles.hintContainer}>
            <HoliIcon icon={Information} size={14} color={colors.foreground20} style={styles.infoIcon} />
            <HoliText size="small" style={styles.hint}>
              {t('spaces.input.topics.hint')}
            </HoliText>
          </View>
          <View style={styles.termsListContainer}>
            {filteredTerms &&
              filteredTerms.map((term) => (
                <ChipSelect key={term.id} selected={selectedTopics?.includes(term)} onPress={() => updateValues(term)}>
                  {showSortNumber && term.number ? `${term.number}. ${term.title}` : term.title}
                </ChipSelect>
              ))}
          </View>
        </View>
      </View>
    </ScrollView>
  )
}

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    modal: {
      backgroundColor: theme.colors.background10,
      paddingHorizontal: Spacing.xs,
      marginTop: Spacing.xs,
      borderRadius: Spacing.xs,
      alignItems: 'center',
    },
    container: {
      paddingVertical: Spacing.xs,
      ...Platform.select({
        native: {
          maxWidth: '100%',
        },
      }),
    },
    description: {
      marginBottom: Spacing.lg,
      color: theme.colors.foreground20,
    },
    input: {
      marginBottom: Spacing.xs,
    },
    hintContainer: {
      flexDirection: 'row',
    },
    infoIcon: { marginTop: 2 },
    hint: {
      marginLeft: 5,
      color: theme.colors.foreground20,
    },
    termsListContainer: {
      marginTop: Spacing.xs,
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      flexShrink: 1,
      gap: 8,
    },
  })

export default PostTopics

import React, { useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View, useWindowDimensions } from 'react-native'

import { SpaceTermContext } from '@holi/core/screens/spaces/components/SpaceTermContextProvider'
import { Topic } from '@holi/core/screens/userprofile/types'
import { termsByTitleComparator } from '@holi/core/screens/userprofile/types'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliChip from '@holi/ui/components/molecules/HoliChip'
import HoliTextInput from '@holi/ui/components/molecules/HoliTextInput'
import { colors } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

export type SpaceTopicsInputProps = {
  onSelectSpaceTopics: (topics: Topic[]) => void
  selectedTopics: Topic[]
}

const SpaceTopicsInput: React.VFC<SpaceTopicsInputProps> = ({
  onSelectSpaceTopics,
  selectedTopics,
}: SpaceTopicsInputProps) => {
  const [filterString, setFilterString] = useState<string>('')
  const [orderedTerms, setOrderedTerms] = useState<Topic[]>([])
  const [filteredTopics, setFilteredTopics] = useState<Topic[]>([])
  const { height: deviceHeight } = useWindowDimensions()
  const mixins = useStyleMixins()
  const { t } = useTranslation()
  const { topics } = useContext(SpaceTermContext)

  useEffect(() => {
    /*
    We need to determine the right order when opening the layer:
    * currently selected items go to the top, alphabetically sorted by translation
    * currently unselected items go below, alphabetically sorted by translation
    This order is kept until the selection process is done and the layer is closed.
    */
    const unselectedTopics = topics && topics.filter((topic) => !selectedTopics.find((item) => item.id === topic.id))
    setOrderedTerms([...selectedTopics.sort(termsByTitleComparator), ...unselectedTopics.sort(termsByTitleComparator)])
  }, [topics, selectedTopics])

  useEffect(
    () =>
      setFilteredTopics(
        filterString === ''
          ? orderedTerms
          : orderedTerms.filter((topic: Topic) => topic.title.toLowerCase().includes(filterString.toLowerCase()))
      ),
    [orderedTerms, filterString]
  )

  const updateValues = (topic: Topic) => {
    if (selectedTopics.includes(topic)) {
      // remove the value
      onSelectSpaceTopics(selectedTopics.filter((selectedTopic) => selectedTopic !== topic))
    } else if (selectedTopics.length < 6) {
      // add the value
      onSelectSpaceTopics([...selectedTopics, topic])
    }
  }

  return (
    <View style={[mixins.container, styles.container, { minHeight: deviceHeight }]}>
      <HoliText size="extralarge" style={styles.title}>
        {t('spaces.create.space.stepTwo.title')}
      </HoliText>
      <HoliText style={styles.subTitle}>{t('spaces.create.space.stepTwo.subTitle')}</HoliText>
      <HoliTextInput
        accessibilityLabel={t('spaces.create.space.topic.search.placeholder')}
        value={filterString}
        placeholder={t('spaces.create.space.topic.search.placeholder')}
        onChange={(text: string) => setFilterString(text)}
        trailingIcon="search"
        style={styles.input}
      />
      <View style={styles.hintContainer}>
        <HoliIcon icon={'information'} size={14} color={colors.foreground30} style={styles.infoIcon} />
        <HoliText size="small" style={styles.hint}>
          {t('spaces.create.space.topic.search.hint')}
        </HoliText>
      </View>
      <View style={styles.topicsListContainer}>
        {filteredTopics &&
          filteredTopics.map((topic) => (
            <HoliChip
              key={topic.id}
              checked={selectedTopics.includes(topic)}
              onPress={() => updateValues(topic)}
              text={topic.title}
              label={topic.title}
              style={styles.chip}
            />
          ))}
      </View>
    </View>
  )
}

export default SpaceTopicsInput
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 132,
    ...Platform.select({
      native: {
        maxWidth: '100%',
      },
    }),
  },
  title: {
    marginTop: 40,
    width: '100%',
  },
  subTitle: {
    marginBottom: 50,
    marginTop: 16,
    width: '100%',
    color: colors.foreground20,
  },
  input: {
    marginBottom: 16,
  },
  hintContainer: {
    flexDirection: 'row',
  },
  infoIcon: { marginTop: 1 },
  hint: {
    marginLeft: 5,
  },
  chip: {
    marginRight: 8,
    marginBottom: 8,
  },
  topicsListContainer: {
    marginTop: 16,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    flexShrink: 1,
  },
  flatlistContainer: {
    paddingBottom: Platform.OS === 'web' ? 0 : 450,
  },
})

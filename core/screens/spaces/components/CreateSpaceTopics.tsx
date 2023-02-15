import React, { useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, Platform, StyleSheet, View, useWindowDimensions } from 'react-native'

import DefaultLayout from '@holi/core/DefaultLayout'
import { SpaceTermContext } from '@holi/core/screens/spaces/components/SpaceTermContextProvider'
import { Topic } from '@holi/core/screens/userprofile/types'
import { termsByTitleComparator } from '@holi/core/screens/userprofile/types'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliChip from '@holi/ui/components/molecules/HoliChip'
import HoliTextInput from '@holi/ui/components/molecules/HoliTextInput'
import useWizard from '@holi/ui/components/organisms/HoliWizard/useWizard'
import { colors } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

export type CreateSpaceTopicsProps = {
  onSelectSpaceTopics: (topics: Topic[]) => void
  selectedTopics: Topic[]
}

const CreateSpaceTopics: React.VFC<CreateSpaceTopicsProps> = ({
  onSelectSpaceTopics,
  selectedTopics,
}: CreateSpaceTopicsProps) => {
  const [filterString, setFilterString] = useState<string>('')
  const [orderedTerms, setOrderedTerms] = useState<Topic[]>([])
  const [filteredTopics, setFilteredTopics] = useState<Topic[]>([])
  const { height: deviceHeight, width: deviceWidth } = useWindowDimensions()
  const mixins = useStyleMixins()
  const { t } = useTranslation()
  const { topics } = useContext(SpaceTermContext)
  const { setNextButtonEnabled } = useWizard()

  useEffect(() => {
    setNextButtonEnabled(selectedTopics.length > 0)
  }, [selectedTopics, setNextButtonEnabled])

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

  const renderTopic = ({ item }: { item: Topic }) => {
    return (
      <HoliChip
        key={item.id}
        checked={selectedTopics.includes(item)}
        onPress={() => updateValues(item)}
        text={item.title}
        label={item.title}
        style={styles.chip}
      />
    )
  }

  return (
    <View style={styles.wrapper}>
      <DefaultLayout
        headerOverlap={true}
        scrollable={false}
        style={[styles.contentStyle, { width: Platform.OS === 'web' ? deviceWidth : '100%' }]}
      >
        <View style={[mixins.container, styles.container, { minHeight: deviceHeight }]}>
          <HoliText size="extralarge" style={styles.title}>
            {t('spaces.create.space.stepTwo.title')}
          </HoliText>
          <HoliText style={styles.subTitle}>{t('spaces.input.topics.description')}</HoliText>
          <HoliTextInput
            accessibilityLabel={t('spaces.input.topics.search')}
            value={filterString}
            placeholder={t('spaces.input.topics.search')}
            onChange={(text: string) => setFilterString(text)}
            trailingIcon="search"
            style={styles.input}
          />
          <View style={styles.hintContainer}>
            <HoliIcon icon={'information'} size={14} color={colors.foreground30} style={styles.infoIcon} />
            <HoliText size="small" style={styles.hint}>
              {t('spaces.input.topics.hint')}
            </HoliText>
          </View>
          <View style={styles.topicsListContainer}>
            {filteredTopics && (
              <FlatList
                data={filteredTopics}
                renderItem={renderTopic}
                numColumns={2}
                columnWrapperStyle={styles.flatlistColumnWrapper}
                contentContainerStyle={styles.flatlistContainer}
              />
            )}
          </View>
        </View>
      </DefaultLayout>
    </View>
  )
}

export default CreateSpaceTopics
const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    width: '100%',
    ...Platform.select({
      web: {
        minHeight: '100vh',
      },
    }),
    alignItems: 'center',
    display: 'flex',
    backgroundColor: colors.background10,
  },
  contentStyle: {
    flex: 1,
    backgroundColor: colors.background10,
    ...Platform.select({
      web: {
        minHeight: '100vh',
        paddingHorizontal: 24,
      },
    }),
  },
  container: {
    flex: 1,
    paddingBottom: 132,
    paddingHorizontal: 0,
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
  },
  flatlistColumnWrapper: { flexWrap: 'wrap' },
  flatlistContainer: {
    justifyContent: 'space-around',
    paddingBottom: Platform.OS === 'web' ? 0 : 450,
  },
})

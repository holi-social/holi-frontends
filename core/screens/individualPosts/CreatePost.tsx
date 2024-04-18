import { withProfiler } from '@sentry/react'
import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Dimensions, Platform, Pressable, StyleSheet, View } from 'react-native'

import FeatureToggleGuard from '@holi/core/components/FeatureToggleGuard'
import { FeatureToggleName, useFeatureToggle } from '@holi/core/helpers/useFeatureToggle'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import { Close } from '@holi/icons/src/generated'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliModal from '@holi/ui/components/molecules/HoliModal'
import HoliTextInput from '@holi/ui/components/molecules/HoliTextInput'
import { dimensions } from '@holi/ui/styles/globalVars'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

const CreatePost = () => {
  const { theme } = useTheme()
  const windowWidth = Dimensions.get('window').width
  const styles = useMemo(() => getStyles(theme, windowWidth), [theme, windowWidth])
  const { colors } = theme
  const { navigateBack, navigate } = useRouting()
  const [showModal, setShowModal] = useState(true)
  const { t } = useTranslation()
  const setScreenOptions = useSetScreenOptions()
  const { ftEnabled, ftLoading } = useFeatureToggle(FeatureToggleName.INDIVIDUALS_POST)
  const [, setSelectedCategory] = useState<string | null>(null)

  const Categories = [
    {
      name: t('individuals.post.category.name.topic'),
      image: require('@holi/ui/assets/img/posts/category-conversation-illustrations.svg'),
    },
    {
      name: t('individuals.post.category.name.experience'),
      image: require('@holi/ui/assets/img/posts/category-personal-illustrations.svg'),
    },
    {
      name: t('individuals.post.category.name.recommendation'),
      image: require('@holi/ui/assets/img/posts/category-recommendation-illustrations.svg'),
    },
    {
      name: t('individuals.post.category.name.awareness'),
      image: require('@holi/ui/assets/img/posts/category-awareness-illustrations.svg'),
    },
  ]

  useIsomorphicLayoutEffect(() => {
    setScreenOptions({
      headerTitle: () => (
        <HoliHeading level="1" size="s">
          {t('individuals.post.create.title')}
        </HoliHeading>
      ),
      headerTransparent: true,
      headerLeft: () => <HeaderBackButton icon={Close} onPress={() => navigateBack()} tintColor="black" />,
      navigationCustomOptions: {
        footerShown: false,
      },
    })
  }, [colors.background20, navigateBack, setScreenOptions, t])

  const modalPress = (category: string) => {
    setSelectedCategory(category)
    setShowModal(false)
  }

  if (!ftLoading && !ftEnabled) {
    navigate('/404')
  }

  return (
    <FeatureToggleGuard toggleName={FeatureToggleName.INDIVIDUALS_POST} featureNameKey="individual_posts" noLayout>
      <View style={styles.layout}>
        <View style={styles.inputContainer}>
          <HoliTextInput
            placeholder={t('individuals.post.create.category.input.title')}
            fontStyle={styles.titleFont}
            inputStyle={styles.textInput}
            placeholderColor={theme.colors.gray300}
            aria-label={t('individuals.post.create.category.input.title')}
          />
          <HoliTextInput
            placeholder={t('individuals.post.create.category.input.description')}
            noOfVisibleLines={15}
            maxNoOfVisibleLines={15}
            maxNoOfCharacters={800}
            placeholderColor={theme.colors.gray300}
            inputStyle={styles.textInput}
            style={styles.description}
            aria-label={t('individuals.post.create.category.input.description')}
          />
        </View>
        <HoliModal show={showModal} label={''} relativeHeight={1} autoHeight={false} style={styles.modal}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <HeaderBackButton
                icon={Close}
                onPress={() => navigateBack()}
                tintColor="black"
                style={styles.backButton}
              />
              <HoliHeading level="1" size="s">
                {t('individuals.post.create.title')}
              </HoliHeading>
            </View>
            <HoliText size="large" style={styles.modalTitle}>
              {t('individuals.post.create.category.title')}
            </HoliText>
            <View style={styles.categoryContainer}>
              {Categories.map((category) => (
                <React.Fragment key={category.name}>
                  <Pressable
                    style={({ hovered }) => [styles.category, hovered ? styles.categoryHovered : styles.category]}
                    onPress={() => modalPress(category.name)}
                  >
                    <View style={styles.categoryContent}>
                      <HoliLocalImage imageSource={category.image} width={40} height={40} isSvg label={''} />
                      <HoliText bold style={styles.text}>
                        {category.name}
                      </HoliText>
                    </View>
                  </Pressable>
                </React.Fragment>
              ))}
            </View>
          </View>
        </HoliModal>
      </View>
    </FeatureToggleGuard>
  )
}

export default withProfiler(CreatePost, { name: 'CreatePost' })

const getStyles = (theme: HoliTheme, windowWidth: number) =>
  StyleSheet.create({
    text: {
      fontSize: 16,
    },
    layout: {
      flex: 1,
      backgroundColor: theme.colors.background20,
      paddingTop: Platform.OS === 'web' ? dimensions.topBarHeight : dimensions.topBarHeight + 40,
      alignItems: 'center',
    },

    // modal styles
    category: {
      padding: 16,
      backgroundColor: theme.colors.background10,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.colors.gray200,
      height: 72,
    },
    categoryContainer: {
      display: windowWidth > dimensions.breakpointXl ? 'grid' : 'flex',
      gridTemplateColumns: windowWidth > dimensions.breakpointXl ? '1fr 1fr' : 'none',
      flexDirection: windowWidth > dimensions.breakpointXl ? 'row' : 'column',
      flexWrap: windowWidth > dimensions.breakpointXl ? 'wrap' : 'nowrap',
      justifyContent: 'space-between',
      gap: 12,
    },
    categoryHovered: {
      padding: 16,
      backgroundColor: theme.colors.background10,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.colors.black300,
      height: 72,
    },
    categoryContent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    modal: {
      backgroundColor: theme.colors.background20,
      paddingHorizontal: 16,
    },
    modalContent: {
      paddingTop: Platform.OS === 'web' ? 0 : 36,
      width: '100%',
      maxWidth: dimensions.maxScreenWidth,
      alignSelf: 'center',
    },
    modalTitle: {
      marginVertical: 24,
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginVertical: 16,
      backgroundColor: theme.colors.background20,
    },
    backButton: {
      position: 'absolute',
      left: 4,
    },

    // input styles
    textInput: {
      backgroundColor: theme.colors.background20,
      borderWidth: 0,
      paddingVertical: 8,
      maxWidth: '100%',
    },
    inputContainer: {
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingTop: 24,
      width: '100%',
    },
    description: {
      flex: 1,
    },
    titleFont: {
      fontSize: 21,
      color: theme.colors.black300,
    },
  })

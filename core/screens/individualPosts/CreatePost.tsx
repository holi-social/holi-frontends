import { withProfiler } from '@sentry/react'
import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Dimensions, InputAccessoryView, Platform, Pressable, StyleSheet, View } from 'react-native'

import FeatureToggleGuard from '@holi/core/components/FeatureToggleGuard'
import { FeatureToggleName, useFeatureToggle } from '@holi/core/helpers/useFeatureToggle'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import CreatePostPill, { FilterType } from '@holi/core/screens/individualPosts/components/CreatePostPill'
import { Close } from '@holi/icons/src/generated'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
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
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

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

  if (ftLoading) {
    return null
  }

  const pillData = [
    {
      filterType: 'visibility',
    },
    {
      label: selectedCategory,
      filterType: 'category',
    },
  ]

  const inputAccessoryViewID = 'uniqueID'

  const PostMenu = ({ onPress: onPress }: { onPress: () => void }) => {
    return (
      <View style={styles.menuContainer}>
        <View style={styles.items}>
          <View />
          {/* TODO: Add upload image functionality 
          <HoliButton transparent label={'Add Image'} inline onPress={() => uploadImage()}>
            <HoliIcon icon={ImageAdd} style={styles.addImageIcon} />
          </HoliButton> 
          */}
          <HoliButton label={'Post'} inline variant="small" onPress={onPress} style={styles.postButton}>
            <HoliText bold>Post</HoliText>
          </HoliButton>
        </View>
      </View>
    )
  }

  return (
    <FeatureToggleGuard toggleName={FeatureToggleName.INDIVIDUALS_POST} featureNameKey="individual_posts" noLayout>
      <View style={styles.layout}>
        <View style={styles.container}>
          <View style={styles.pillContainer}>
            {pillData.map((pill, index) => (
              <CreatePostPill
                key={index}
                label={pill.label}
                filterType={pill.filterType as FilterType}
                onPress={() => setShowModal(true)}
              />
            ))}
          </View>
          <View style={styles.inputContainer}>
            <HoliTextInput
              placeholder={t('individuals.post.create.category.input.title')}
              fontStyle={styles.titleFont}
              inputStyle={styles.textInput}
              placeholderColor={theme.colors.gray300}
              aria-label={t('individuals.post.create.category.input.title')}
              inputAccessoryViewID={inputAccessoryViewID}
            />
            <HoliTextInput
              placeholder={t('individuals.post.create.category.input.description')}
              noOfVisibleLines={15}
              maxNoOfVisibleLines={15}
              maxNoOfCharacters={5000}
              placeholderColor={theme.colors.gray300}
              inputStyle={styles.textInput}
              aria-label={t('individuals.post.create.category.input.description')}
              inputAccessoryViewID={inputAccessoryViewID}
            />
          </View>
        </View>
        {Platform.OS === 'ios' ? (
          <InputAccessoryView nativeID={inputAccessoryViewID} backgroundColor={theme.colors.background10}>
            <PostMenu onPress={() => alert('Boooom!')} />
          </InputAccessoryView>
        ) : (
          <PostMenu onPress={() => alert('Boooom!')} />
        )}
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
    // general styles
    text: {
      fontSize: 16,
    },
    layout: {
      backgroundColor: theme.colors.background20,
      paddingTop: Platform.OS === 'web' ? dimensions.topBarHeight : dimensions.topBarHeight + 40,
      alignItems: 'center',
      height: '100%',
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
      paddingTop: 0,
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
      paddingVertical: 4,
      maxWidth: '100%',
    },
    container: {
      justifyContent: 'center',
      alignItems: 'center',
      alignContent: 'center',
      paddingTop: 24,
      width: '100%',
      ...Platform.select({
        web: {
          maxWidth: dimensions.breakpointM,
        },
      }),
    },
    inputContainer: {
      width: '100%',
      paddingHorizontal: 6,
    },
    titleFont: {
      fontSize: 21,
      color: theme.colors.black300,
    },

    // pill styles
    pillContainer: {
      width: '100%',
      flexWrap: 'wrap',
      marginTop: 12,
      marginBottom: 24,
      flexDirection: 'row',
      zIndex: 1,
      gap: 8,
      paddingHorizontal: 16,
    },

    // menu styles
    menuContainer: {
      padding: 12,
      borderTopWidth: 1,
      borderTopColor: theme.colors.gray100,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      ...Platform.select({
        web: {
          position: 'absolute',
          bottom: 0,
          width: '100%',
        },
      }),
      backgroundColor: theme.colors.background10,
    },
    postButton: {
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 500,
      borderWidth: 1,
      backgroundColor: theme.colors.brandA200,
    },
    addImageIcon: {
      paddingLeft: 2,
    },
    items: {
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'space-between',
      alignItems: 'center',
      maxWidth: dimensions.breakpointM,
    },
  })

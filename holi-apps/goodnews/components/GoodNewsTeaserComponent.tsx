import React from 'react'
import { useTranslation } from 'react-i18next'
import { Animated, Platform, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliImage from '@holi/ui/components/atoms/HoliImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { colors } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

import { GoodNewsArticle } from '@holi-apps/goodnews/types'

type GoodNewsTeaserComponentProps = {
  article: GoodNewsArticle
  accessible?: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fetchMore: () => any
  style?: StyleProp<ViewStyle>
}

const GoodNewsTeaserComponent: React.VFC<GoodNewsTeaserComponentProps> = ({
  article,
  style,
  fetchMore,
  accessible = true,
}: GoodNewsTeaserComponentProps) => {
  const { t } = useTranslation()
  const mixins = useStyleMixins()

  const imageContainerAnimation = new Animated.Value(0)
  const imageContainerAnimationStyle = {
    transform: [
      {
        translateY: imageContainerAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -450],
        }),
      },
      {
        scale: imageContainerAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 1.5],
        }),
      },
    ],
  }

  const animateAndFetchMore = () => {
    Animated.timing(imageContainerAnimation, {
      toValue: 1,
      duration: 700,
      useNativeDriver: true,
    }).start(() => {
      fetchMore()
    })
  }

  return (
    <View
      style={[mixins.container, styles.container, style]}
      accessibilityElementsHidden={!accessible}
      importantForAccessibility={accessible ? 'yes' : 'no-hide-descendants'}
    >
      <View style={styles.lookingForMore}>
        <HoliHeading level="1">{t('goodnews:listing.teaser.title')}</HoliHeading>
        <HoliText size="large" style={styles.description}>
          {t('goodnews:listing.teaser.description')}
        </HoliText>
        <HoliButton
          label={t('goodnews:button.loadMoreArticles.label')}
          style={styles.loadMoreBtn}
          onPress={animateAndFetchMore}
        >
          <HoliText bold style={styles.btnText}>
            {t('goodnews:listing.loadMoreButton.text')}
          </HoliText>
        </HoliButton>
      </View>
      <Animated.View style={[styles.imageContainer, imageContainerAnimationStyle]}>
        <HoliImage source={{ uri: article.pictureUrl }} label={article.headline} style={styles.mainImage} />
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  btnText: {
    paddingVertical: 5,
  },
  container: {
    flex: 1,
  },
  loadMoreBtn: {
    width: 'auto',
    borderWidth: 1,
  },
  description: {
    paddingVertical: 16,
    textAlign: 'center',
  },
  lookingForMore: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 72,
  },
  imageContainer: {
    borderColor: colors.borderColorBlack,
    flex: 1,
    width: '100%',
    overflow: 'hidden',
    borderTopRightRadius: 28,
    borderTopLeftRadius: 28,
    borderWidth: 1,
    bottom: 0,
    ...Platform.select({
      web: {
        height: 400,
      },
    }),
  },
  mainImage: {
    height: '100%',
    width: '100%',
    bottom: 0,
    ...Platform.select({
      web: {
        height: 400,
      },
      // needed for mobile because of bug with borderRadius
      native: {
        borderColor: colors.borderColorBlack,
        borderTopRightRadius: 27,
        borderTopLeftRadius: 27,
      },
    }),
  },
})

export default GoodNewsTeaserComponent

import { Text } from 'holi-bricks/components/text/Text'
import React, { useMemo } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Animated, Platform, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import { HoliTextLink } from '@holi/core/navigation/components/HoliTextLink'
import HoliImage from '@holi/ui/components/atoms/HoliImage'
import { setScalingParams } from '@holi/ui/components/atoms/HoliImage/resizing'
import { useWindowDimensionsWithImageScaling } from '@holi/ui/components/atoms/HoliImage/useWindowDimensionsWithImageScaling'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

import { GOODNEWS_IMG_SOURCES_MAPPING } from '@holi-apps/goodnews/components/GoodNewsArticleComponent'
import { relativeArticleImageHeightScaling } from '@holi-apps/goodnews/imageConfig'
import { GoodNewsArticle } from '@holi-apps/goodnews/types'

type GoodNewsTeaserComponentProps = {
  article: GoodNewsArticle
  accessible?: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fetchMore: () => any
  style?: StyleProp<ViewStyle>
}

const GoodNewsTeaserComponent: React.FC<GoodNewsTeaserComponentProps> = ({
  article,
  style,
  fetchMore,
  accessible = true,
}: GoodNewsTeaserComponentProps) => {
  const { t } = useTranslation()
  const mixins = useStyleMixins()
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])

  const { imageWidth, imageHeight } = useWindowDimensionsWithImageScaling({
    relativeHeight: relativeArticleImageHeightScaling,
  })
  const { uri: scaledImageUri } = setScalingParams({ uri: article.pictureUrl, width: imageWidth, height: imageHeight })

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

  const wordmark = GOODNEWS_IMG_SOURCES_MAPPING['goodnews.eu'].wordmark

  return (
    <View
      style={[mixins.container, styles.container, style]}
      accessibilityElementsHidden={!accessible}
      importantForAccessibility={accessible ? 'yes' : 'no-hide-descendants'}
      testID="goodnews-teaser-container"
    >
      <View style={styles.lookingForMore}>
        {!!wordmark && !!wordmark.src && (
          <HoliLocalImage
            imageSource={wordmark.src}
            isSvg={wordmark.isSvg}
            label={''}
            width={107}
            height={16}
            resizeMode={'contain'}
          />
        )}
        <Text size="md">
          <Trans t={t} i18nKey={'goodnews:listing.teaser.description'}>
            <HoliTextLink
              label={t('goodnews:listing.teaser.textLink.url')}
              href={t('goodnews:listing.teaser.textLink.url')}
              external
            />
          </Trans>
        </Text>
        <HoliButton
          label={t('goodnews:button.loadMoreArticles.label')}
          style={styles.loadMoreBtn}
          onPress={animateAndFetchMore}
          testID="btn-goodnews-list-load-more"
        >
          <View style={styles.btnText}>
            <Text size="lg">{t('goodnews:listing.loadMoreButton.text')}</Text>
          </View>
        </HoliButton>
      </View>
      <Animated.View style={[styles.imageContainer, imageContainerAnimationStyle]}>
        <HoliImage
          source={{ uri: scaledImageUri }}
          label={article.headline}
          style={styles.mainImage}
          testID="goodnews-teaser-image"
        />
      </Animated.View>
    </View>
  )
}

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
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
    lookingForMore: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'flex-end',
      gap: 32,
      paddingBottom: 72,
    },
    textLink: {
      fontSize: undefined,
      fontWeight: '500',
    },
    imageContainer: {
      borderColor: theme.colors.foreground30,
      flex: 1,
      width: '100%',
      overflow: 'hidden',
      borderTopRightRadius: 28,
      borderTopLeftRadius: 28,
      borderWidth: 1,
      borderBottomWidth: 0,
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
        ios: {
          borderColor: theme.colors.foreground30,
          borderTopRightRadius: 27,
          borderTopLeftRadius: 27,
        },
      }),
    },
  })

export default GoodNewsTeaserComponent

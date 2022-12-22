import React from 'react'
//import { useTranslation } from 'react-i18next'
import { Animated, Platform, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import HoliImage from '@holi/ui/components/atoms/HoliImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { colors } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

import { GoodNewsArticle } from '@holi-apps/goodnews/types'

type GoodNewsTeaserComponentProps = {
  article: GoodNewsArticle
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fetchMore: () => any
  style?: StyleProp<ViewStyle>
}

const GoodNewsTeaserComponent: React.VFC<GoodNewsTeaserComponentProps> = (props: GoodNewsTeaserComponentProps) => {
  // const { t } = useTranslation()
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

  const fetch = () => {
    Animated.timing(imageContainerAnimation, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start()
    setTimeout(() => {
      props.fetchMore()
    }, 150)
  }

  return (
    <View style={[mixins.container, styles.container, props.style]}>
      <View style={styles.lookingForMore} testID="goodnews-list-container">
        <HoliText size="extralarge" style={styles.title}>
          Looking for more?
        </HoliText>
        <HoliText size="large" style={styles.description}>
          There´s more interesting articles in the previous edition
        </HoliText>
        <HoliButton label={''} style={styles.clearBtn} onPress={fetch}>
          <HoliText bold style={styles.btnText}>
            Continue reading
          </HoliText>
        </HoliButton>
      </View>
      <Animated.View style={[styles.imageContainer, imageContainerAnimationStyle]}>
        <HoliImage source={{ uri: props.article.pictureUrl }} label={''} style={styles.mainImage} />
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
  clearBtn: {
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
    paddingHorizontal: 16,
    paddingBottom: 72,
  },
  title: {
    paddingHorizontal: 16,
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
        borderTopRightRadius: 28,
        borderTopLeftRadius: 28,
      },
    }),
  },
})

export default GoodNewsTeaserComponent

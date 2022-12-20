import React from 'react'
//import { useTranslation } from 'react-i18next'
import { Platform, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import HoliImage from '@holi/ui/components/atoms/HoliImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { colors } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

import { GoodNewsArticle } from '@holi-apps/goodnews/types'

type GoodNewsArticleTeaserProps = {
  article?: GoodNewsArticle
  style?: StyleProp<ViewStyle>
}

const GoodNewsArticleTeaser: React.VFC<GoodNewsArticleTeaserProps> = () => {
  // const { t } = useTranslation()
  const mixins = useStyleMixins()

  return (
    <View style={[mixins.container, styles.container]}>
      <View style={styles.lookingForMore} testID="goodnews-list-container">
        <HoliText size="extralarge" style={styles.title}>
          Looking for more?
        </HoliText>
        <HoliText size="large" style={styles.description}>
          There´s more interesting arcticles in the prvious edition
        </HoliText>
        <HoliButton label={''} style={styles.clearBtn}>
          <HoliText>Continue reading</HoliText>
        </HoliButton>
      </View>
      <HoliImage source={require('@holi/ui/assets/img/illustrations/Image.png')} label={''} style={styles.mainImage} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 94,
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
    flexShrink: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 72,
  },
  title: {
    paddingHorizontal: 16,
  },
  mainImage: {
    borderColor: colors.borderColorBlack,
    flex: 1,
    flexGrow: 1,
    width: '100%',
    borderRadius: 28,
    borderWidth: 1,
    bottom: -20,
    ...Platform.select({
      web: {
        height: 400,
      },
    }),
  },
})

export default GoodNewsArticleTeaser

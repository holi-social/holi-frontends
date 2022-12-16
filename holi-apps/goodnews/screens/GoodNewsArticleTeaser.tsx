import React, { useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import { useUnifiedNavigation } from '@holi/core/navigation/hooks/useUnifiedNavigation'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliImage from '@holi/ui/components/atoms/HoliImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { HoliHorizontalRow } from '@holi/ui/components/molecules/HoliHorizontalRow'
import { colors, vars } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

import { GoodNewsArticle } from '@holi-apps/goodnews/types'

type GoodNewsArticleTeaserProps = {
  article: GoodNewsArticle
  style?: StyleProp<ViewStyle>
}

const GoodNewsArticleTeaser: React.VFC<GoodNewsArticleTeaserProps> = () => {
  const { t } = useTranslation()
  const title = t('goodnews:app.name')
  const mixins = useStyleMixins()

  const { setOptions, navigate } = useUnifiedNavigation()

  useLayoutEffect(() => {
    setOptions({
      headerTitle: () => (
        <HoliHeading level="1" size="small">
          {title}
        </HoliHeading>
      ),
      headerTransparent: true,
      headerStyle: { backgroundColor: colors.backgroundColorWhite },
      headerLeft: () => (Platform.OS === 'web' ? null : <HeaderBackButton icon="arrow-down-s" />),
      headerRight: ({ tintColor }) =>
        Platform.OS === 'web' ? (
          <HoliHorizontalRow>
            <HeaderBackButton icon="close" tintColor={tintColor} />
          </HoliHorizontalRow>
        ) : undefined,
    })
  }, [setOptions, navigate, t, title])

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
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 24,
    paddingTop: +vars.topBarHeight + (Platform.OS === 'android' ? 32 : 0),
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
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  title: {
    paddingHorizontal: 16,
  },
  mainImage: {
    position: 'absolute',
    borderRadius: 28,
    borderWidth: 1,
    flex: 1,
    bottom: -40,
    width: '100%',
  },
})

export default GoodNewsArticleTeaser

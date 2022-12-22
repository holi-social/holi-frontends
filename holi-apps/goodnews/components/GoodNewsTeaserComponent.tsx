import React from 'react'
//import { useTranslation } from 'react-i18next'
import { Platform, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

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

  return (
    <View style={[mixins.container, styles.container, props.style]}>
      <View style={styles.lookingForMore} testID="goodnews-list-container">
        <HoliText size="extralarge" style={styles.title}>
          Looking for more?
        </HoliText>
        <HoliText size="large" style={styles.description}>
          There´s more interesting articles in the previous edition
        </HoliText>
        <HoliButton label={''} style={styles.clearBtn} onPress={props.fetchMore}>
          <HoliText>Continue reading</HoliText>
        </HoliButton>
      </View>
      <HoliImage source={{ uri: props.article.pictureUrl }} label={''} style={styles.mainImage} />
    </View>
  )
}

const styles = StyleSheet.create({
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

export default GoodNewsTeaserComponent

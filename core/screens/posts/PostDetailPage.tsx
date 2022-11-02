import { useQuery } from '@apollo/client'
import { faker } from '@faker-js/faker'
import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View } from 'react-native'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import DefaultLayout from '@holi/core/DefaultLayout'
import { logError } from '@holi/core/errors/helpers'
import { userFullName } from '@holi/core/helpers'
import BackButton from '@holi/core/navigation/components/BackButton'
import useNavigationHeader from '@holi/core/navigation/hooks/useNavigationHeader'
import createParam from '@holi/core/navigation/hooks/useParam'
import { fakeInsights } from '@holi/core/screens/insights/fakeInsights'
import { LastInsightsResponse, lastInsightsQuery } from '@holi/core/screens/insights/queries'
import type { Insight } from '@holi/core/screens/insights/types'
import type { HomeStackScreens } from '@holi/mobile/navigation/RootNavigator'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import { colors } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

export type PostParams = {
  insightId: string
  postId: string
}

const { useParam } = createParam<PostParams>()

type ScreenProps = NativeStackScreenProps<HomeStackScreens>

const Post: React.VFC<ScreenProps> = ({ navigation }: ScreenProps) => {
  const [insightId] = useParam('insightId')
  const [postId] = useParam('postId')

  const { t } = useTranslation()
  const title = t('insights.post.title', { insightId, postId })
  const mixins = useStyleMixins()

  const { openToast } = useToast()

  useNavigationHeader(navigation, { title: title, headerLeft: () => <BackButton /> })

  const { loading, error, data } = useQuery<LastInsightsResponse>(lastInsightsQuery, {
    variables: { numberOfItems: 1 },
  })

  if (error) {
    logError(error, `[Post.tsx] ${error.message}`)
  }

  // Error and loading states are handled the same way and just hide the component
  if (loading || error) {
    return <></>
  }
  const insights: Insight[] = data?.lastInsights?.length ? data.lastInsights : fakeInsights
  const insight = insights.find((insight) => insight.id == insightId)
  if (!insight) return <HoliText>{t('insights.insight.notFound', { insightId })}</HoliText>

  // TODO: dummy category
  const category = 'Immigration'

  const author = {
    ...insight.curator,
    fullName: userFullName(insight.curator),
    avatar: faker.image.avatar(), // TODO: dummy image
  }

  // const post = fakePosts[0]

  return (
    <>
      <StatusBar animated />
      <DefaultLayout>
        {/* Post content */}
        <View style={[mixins.container, styles.postView]}>
          {/* Post title */}
          <View>
            <HoliHeading level="1" size="medium">
              {title}
            </HoliHeading>
            <HoliButton transparent inline label={t('insights.post.preview.options')} style={styles.optionsButton}>
              <HoliIcon icon="options" size={12} color={colors.fontColorGrey} />
            </HoliButton>
          </View>

          {/* Post creator */}

          <HoliText style={{ paddingTop: 10 }}>
            <Trans i18nKey="insights.post.author" values={{ author: author.fullName, category: category }} />
          </HoliText>
          <HoliText style={{ paddingTop: 10 }}>{insight.title}</HoliText>
          <HoliButton label="click me" onPress={() => openToast('Comment created', HoliToastType.SUCCESS)}>
            Show toast
          </HoliButton>
        </View>
      </DefaultLayout>
    </>
  )
}

const styles = StyleSheet.create({
  postView: {
    backgroundColor: colors.backgroundColorWhite,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    paddingTop: 12,
    paddingBottom: 24,
    ...Platform.select({ web: { paddingHorizontal: 20 } }),
  },
  optionsButton: {
    alignSelf: 'flex-start',
    justifyContent: 'flex-end',
  },
})

export default Post

import { useQuery } from '@apollo/client'
import { faker } from '@faker-js/faker'
import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View } from 'react-native'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import DefaultLayout from '@holi/core/DefaultLayout'
import { logError } from '@holi/core/errors/helpers'
import { userFullName } from '@holi/core/helpers'
import BackButton from '@holi/core/navigation/components/BackButton'
import useNavigationHeader from '@holi/core/navigation/hooks/useNavigationHeader'
import createParam from '@holi/core/navigation/hooks/useParam'
import CommentConnector from '@holi/core/screens/comments/CommentConnector'
import CommentView from '@holi/core/screens/comments/CommentView'
import { fakeInsights, fakePosts } from '@holi/core/screens/insights/fakeInsights'
import { LastInsightsResponse, lastInsightsQuery } from '@holi/core/screens/insights/queries'
import type { Insight } from '@holi/core/screens/insights/types'
import type { HomeStackScreens } from '@holi/mobile/navigation/RootNavigator'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliMediaHeader from '@holi/ui/components/molecules/HoliMediaHeader'
import HoliUserAvatarPile from '@holi/ui/components/organisms/HoliUserAvatarPile'
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

  const author = {
    ...insight.curator,
    fullName: userFullName(insight.curator),
    name: userFullName(insight.curator),
    avatar: faker.image.avatar(), // TODO: dummy image
  }

  const post = fakePosts[0]

  const comments = post.comments || []

  const commenters = comments?.map((comment) => comment.creator) || []

  return (
    <>
      <StatusBar animated />
      <DefaultLayout>
        {/* Post content */}
        <View style={[mixins.container, styles.postView]}>
          {/* Post title */}
          <View style={styles.header}>
            <HoliHeading level="1" size="medium">
              {title}
            </HoliHeading>
            <HoliButton transparent inline label={t('insights.post.preview.more')} style={styles.moreButton}>
              <HoliIcon icon="more" color={colors.fontColorGrey} />
            </HoliButton>
          </View>

          {/* Post creator */}
          <HoliMediaHeader
            title={author.fullName}
            author={author}
            date={post.created}
            boldTitle
            style={styles.mediaHeader}
          />

          <HoliText style={styles.body}>{post.text}</HoliText>
        </View>

        {/* Post comments */}
        {comments.length > 0 && (
          <View style={[mixins.container, styles.commentsView]}>
            <HoliUserAvatarPile users={commenters} usersToShow={3} collapse>
              {t('insights.post.response', { count: comments.length })}
            </HoliUserAvatarPile>

            <CommentConnector style={styles.commentConnector} />

            {comments.map((comment) => (
              <CommentView key={comment.id} comment={comment} style={styles.comment} />
            ))}
          </View>
        )}
      </DefaultLayout>
    </>
  )
}

const styles = StyleSheet.create({
  postView: {
    paddingTop: 12,
    ...Platform.select({ web: { paddingHorizontal: 20 } }),
  },
  moreButton: {
    alignSelf: 'flex-start',
    justifyContent: 'flex-end',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  mediaHeader: {
    marginTop: 20,
  },
  body: {
    marginTop: 16,
    lineHeight: 22,
  },
  commentsView: {
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  commentConnector: {
    marginTop: 12,
    marginHorizontal: 20,
  },
  comment: {
    marginTop: 12,
  },
})

export default Post

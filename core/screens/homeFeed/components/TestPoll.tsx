import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import useDeletePost from '@holi/core/hooks/useDeletePost'
import useReportContent from '@holi/core/hooks/useReportContent'
import { HoliLink } from '@holi/core/navigation/components/HoliLink'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useLoginModal } from '@holi/core/providers/LoginModalProvider'
import { ContentType } from '@holi/core/queries'
import AnswerOption from '@holi/core/screens/homeFeed/components/AnswerOption'
import InspirationPostMediaHeader from '@holi/core/screens/posts/components/InspirationPostMediaHeader'
import PostImage from '@holi/core/screens/posts/components/PostImage'
import PostReactions from '@holi/core/screens/posts/components/PostReactions'
import { getPostUrl } from '@holi/core/screens/posts/components/helpers'
import { Link, Post } from '@holi/core/screens/posts/types'
import { User } from '@holi/core/screens/userprofile/types'
import { useLoggedInUser } from '@holi/core/screens/userprofile/useLoggedInUser'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Delete, Edit2, Flag, GlobalFilled, LockFilled, UserTeamFilled } from '@holi/icons/src/generated'
import HandWaveFilledPng from '@holi/ui/assets/img/icons/hand-wave-filled.png'
import HandWaveFilled from '@holi/ui/assets/img/icons/hand-wave-filled.svg'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import HoliColumn from '@holi/ui/components/atoms/HoliColumn'
import HoliColumns from '@holi/ui/components/atoms/HoliColumns'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliMediaHeader from '@holi/ui/components/molecules/HoliMediaHeader'
import HoliReadMore from '@holi/ui/components/molecules/HoliReadMore'
import HoliActionDrawer from '@holi/ui/components/organisms/HoliActionDrawer'
import HoliLinkPreview from '@holi/ui/components/organisms/HoliLinkPreview'
import HoliRichTextOutput from '@holi/ui/components/organisms/HoliRichTextOutput'
import HoliUserAvatarPile from '@holi/ui/components/organisms/HoliUserAvatarPile'
import { colors } from '@holi/ui/styles/globalVars'

interface BaseProps {
  style?: StyleProp<ViewStyle>
}

interface SkeletonProps extends BaseProps {
  loading: true
  post?: Post
  insightId?: string
  spaceIdOrName?: string
  hasVisibilityIcon?: boolean
}
interface Props extends BaseProps {
  loading?: false
  post: Post
  insightId?: string
  spaceIdOrName?: string
  hasVisibilityIcon?: boolean
  numberOfLines?: number
  answered?: boolean
}
// interface PollOptionData {
//   text?: string
//   percentage?: number
//   answered?: boolean
// }
export type PollPreviewProps = SkeletonProps | Props

const pollQuestion = 'Wie geht es Ihnen?'
// const pollOptions: PollOptionData[] = [
//   { text: 'Super', percentage: 10 },
//   { text: 'Fantastisch', percentage: 30 },
// ]
const rows = []
// for (let i = 0; i < pollOptions.length; i++) {
//   // note: we are adding a key prop here to allow react to uniquely identify each
//   // element in this array. see: https://reactjs.org/docs/lists-and-keys.html
//   rows.push(<AnswerOption text="text" />)
// }

const PollOptions = ({ answered }) => {
  if (!answered) {
    return (
      <View>
        <AnswerOption text="Option 1" />
        <AnswerOption text="Option 2" />
        <AnswerOption text="Option 3" />
      </View>
    )
  } else {
    return <View></View> // todo
  }
}

const PollPreview = ({
  hasVisibilityIcon,
  insightId,
  post,
  spaceIdOrName,
  numberOfLines = 10,
  loading,
  answered,
}: PollPreviewProps) => {
  const { t } = useTranslation()
  const commenters = post?.commenters.data
  const { isLoggedIn, user: loggedInUser } = useLoggedInUser()
  const { openLoginModal } = useLoginModal()
  const { navigate } = useRouting()
  const [isLoadingReport, reportContent] = useReportContent({
    id: post?.id || '',
    contentType: ContentType.POST,
    successMsg: t('global.report.successMessage'),
  })

  const { deletePost, isLoadingPostDeletion } = useDeletePost(post || ({} as Post), spaceIdOrName)

  const visibilityIcon = post?.isPublic ? GlobalFilled : LockFilled
  const visibilityIconText = post?.isPublic ? t('spaces.updates.filter.public') : t('spaces.updates.filter.members')

  const postUrl = getPostUrl(post?.id, insightId, spaceIdOrName)
  const commentUrl = postUrl + '/comment'

  const editAction = useCallback(() => {
    navigate(postUrl + '/edit')
  }, [navigate, postUrl])

  const isCurrentUserPostCreator = post?.creator.id === loggedInUser?.id

  const onPressCommentLink = () => {
    if (!isLoggedIn) {
      openLoginModal({
        description: t('insights.posts.comments.loginRedirect.text'),
      })
      // return false prevents link execution
      return false
    }
  }

  if (loading) {
    return (
      <View style={styles.container}>
        {/* Post Author */}
        <HoliColumns>
          <HoliColumn flex={2}>
            <HoliMediaHeader title={post?.creator?.fullName} date={post?.created} boldTitle loading />
          </HoliColumn>
        </HoliColumns>

        {/* Post Title */}
        <View style={styles.postTitleLink}>
          <HoliHeading level="3" size="s" loading>
            {post?.title}
          </HoliHeading>
        </View>

        {/* Post Text */}
        <HoliText
          text={post?.text}
          users={post?.mentions}
          links={post?.links}
          loading
          skeletonOptions={{ numberOfLines: numberOfLines, borderRadius: 16 }}
        >
          {post?.text}
        </HoliText>

        {/* Reaction bar with comments and likes */}
        <View style={styles.reactionsBar}>
          <View style={styles.reactionsLink}>
            <HoliUserAvatarPile users={commenters || []} usersToShow={3} collapse loading>
              {t('insights.post.response', { count: post?.numberOfComments })}
            </HoliUserAvatarPile>
          </View>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {/* Visibility for space update posts */}
      {hasVisibilityIcon ? (
        <HoliColumns alignItems="center" padding={[0, 0, 16, 0]}>
          <HoliIcon icon={visibilityIcon} size={14} />
          <HoliBox padding={[0, 0, 0, 6]}>
            <HoliText size="extrasmall">{visibilityIconText}</HoliText>
          </HoliBox>
        </HoliColumns>
      ) : null}
      {/* Author row with author, post date and three dot menu */}
      {/* As of v1.10.0: We don't show the author row when it is a daily inspiration post */}
      {/* Inspiration posts media header */}
      <InspirationPostMediaHeader post={post} />
      <View style={styles.postTitleLink}>
        <HoliLink href={getPostUrl(post?.id, insightId, spaceIdOrName)} label={post?.title || ''} testID="btn-to-post">
          <HoliHeading level="3" size="s">
            {pollQuestion}
          </HoliHeading>
        </HoliLink>
      </View>

      <PollOptions answered={answered} />

      <HoliBox padding={[8, 0, 8, 0]} layout={styles.headlineContainer}>
        <HoliIcon icon={UserTeamFilled} size={14} style={styles.icon} />
        <HoliRichTextOutput
          text={'32 Anonyme Stimmen'}
          users={[]}
          links={[]}
          allowAllLinks
          size="default"
          color="gray300"
        />
      </HoliBox>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderWidth: 1,
    borderColor: colors.background30,
    borderRadius: 12,
    backgroundColor: colors.background10,
  },
  postTitleLink: {
    marginBottom: 4,
  },
  imageContainer: {
    width: '100%',
  },
  linkPreview: {
    paddingTop: 16,
    maxWidth: 420,
    width: '100%',
    alignSelf: 'center',
  },
  reactionsBar: {
    paddingTop: 21,
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  reactionsLink: {
    height: 'auto',
    display: 'flex',
  },
  noCommentsYetMessage: {
    paddingRight: 24,
    flex: 1,
    marginTop: Platform.OS === 'web' ? 0 : 4,
  },
  headlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 7,
  },
})

export default PollPreview

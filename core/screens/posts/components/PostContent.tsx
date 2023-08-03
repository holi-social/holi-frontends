import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import useReportContent from '@holi/core/hooks/useReportContent'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { ContentType } from '@holi/core/queries'
import PostImage from '@holi/core/screens/posts/components/PostImage'
import PostReactions from '@holi/core/screens/posts/components/PostReactions'
import { getPostUrl } from '@holi/core/screens/posts/components/helpers'
import { Post } from '@holi/core/screens/posts/types'
import { useLoggedInUser } from '@holi/core/screens/userprofile/useLoggedInUser'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Edit2, Flag, GlobalFilled, LockFilled } from '@holi/icons/src/generated'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import HoliColumn from '@holi/ui/components/atoms/HoliColumn'
import HoliColumns from '@holi/ui/components/atoms/HoliColumns'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliLink from '@holi/ui/components/atoms/HoliLink'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliMediaHeader from '@holi/ui/components/molecules/HoliMediaHeader'
import HoliActionDrawer from '@holi/ui/components/organisms/HoliActionDrawer'
import HoliLinkPreview from '@holi/ui/components/organisms/HoliLinkPreview'
import HoliRichTextOutput from '@holi/ui/components/organisms/HoliRichTextOutput'
import HoliUserAvatarPile from '@holi/ui/components/organisms/HoliUserAvatarPile'
import { colors } from '@holi/ui/styles/globalVars'

export type PostContentProps = {
  post: Post
  style?: StyleProp<ViewStyle>
  hasVisibilityIcon?: boolean
  insightId?: string
  spaceIdOrName?: string
}

const PostContent = ({ hasVisibilityIcon, post, style, insightId, spaceIdOrName }: PostContentProps) => {
  const { t } = useTranslation()
  const commenters = post.commenters.data
  const { navigate } = useRouting()
  const { user } = useLoggedInUser()

  const editAction = useCallback(() => {
    navigate(`${getPostUrl(post.id, insightId, spaceIdOrName)}/edit`)
  }, [insightId, navigate, post.id, spaceIdOrName])

  const [isLoadingReport, reportContent] = useReportContent({
    id: post.id,
    contentType: ContentType.POST,
    successMsg: t('global.report.successMessage'),
  })

  const visibilityIcon = post.isPublic ? GlobalFilled : LockFilled
  const visibilityIconText = post.isPublic ? t('spaces.updates.filter.public') : t('spaces.updates.filter.members')
  const isCurrentUserPostCreator = post.creator.id === user?.id

  return (
    <View style={[styles.wrapper, style]} testID="post-content-container">
      <View style={styles.paddingHorizontal}>
        <View style={styles.headerContainer}>
          <HoliColumns>
            <HoliColumn flex={2}>
              {hasVisibilityIcon ? (
                <HoliColumns alignItems="center" padding={[0, 0, 8, 0]}>
                  <HoliIcon icon={visibilityIcon} size={12} />
                  <HoliBox padding={[0, 0, 0, 6]}>
                    <HoliText size="extrasmall">{visibilityIconText}</HoliText>
                  </HoliBox>
                </HoliColumns>
              ) : null}

              <HoliHeading level="1" size="medium" style={styles.header}>
                {post.title}
              </HoliHeading>
            </HoliColumn>

            <HoliColumn>
              <SafeAreaProvider>
                <HoliActionDrawer.Drawer label={t('insights.post.preview.more')} testID="post-three-dot-menu-button">
                  {spaceIdOrName && isCurrentUserPostCreator && (
                    <HoliActionDrawer.Action
                      icon={Edit2}
                      title={t('spaces.updates.edit')}
                      testID="edit-update"
                      handleAction={editAction}
                    />
                  )}
                  {!isCurrentUserPostCreator && (
                    <HoliActionDrawer.Action
                      isLoading={isLoadingReport}
                      icon={Flag}
                      title={t('global.report')}
                      testID="report-comment-button"
                      showConfirmation
                    >
                      <HoliActionDrawer.Confirmation
                        title={t('insights.post.report.confirmation.title')}
                        description={t('insights.post.report.confirmation.description')}
                        handleConfirmation={reportContent}
                        hasDismissBtn
                        requireLogin
                      />
                    </HoliActionDrawer.Action>
                  )}
                </HoliActionDrawer.Drawer>
              </SafeAreaProvider>
            </HoliColumn>
          </HoliColumns>
        </View>

        <HoliLink
          href={`/profile/${post.creator.id}`}
          label={post.creator.fullName}
          testID="btn-to-post-creator-profile"
        >
          <HoliMediaHeader title={post.creator.fullName} author={post.creator} date={post.created} />
        </HoliLink>

        <HoliRichTextOutput text={post.text} users={post.mentions} links={post.links} style={styles.description} />
      </View>

      {post.image && (
        <PostImage
          uri={post.image.url}
          imageBlurhash={post.image.imageBlurhash}
          height={post.image.height}
          width={post.image.width}
          postTitle={post.title}
        />
      )}

      {!!post.links?.length && (
        <View style={styles.paddingHorizontal}>
          <HoliLinkPreview style={styles.linkPreview} previewData={post.links[0]} label={post.links[0].title} />
        </View>
      )}

      <View style={[styles.reactionsBar]}>
        {post.numberOfComments > 0 && (
          <HoliUserAvatarPile users={commenters} usersToShow={3} collapse>
            {t('insights.post.response', { count: post.numberOfComments })}
          </HoliUserAvatarPile>
        )}

        <PostReactions post={post} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.background10,
  },
  paddingHorizontal: {
    paddingHorizontal: 24,
  },
  headerContainer: {
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  header: {
    flexGrow: 1,
    flexShrink: 1,
  },
  description: {
    marginTop: 16,
  },
  linkPreview: {
    marginTop: 16,
    maxWidth: 320,
  },
  reactionsBar: {
    marginTop: 21,
    paddingLeft: 24,
    paddingRight: 20,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  reactionsLink: {
    height: 'auto',
    display: 'flex',
  },
})

export default PostContent

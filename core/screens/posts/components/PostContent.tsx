import React, { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import useReportContent from '@holi/core/hooks/useReportContent'
import { HoliLink } from '@holi/core/navigation/components/HoliLink'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { ContentType } from '@holi/core/queries'
import InspirationPostMediaHeader from '@holi/core/screens/posts/components/InspirationPostMediaHeader'
import PostImage from '@holi/core/screens/posts/components/PostImage'
import PostReactions from '@holi/core/screens/posts/components/PostReactions'
import { getPostUrl } from '@holi/core/screens/posts/components/helpers'
import { Post } from '@holi/core/screens/posts/types'
import { User } from '@holi/core/screens/userprofile/types'
import { useLoggedInUser } from '@holi/core/screens/userprofile/useLoggedInUser'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Edit2, Flag, GlobalFilled, LockFilled } from '@holi/icons/src/generated'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import HoliColumn from '@holi/ui/components/atoms/HoliColumn'
import HoliColumns from '@holi/ui/components/atoms/HoliColumns'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliMediaHeader from '@holi/ui/components/molecules/HoliMediaHeader'
import HoliActionDrawer from '@holi/ui/components/organisms/HoliActionDrawer'
import HoliLinkPreview from '@holi/ui/components/organisms/HoliLinkPreview'
import HoliRichTextOutput from '@holi/ui/components/organisms/HoliRichTextOutput'
import HoliUserAvatarPile from '@holi/ui/components/organisms/HoliUserAvatarPile'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

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
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])

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
  const isDailyInspirationPost = !!post?.inspirationPostCategory?.title

  return (
    <View style={[styles.wrapper, style]} testID="post-content-container">
      <View style={styles.paddingHorizontal}>
        {/* As of v1.10.0: We don't show the header row when it is a daily inspiration post */}
        {!isDailyInspirationPost && (
          <>
            <View style={styles.headerContainer}>
              <HoliColumns>
                <HoliColumn flex={2}>
                  {/* Visibility for space update posts */}
                  {hasVisibilityIcon ? (
                    <HoliColumns alignItems="center" padding={[0, 0, 8, 0]}>
                      <HoliIcon icon={visibilityIcon} size={12} />
                      <HoliBox padding={[0, 0, 0, 6]}>
                        <HoliText size="extrasmall">{visibilityIconText}</HoliText>
                      </HoliBox>
                    </HoliColumns>
                  ) : null}

                  {/* Post title */}
                  <HoliHeading level="1" size="m" testID="post-heading">
                    {post.title}
                  </HoliHeading>
                </HoliColumn>

                {/* Action drawer (three dot menu) */}
                <HoliColumn>
                  <SafeAreaProvider>
                    <HoliActionDrawer.Drawer
                      label={t('insights.post.preview.more')}
                      testID="post-three-dot-menu-button"
                    >
                      {/* Edit Action */}
                      {/* editing only allowed for own content */}
                      {spaceIdOrName && isCurrentUserPostCreator && (
                        <HoliActionDrawer.Action
                          icon={Edit2}
                          title={t('spaces.updates.edit')}
                          testID="edit-update"
                          handleAction={editAction}
                        />
                      )}
                      {/* Report Action */}
                      {/* reporting own content makes no sense, so we hide this option */}
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
          </>
        )}

        <InspirationPostMediaHeader post={post} />

        {/* Post content */}
        <HoliRichTextOutput
          text={post.text}
          users={post?.mentions || []}
          links={post?.links || []}
          style={styles.description}
          allowAllLinks
        />
      </View>

      {/* Post image */}
      {post.image && (
        <PostImage
          uri={post.image.url}
          imageBlurhash={post.image.imageBlurhash}
          height={post.image.height}
          width={post.image.width}
          postTitle={post.title}
        />
      )}

      {/* Post link previews */}
      {!!post.links?.length &&
        post.links.map((link, index) => {
          return (
            <View style={styles.paddingHorizontal} key={index}>
              <HoliLinkPreview style={styles.linkPreview} previewData={link} label={link.title} />
            </View>
          )
        })}

      {/* Reaction bar with comments and likes */}
      <View style={[styles.reactionsBar]}>
        {/* Comments */}
        {post.numberOfComments > 0 && (
          <HoliUserAvatarPile users={commenters as User[]} usersToShow={3} collapse>
            {t('insights.post.response', { count: post.numberOfComments })}
          </HoliUserAvatarPile>
        )}

        <PostReactions post={post} />
      </View>
    </View>
  )
}

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    wrapper: {
      backgroundColor: theme.colors.background10,
    },
    paddingHorizontal: {
      paddingHorizontal: 24,
    },
    headerContainer: {
      justifyContent: 'space-between',
      marginBottom: 20,
    },
    description: {
      marginTop: 16,
    },
    linkPreview: {
      marginTop: 16,
      maxWidth: 420,
      width: '100%',
      alignSelf: 'center',
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
    inspirationMediaHeader: {
      gap: 16,
    },
    inspirationHeadingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    fallbackImage: {
      width: 32,
      height: 32,
    },
    inspirationHeading: {
      fontWeight: 'normal',
    },

    inspirationDate: {
      paddingBottom: 8,
      color: theme.colors.foreground20,
    },
  })

export default PostContent

import React, { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { type StyleProp, StyleSheet, View, type ViewStyle } from 'react-native'

import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import HoliMediaAuthorHeader from '@holi/core/components/HoliMediaAuthorHeader'
import HoliTranslate from '@holi/core/components/HoliTranslate'
import type { User } from '@holi/core/domain/shared/types'
import { HoliLink } from '@holi/core/navigation/components/HoliLink'
import useAuthRequiredNavigation from '@holi/core/navigation/hooks/useAuthRequiredNavigation'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { ContentType, ContentType3K } from '@holi/core/queries'
import PostImage from '@holi/core/screens/posts/components/PostImage'
import PostReactions from '@holi/core/screens/posts/components/PostReactions'
import { getPostUrl } from '@holi/core/screens/posts/components/helpers'
import type { Post } from '@holi/core/screens/posts/types'
import { TrackingEvent } from '@holi/core/tracking'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Edit2, Flag, GlobalFilled, LockFilled } from '@holi/icons/src/generated'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import HoliColumn from '@holi/ui/components/atoms/HoliColumn'
import HoliColumns from '@holi/ui/components/atoms/HoliColumns'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliActionDrawer from '@holi/ui/components/organisms/HoliActionDrawer'
import HoliLinkPreview from '@holi/ui/components/organisms/HoliLinkPreview'
import HoliRichTextOutput from '@holi/ui/components/organisms/HoliRichTextOutput'
import HoliUserAvatarPile from '@holi/ui/components/organisms/HoliUserAvatarPile'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'

export type PostContentProps = {
  post: Post
  style?: StyleProp<ViewStyle>
  hasVisibilityIcon?: boolean
  insightId?: string
  spaceIdOrName?: string
}

const PostContent = ({ hasVisibilityIcon, post, style, insightId, spaceIdOrName }: PostContentProps) => {
  const [loadingTranslation, setLoadingTranslation] = useState(false)
  const { t, i18n } = useTranslation()
  const commenters = post.commenters.data
  const { navigate } = useRouting()
  const { navigateWithAuth } = useAuthRequiredNavigation()
  const { user } = useLoggedInUser()
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme, post.numberOfComments), [theme, post.numberOfComments])
  const [text, setText] = useState(post.text)
  const [title, setTitle] = useState(post.title)

  const editAction = useCallback(() => {
    navigate(`${getPostUrl(post.id, insightId, spaceIdOrName)}/edit`)
  }, [insightId, navigate, post.id, spaceIdOrName])

  const visibilityIcon = post.isPublic ? GlobalFilled : LockFilled
  const visibilityIconText = post.isPublic ? t('spaces.updates.filter.public') : t('spaces.updates.filter.members')
  const isCurrentUserPostCreator = post.creator.id === user?.id
  const isTranslatable = post.language && post.language !== i18n.language

  return (
    <View style={[styles.wrapper, style]} testID="post-content-container">
      <View>
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
                <HoliHeading
                  level="1"
                  size="m"
                  testID="post-heading"
                  loading={loadingTranslation}
                  skeletonOptions={{ numberOfLines: 1 }}
                >
                  {title}
                </HoliHeading>
              </HoliColumn>

              {/* Action drawer (three dot menu) */}
              <HoliColumn>
                <HoliActionDrawer.Drawer label={t('insights.post.preview.more')} testID="post-three-dot-menu-button">
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
                      icon={Flag}
                      title={t('global.report')}
                      testID="report-comment-button"
                      handleAction={() =>
                        navigateWithAuth(`/report/${post?.id}/${ContentType.POST}/${ContentType3K.POST}`)
                      }
                    />
                  )}
                </HoliActionDrawer.Drawer>
              </HoliColumn>
            </HoliColumns>
          </View>
          <HoliLink
            href={`/profile/${post.creator.id}`}
            label={post.creator.fullName}
            testID="btn-to-post-creator-profile"
          >
            <HoliMediaAuthorHeader author={post.creator} date={post.created} role={post.creator.role} />
          </HoliLink>
        </>

        {/* Post content */}
        <HoliRichTextOutput
          text={text}
          users={post?.mentions || []}
          links={post?.links || []}
          style={styles.description}
          allowAllLinks
          loading={loadingTranslation}
          skeletonOptions={{ numberOfLines: 3 }}
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
          return <HoliLinkPreview key={index} style={styles.linkPreview} previewData={link} label={link.title} />
        })}

      {isTranslatable && (
        <HoliTranslate
          primaryText={{ text, setText }}
          secondaryText={{ text: title, setText: setTitle }}
          loading={loadingTranslation}
          setLoading={setLoadingTranslation}
          trackingEvent={TrackingEvent.ContentTranslated('feed_post', post.id)}
        />
      )}

      {/* Reaction bar with comments and likes */}
      <View style={styles.reactionsBar}>
        {/* Comments */}
        {post.numberOfComments > 0 && (
          <HoliUserAvatarPile users={commenters as User[]} usersToShow={3} collapse>
            {t('comments.response', { count: post.numberOfComments })}
          </HoliUserAvatarPile>
        )}

        <PostReactions post={post} />
      </View>
    </View>
  )
}

const getStyles = (theme: HoliTheme, numberOfComments: number) =>
  StyleSheet.create({
    wrapper: {
      backgroundColor: theme.colors.background10,
    },
    headerContainer: {
      justifyContent: 'space-between',
      marginBottom: 20,
    },
    description: {
      marginTop: 16,
      width: '100%',
    },
    linkPreview: {
      marginTop: 16,
      maxWidth: 420,
      width: '100%',
      alignSelf: 'center',
    },
    reactionsBar: {
      marginTop: 21,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: numberOfComments > 0 ? 'space-between' : 'flex-end',
    },
    reactionsLink: {
      height: 'auto',
      display: 'flex',
    },
    fallbackImage: {
      width: 32,
      height: 32,
    },
  })

export default PostContent

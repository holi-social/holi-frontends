import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import MoreOptionsButtonWithModal from '@holi/core/components/MoreOptionsButtonWithModal'
import ReportBlockOptionButton from '@holi/core/components/ReportBlockOptionButton'
import { ContentType } from '@holi/core/queries'
import PostImage from '@holi/core/screens/posts/components/PostImage'
import PostReactions from '@holi/core/screens/posts/components/PostReactions'
import { Post } from '@holi/core/screens/posts/types'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import HoliColumn from '@holi/ui/components/atoms/HoliColumn'
import HoliColumns from '@holi/ui/components/atoms/HoliColumns'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliLink from '@holi/ui/components/atoms/HoliLink'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliMediaHeader from '@holi/ui/components/molecules/HoliMediaHeader'
import { useModalState } from '@holi/ui/components/molecules/HoliModal'
import HoliLinkPreview from '@holi/ui/components/organisms/HoliLinkPreview'
import HoliRichTextOutput from '@holi/ui/components/organisms/HoliRichTextOutput'
import HoliUserAvatarPile from '@holi/ui/components/organisms/HoliUserAvatarPile'
import { colors } from '@holi/ui/styles/globalVars'

export type PostContentProps = {
  post: Post
  style?: StyleProp<ViewStyle>
  hasVisibilityIcon?: boolean
}

const PostContent = ({ hasVisibilityIcon, post, style }: PostContentProps) => {
  const { t } = useTranslation()
  const commenters = post.commenters.data
  const { visible, show, hide } = useModalState()

  const visibilityIcon = post.isPublic ? 'global' : 'lock'
  const visibilityIconText = post.isPublic ? t('spaces.updates.filter.public') : t('spaces.updates.filter.members')

  return (
    <View style={[styles.wrapper, style]}>
      <View style={styles.paddingHorizontal}>
        <View style={styles.headerContainer}>
          <HoliColumns>
            <HoliColumn flex={2}>
              {hasVisibilityIcon ? (
                <HoliColumns alignItems="center" padding={[0, 0, 16, 0]}>
                  <HoliIcon icon={visibilityIcon} size={12} filled={true} />
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
              <MoreOptionsButtonWithModal
                label={t('insights.post.preview.more')}
                showOptions={visible}
                onPress={show}
                onModalDismiss={hide}
                style={styles.moreButton}
              >
                <ReportBlockOptionButton
                  action="report"
                  objectId={post.id}
                  contentType={ContentType.POST}
                  style={styles.moreOptionItem}
                  confirmationModalProps={{
                    title: t('insights.post.report.confirmation.title'),
                    description: t('insights.post.report.confirmation.description'),
                  }}
                  successMessage={t('global.report.successMessage')}
                  onConfirm={hide}
                />
              </MoreOptionsButtonWithModal>
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
        <PostImage uri={post.image.url} height={post.image.height} width={post.image.width} postTitle={post.title} />
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
  moreButton: {
    alignSelf: 'flex-start',
    justifyContent: 'flex-end',
  },
  moreOptionItem: {
    justifyContent: 'center',
    paddingVertical: 18,
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

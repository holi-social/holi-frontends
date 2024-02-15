import { useQuery } from '@apollo/client'
import { withProfiler } from '@sentry/react'
import { StatusBar } from 'expo-status-bar'
import React, { memo, useLayoutEffect, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { ImageBackground, Platform, StyleSheet, View } from 'react-native'

import ScrollHeaderLayout from '@holi/core/components/ScrollHeaderLayout'
import { isNotFoundError, logError } from '@holi/core/errors/helpers'
import { useBreakpointMatcher } from '@holi/core/helpers'
import { useOnRefresh } from '@holi/core/helpers/useOnRefresh'
import createParamHooks from '@holi/core/navigation/hooks/useParam'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import Tag from '@holi/core/screens/insights/Tag'
import { InsightByIdResponse, insightById } from '@holi/core/screens/insights/queries'
import PostPreview from '@holi/core/screens/posts/components/PostPreview'
import { Post } from '@holi/core/screens/posts/types'
import { User } from '@holi/core/screens/userprofile/types'
import HoliGridCell from '@holi/ui/components/atoms/HoliGridCell'
import HoliGridWrapper from '@holi/ui/components/atoms/HoliGridWrapper'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliSkeleton from '@holi/ui/components/atoms/HoliSkeleton'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliAvatar from '@holi/ui/components/molecules/HoliAvatar'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliModal from '@holi/ui/components/molecules/HoliModal'
import HoliUserCardsModalContent from '@holi/ui/components/organisms/HoliUserCardsModalContent'
import Spacing from '@holi/ui/foundations/Spacing'
import { colors } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

export type InsightDetailPageParams = {
  insightId: string
}

const { useParam } = createParamHooks<InsightDetailPageParams>()

const InsightDetailPage = () => {
  const [insightId] = useParam('insightId')
  const { t } = useTranslation()
  const mixins = useStyleMixins()
  const { replaceRoute } = useRouting()
  const postGridItemsInRow = useBreakpointMatcher()
  const [showCuratorModal, setShowCuratorModal] = useState(false)

  const {
    data: { insightById: insight } = {},
    loading: loadingInsight,
    refetch,
  } = useQuery<InsightByIdResponse>(insightById, {
    variables: { id: insightId },
    skip: !insightId,
    notifyOnNetworkStatusChange: true,
    onError: (error) => {
      if (isNotFoundError(error)) {
        return replaceRoute('/404')
      }
      logError(error, 'Failed to load insight', { location: 'InsightDetailPage.insightById', insightId })
    },
  })
  const initLoading = loadingInsight && !insight
  const setScreenOptions = useSetScreenOptions()

  const { refreshing, onRefresh } = useOnRefresh(refetch)

  useLayoutEffect(() => {
    setScreenOptions({
      headerTransparent: true,
      headerTintColor: colors.white100,
    })
  }, [setScreenOptions])

  const posts: Post[] = insight?.posts || []
  const author = insight?.creator

  return (
    <>
      <StatusBar style="light" animated />

      <ScrollHeaderLayout.Refreshable
        refreshableProps={{
          refreshing,
          onRefresh,
        }}
        style={styles.wrapper}
        headerOverlap
      >
        {initLoading ? (
          <View style={[mixins.container, styles.bannerImage]}>
            <HoliSkeleton height="100%" width="100%" borderRadius={0} />
          </View>
        ) : (
          <ImageBackground
            source={{ uri: insight?.headerImage }}
            resizeMode="cover"
            style={[mixins.container, styles.bannerImage]}
            imageStyle={styles.insightImage}
          />
        )}

        <View style={[styles.content, mixins.container]}>
          <View style={styles.tag}>
            {/* Our tags don't have a style for the one in the design - ask Design, should this be added to Tag component */}
            <Tag variant="interest" size="m">
              {insight?.topic?.title}
            </Tag>
          </View>
          {/* Needs loading skeleton */}

          {/* TODO: our headings don't match the designs, what to do? */}
          <View style={styles.tag}>
            <HoliHeading
              level="1"
              size="l"
              testID="insight-headline"
              loading={initLoading}
              // large font size (-> radius=16) with multiple lines expected
              skeletonOptions={{ numberOfLines: 2, borderRadius: 16 }}
            >
              {insight?.title}
            </HoliHeading>
          </View>

          {/* TODO: re-work the currator to match design - nothing has been changed yet for this  */}
          {(initLoading || author) && (
            <View style={styles.curator}>
              <HoliButton
                transparent
                label={t('user.cards.modal.showInfo', { name: author?.fullName })}
                onPress={initLoading ? undefined : () => setShowCuratorModal(true)}
              >
                <View style={styles.authorInfoInner}>
                  <HoliAvatar
                    imageSrc={author?.avatar}
                    imageBlurhash={author?.avatarBlurhash}
                    label={author?.fullName ?? ''}
                    initials={author?.avatarLabel || ''}
                    defaultColor={author?.avatarDefaultColor || ''}
                    size="small"
                    style={styles.authorInfoAvatar}
                    loading={initLoading}
                  />
                  {initLoading ? (
                    <HoliSkeleton width="40%" height={20} borderRadius={4} />
                  ) : (
                    <HoliText size="small" style={styles.authorInfoText}>
                      <Trans t={t} i18nKey="insight.curatedBy" values={{ name: author?.fullName }}>
                        <HoliText size="small" />
                      </Trans>
                    </HoliText>
                  )}
                </View>
              </HoliButton>
            </View>
          )}

          {author && (
            <HoliModal
              label={t('user.cards.modal.showInfo', { name: author.fullName })}
              show={showCuratorModal}
              onDismiss={() => setShowCuratorModal(false)}
              testID="insight-curator-modal"
            >
              <HoliUserCardsModalContent
                title={''} // don't show any headline in modal
                users={[author as User]}
                onDismiss={() => setShowCuratorModal(false)}
                testID="insight-curator"
              />
            </HoliModal>
          )}

          <HoliText style={styles.insightText} loading={initLoading} skeletonOptions={{ numberOfLines: 10 }}>
            {insight?.description}
          </HoliText>
        </View>

        {posts.length > 0 && (
          <View style={[mixins.container, styles.postList]}>
            <HoliGridWrapper itemsInRow={postGridItemsInRow}>
              {
                /** FIXME convert to VirtualizedList, FlatList or SectionList */
                posts.map((post) => (
                  <HoliGridCell key={post.id}>
                    <PostPreview post={post} insightId={insightId} />
                  </HoliGridCell>
                ))
              }
            </HoliGridWrapper>
          </View>
        )}
      </ScrollHeaderLayout.Refreshable>
    </>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.background20,
  },
  bannerImage: {
    paddingHorizontal: 0,
    height: Platform.OS === 'web' ? 680 : 340,
    ...Platform.select({
      web: {
        maxHeight: '50vh',
        objectFit: 'cover',
      },
      native: { maxHeight: '50%' },
    }),
  },
  insightImage: {
    ...Platform.select({ web: { height: 'auto' } }),
  },
  content: {
    backgroundColor: colors.background10,
    // TODO: could these be spaccings too?
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    paddingTop: Spacing.Xl,
    paddingBottom: Spacing.Lg,
    paddingHorizontal: Spacing.Xs,
  },
  tag: {
    marginBottom: Spacing.xxXs,
  },
  title: {
    marginBottom: Spacing.Xs,
  },
  curator: {
    marginBottom: Spacing.Md,
  },
  insightText: {
    color: colors.foreground20,
    marginTop: 24,
  },
  authorInfoInner: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  authorInfoAvatar: {
    marginRight: 16,
  },
  authorInfoText: {
    color: colors.foreground20,
  },
  authorInfoName: {
    color: colors.foreground30,
  },
  postList: {
    marginTop: 24,
  },
})

export default withProfiler(memo(InsightDetailPage), { name: 'InsightDetailPage' })

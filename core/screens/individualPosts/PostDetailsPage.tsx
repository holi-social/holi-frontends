import { useQuery } from '@apollo/client'
import { StatusBar } from 'expo-status-bar'
import React, { memo, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native'
import { EdgeInsets, useSafeAreaInsets } from 'react-native-safe-area-context'

import { useAuth } from '@holi/core/auth/helpers/useAuth'
import ScrollHeaderLayout from '@holi/core/components/ScrollHeaderLayout'
import { isNotFoundError, logError } from '@holi/core/errors/helpers'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import { useOnRefresh } from '@holi/core/helpers/useOnRefresh'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import HeaderTitle from '@holi/core/navigation/components/HeaderTitle'
import createParamHooks from '@holi/core/navigation/hooks/useParam'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import { useLoginModal } from '@holi/core/providers/LoginModalProvider'
import PostContent from '@holi/core/screens/individualPosts/components/PostContent'
import PostDrawer from '@holi/core/screens/individualPosts/components/PostDrawer'
import { PostQueryResponse, postQuery } from '@holi/core/screens/individualPosts/queries'
import PostDetailFooter from '@holi/core/screens/posts/components/PostDetailFooter'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { ArrowLeft, MoreFilled, Share } from '@holi/icons/src/generated'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliSkeleton from '@holi/ui/components/atoms/HoliSkeleton'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import Spacing from '@holi/ui/foundations/Spacing'
import { dimensions } from '@holi/ui/styles/globalVars'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

export type PostDetailsPageParams = {
  slug: string
}

const { useParam } = createParamHooks<PostDetailsPageParams>()

const PostDetailsPage = () => {
  const [slug] = useParam('slug')
  const { t } = useTranslation()
  const setScreenOptions = useSetScreenOptions()
  const { theme } = useTheme()
  const { replaceRoute, navigate } = useRouting()
  const { userId, isLoggedIn } = useAuth()
  const { openLoginModal } = useLoginModal()
  const insets = useSafeAreaInsets()
  const styles = useMemo(() => getStyles(theme, insets), [theme, insets])

  const [isDirectLink, setIsDirectLink] = useState(false)

  const isWeb = Platform.OS === 'web'
  useEffect(() => {
    setIsDirectLink(isWeb && (document.referrer === '' || document.referrer === window.location.href))
  }, [isWeb])

  const logo = useMemo(
    () => (
      <HoliButton transparent inline label={'btn-navigate-to-home-feed'} onPress={() => navigate('/')}>
        {theme.dark ? (
          <HoliLocalImage
            imageSource={require('@holi/ui/assets/img/holi/holi_beta_white.svg')}
            isSvg
            width={78}
            height={24}
            label={t('navigation.title')}
          />
        ) : (
          <HoliLocalImage
            imageSource={require('@holi/ui/assets/img/holi/holi_beta.svg')}
            isSvg
            width={78}
            height={24}
            label={t('navigation.title')}
          />
        )}
      </HoliButton>
    ),
    [theme.dark, t, navigate]
  )

  const {
    data: { post } = {},
    refetch,
    loading,
  } = useQuery<PostQueryResponse>(postQuery, {
    variables: { idOrSlug: slug },
    skip: !slug,
    onError: (error) => {
      if (isNotFoundError(error)) {
        return replaceRoute('/404')
      }
      logError(error, 'Failed to load feed post', {
        location: 'PostDetailsPage.postQuery',
        variables: { slug },
      })
    },
  })

  const { refreshing, onRefresh } = useOnRefresh(refetch)

  const headerLeft = useMemo(() => {
    if (isWeb) {
      return isDirectLink ? logo : <HeaderBackButton icon={ArrowLeft} />
    } else {
      return <HeaderBackButton icon={ArrowLeft} />
    }
  }, [isWeb, isDirectLink, logo])

  useIsomorphicLayoutEffect(() => {
    setScreenOptions({
      headerBackVisible: true,
      headerTransparent: true,
      headerStyle: { backgroundColor: theme.colors.background10 },
      navigationCustomOptions: {
        footerShown: false,
      },
      headerLeft: () => headerLeft,
      headerTitle: ({ tintColor }) => (
        <HeaderTitle tintColor={tintColor}>
          {t('individuals.post.details.title', { name: post?.creator.firstName })}
        </HeaderTitle>
      ),
      headerRight: () => {
        return (
          post && (
            <View style={styles.headerRight}>
              <HoliButton transparent label="btn-share-feed-post" inline>
                <HoliIcon icon={Share} />
              </HoliButton>
              <PostDrawer post={post}>
                <HoliIcon icon={MoreFilled} />
              </PostDrawer>
            </View>
          )
        )
      },
    })
  }, [headerLeft, post, setScreenOptions, styles.headerRight, t, theme.colors.background10])

  const onPressCreateComment = () =>
    isLoggedIn
      ? navigate(`/feedPosts/${slug}/comment`)
      : openLoginModal({
          description: t('comments.loginRedirect.text'),
        })

  return (
    <>
      <StatusBar backgroundColor={theme.colors.background10} style={theme.dark ? 'light' : 'dark'} />

      <ScrollHeaderLayout.Refreshable
        refreshableProps={{
          refreshing,
          onRefresh,
        }}
        style={styles.wrapper}
        headerOverlap
        scrollEnabled={false}
        scrollable={false}
        contentStyle={styles.wrapperContent}
      >
        <HoliContainer noPadding>
          <ScrollView style={styles.scrollView}>
            {post && !loading ? (
              <PostContent post={post} showVisibilityBadge={post.creator.id === userId} />
            ) : (
              <LoadingSkeleton />
            )}
          </ScrollView>
        </HoliContainer>
      </ScrollHeaderLayout.Refreshable>

      <SafeAreaView>
        <View style={styles.commentWrapper}>
          <HoliContainer flex={1}>
            <PostDetailFooter style={[styles.commentButton]} onPress={onPressCreateComment} />
          </HoliContainer>
        </View>
      </SafeAreaView>
    </>
  )
}

const LoadingSkeleton = () => <HoliSkeleton height={100} width={'100%'} borderRadius={0} />

const getStyles = ({ colors }: HoliTheme, insets: EdgeInsets) =>
  StyleSheet.create({
    wrapper: {
      width: 'auto',
      height: '100%',
      flex: 1,
      backgroundColor: colors.background10,
      ...Platform.select({
        web: {
          minHeight: '100%',
          paddingTop: dimensions.topBarHeight,
          paddingBottom: dimensions.bottomBarHeight + Spacing.xl,
        },
        ios: {
          paddingTop: dimensions.topBarHeight + insets.top - Spacing['3xs'],
        },
        android: {
          paddingTop: dimensions.topBarHeight + Spacing.xl,
        },
      }),
    },
    wrapperContent: {
      paddingBottom: 0,
    },
    scrollView: {
      height: '100%',
    },
    commentsContainer: {
      paddingHorizontal: Spacing.xs,
      paddingVertical: Spacing.sm,
      backgroundColor: colors.background10,
      borderBottomLeftRadius: Spacing.lg,
      borderBottomRightRadius: Spacing.lg,
    },
    commentWrapper: {
      backgroundColor: colors.background10,
      borderTopColor: colors.background30,
      borderTopWidth: 1,
      width: '100%',
      height: 74,
      ...Platform.select({
        web: {
          position: 'fixed',
          bottom: 0,
        },
      }),
    },
    commentButton: {
      paddingTop: 18,
      flex: 1,
    },
    headerRight: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.xs,
    },
  })

export default memo(PostDetailsPage)

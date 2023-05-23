import React from 'react'
import { ScrollView, StyleSheet } from 'react-native'
import RefreshableWrapper from 'react-native-fresh-refresh'
import Animated, { useSharedValue } from 'react-native-reanimated'

import { styles } from '@holi/core/components/DefaultLayout'
import DefaultLayout, { LayoutProps } from '@holi/core/components/DefaultLayout/Default'
import HeaderOffsetScrollView from '@holi/core/components/DefaultLayout/HeaderOffsetScrollView'
import { useScrollHandlerHandler } from '@holi/core/components/ScrollHeaderLayout/useScrollHandlerHandler'
import { useSafeAreaInsets } from '@holi/core/helpers/useSafeAreaInsets'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import { vars } from '@holi/ui/styles/globalVars'

const AnimatedDefaultLayout = Animated.createAnimatedComponent(DefaultLayout)

type DefaultProps = Omit<LayoutProps, 'refreshControl'>
type RefreshableWrapperProps = Omit<React.ComponentProps<typeof RefreshableWrapper>, 'children'> & {
  loaderTopOffset?: number
}

export interface RefreshableScrollHeaderLayoutProps extends DefaultProps {
  refreshableProps: RefreshableWrapperProps
}

const Refreshable = React.forwardRef<ScrollView, RefreshableScrollHeaderLayoutProps>(
  (
    {
      refreshableProps: {
        Loader,
        isLoading,
        onRefresh,
        refreshHeight = +vars.topBarHeight + +vars.loaderHeight,
        managedLoading = true,
        bounces = true,
        loaderTopOffset = +vars.loaderHeight,
      },
      children,
      headerOverlap,
      contentStyle,
      onScroll,
      ...defaultLayoutProps
    },
    ref
  ) => {
    const contentOffset = useSharedValue(0)
    const { top } = useSafeAreaInsets()
    const additionalOffset = headerOverlap ? top : 0
    const defaultLoader = () => <HoliLoader style={{ top: loaderTopOffset + additionalOffset }} />
    Loader ??= defaultLoader

    const onScrollHandler = useScrollHandlerHandler(onScroll)
    // add SafeArea top automaticaly

    const content = (
      <RefreshableWrapper
        contentOffset={contentOffset}
        Loader={Loader}
        refreshHeight={refreshHeight + additionalOffset}
        isLoading={isLoading}
        onRefresh={onRefresh}
        managedLoading={managedLoading}
        bounces={bounces}
      >
        <AnimatedDefaultLayout
          {...defaultLayoutProps}
          contentStyle={StyleSheet.flatten([!headerOverlap && styles.headerPadding, contentStyle])}
          onScroll={onScrollHandler}
          scrollEventThrottle={200}
          ref={ref}
        >
          {children}
        </AnimatedDefaultLayout>
      </RefreshableWrapper>
    )

    return headerOverlap ? content : <HeaderOffsetScrollView>{content}</HeaderOffsetScrollView>
  }
)

Refreshable.displayName = 'ScrollHeaderLayout.Refreshable'

export default Refreshable

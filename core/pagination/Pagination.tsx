import type { DocumentNode } from '@apollo/client'
import { ApolloError } from '@apollo/client/v4-migration'
import type React from 'react'
import { type PropsWithChildren, createContext, useContext, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import ScrollBasedCallbackInvocation from '@holi/core/components/ScrollBasedCallbackInvocation'
import usePaginationQuery, { type PaginationQueryHookOptions } from '@holi/core/pagination/usePaginationQuery'
import { useOnRefresh } from '@holi/core/refreshing/hooks/useOnRefresh'
import { Button, type ButtonProps } from 'holi-bricks/components/button'
import { View, type ViewStyle } from 'react-native'
import type { StyleProp } from 'react-native'

export interface PaginationContextType<T> {
  totalResults: number
  data: Readonly<T[]>
  loading: boolean | undefined
  error?: ApolloError | undefined
}

export interface PaginationProps {
  query: DocumentNode
  queryOptions: PaginationQueryHookOptions
  fetchMoreButtonProps?: Partial<ButtonProps> & { style?: StyleProp<ViewStyle> }
  fetchMoreButtonLabel?: string
  loadMoreOnScroll?: boolean
  scrollPlaceholder?: React.ReactNode
}

export const PaginationContext = createContext<PaginationContextType<unknown>>({} as PaginationContextType<unknown>)

export function usePaginationContext<T>() {
  const context = useContext(PaginationContext) as PaginationContextType<T>
  if (!context) {
    throw new Error('usePaginationContext() must be used within a PaginationContextProvider')
  }

  return context
}

export function Pagination({
  children,
  query,
  queryOptions,
  fetchMoreButtonLabel,
  fetchMoreButtonProps = {},
  loadMoreOnScroll = false,
  scrollPlaceholder,
}: PropsWithChildren<PaginationProps>) {
  const { t } = useTranslation()

  const { loading, data, error, totalResults, fetchNextPage, canFetchMore, refetch } = usePaginationQuery(
    query,
    queryOptions
  )
  useOnRefresh(refetch)

  const fetchMoreButtonText = fetchMoreButtonLabel || t('global.seeMore')

  const contextValue = {
    loading,
    data,
    error,
    totalResults,
  }

  const loadMoreComponent = useMemo(
    () =>
      loadMoreOnScroll ? (
        <ScrollBasedCallbackInvocation callback={fetchNextPage} placeholder={scrollPlaceholder} />
      ) : (
        <View style={fetchMoreButtonProps.style}>
          <Button
            variant="primary"
            label={fetchMoreButtonText}
            loadingLabel={t('global.loading')}
            onPress={fetchNextPage}
            testID="btn-fetch-more"
            {...fetchMoreButtonProps}
          />
        </View>
      ),
    [fetchMoreButtonProps, fetchMoreButtonText, fetchNextPage, loadMoreOnScroll, scrollPlaceholder, t]
  )

  return (
    <PaginationContext.Provider value={contextValue}>
      {children}
      {canFetchMore && loadMoreComponent}
    </PaginationContext.Provider>
  )
}

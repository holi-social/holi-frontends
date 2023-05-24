import { ApolloError, DocumentNode } from '@apollo/client'
import React, { PropsWithChildren, createContext, useContext } from 'react'
import { useTranslation } from 'react-i18next'

import usePaginationQuery, { PaginationQueryHookOptions } from '@holi/core/pagination/usePaginationQuery'
import HoliButtonLoading, { HoliButtonLoadingProps } from '@holi/ui/components/molecules/HoliButtonLoading'

export interface PaginationContextType<T> {
  totalResults: number
  data: T[]
  loading: boolean | undefined
  error: ApolloError | undefined
}

export interface PaginationProps {
  query: DocumentNode
  queryOptions: PaginationQueryHookOptions
  fetchMoreButtonProps?: Partial<HoliButtonLoadingProps>
  fetchMoreButtonLabel?: string
}

const PaginationContext = createContext<PaginationContextType<unknown>>({} as PaginationContextType<unknown>)

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
}: PropsWithChildren<PaginationProps>) {
  const { t } = useTranslation()

  const { loading, data, error, totalResults, fetchNextPage, canFetchMore, isFetchingMore } = usePaginationQuery(
    query,
    queryOptions
  )

  const fetchMoreButtonText = isFetchingMore ? t('global.loading') : fetchMoreButtonLabel || t('global.seeMore')

  const contextValue = {
    loading,
    data,
    error,
    totalResults,
  }

  return (
    <PaginationContext.Provider value={contextValue}>
      {children}
      {canFetchMore && (
        <HoliButtonLoading
          type="primary"
          label={fetchMoreButtonText}
          disabled={isFetchingMore}
          icon={isFetchingMore ? 'loader-4' : undefined}
          iconSpinning={isFetchingMore}
          onPress={fetchNextPage}
          testID="btn-fetch-more"
          {...fetchMoreButtonProps}
        />
      )}
    </PaginationContext.Provider>
  )
}

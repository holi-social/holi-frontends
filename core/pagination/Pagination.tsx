import { DocumentNode } from '@apollo/client'
import React, { PropsWithChildren, createContext, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, ViewProps, ViewStyle } from 'react-native'

import usePaginationQuery, { PaginationQueryHookOptions } from '@holi/core/pagination/usePaginationQuery'
import HoliButtonLoading from '@holi/ui/components/molecules/HoliButtonLoading'

export interface PaginationContextType<T> {
  totalResults: number
  data: T[]
  loading: boolean | undefined
  error: unknown
}

export interface PaginationProps {
  query: DocumentNode
  queryOptions: PaginationQueryHookOptions
  buttonStyle?: StyleProp<ViewStyle>
  containerProps?: ViewProps
  // TODO(SF) + button label variants
}

// TODO(SF) get rid of unknown?
const PaginationContext = createContext<PaginationContextType<unknown>>({} as PaginationContextType<unknown>)

export function usePaginationContext<T>() {
  const context = useContext(PaginationContext) as PaginationContextType<T>
  if (!context) {
    throw new Error('usePaginationContext() must be used within a PaginationContextProvider')
  }

  return context
}

export function Pagination<T>({
  children,
  query,
  queryOptions,
  buttonStyle,
  containerProps = {},
}: PropsWithChildren<PaginationProps>) {
  const { t } = useTranslation()

  const { loading, data, error, totalResults, fetchNextPage, canFetchMore, isFetchingMore } = usePaginationQuery<T>(
    query,
    queryOptions
  )

  // TODO(SF) change i18n keys, make configurable
  const fetchMoreButtonText = isFetchingMore
    ? t('donations:donationListing.loadMoreButton.loading')
    : t('donations:donationListing.loadMoreButton.text')

  const contextValue = {
    loading,
    data,
    error,
    totalResults,
  }

  return (
    <PaginationContext.Provider value={contextValue} {...containerProps}>
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
          style={buttonStyle}
        />
      )}
    </PaginationContext.Provider>
  )
}

/* eslint-disable @typescript-eslint/no-explicit-any */
// TODO: fix eslint warning
// Based on solito@0.0.26
// From https://gist.github.com/nandorojo/052887f99bb61b54845474f324aa41cc
import Router, { useRouter } from 'next/router'
import { useCallback, useMemo, useRef } from 'react'

import {
  type Param,
  type Params,
  type Returns,
  type UpdateOptions,
  useStableCallback,
} from '@holi/core/navigation/hooks/useParam/shared'
import { coerceToUUIDString } from '@holi/core/helpers'

/**
 * This creates three hooks for handling query parameters:
 *
 * - `useParam`:
 *   Requires the name of a query parameter as argument and returns a
 *   getter for this query parameter's state.
 *   You can pass a second parameter to control how to parse the query
 *   values, e.g. to specify how and if multiple values should be
 *   allowed (see `singleParamConfig` and `arrayParamConfig`).
 * - `useUUIDParam`:
 *   Same as `useParam` but for UUIDs, having a default parse function
 *   that tries to coerce the value to a UUID.
 * - `useUpdateParams`:
 *   This function allows updating multiple query parameters at once and
 *   does not trigger rerenderings. It expects an object of query
 *   parameters with values to change as argument.
 *   It also allows passing of `UpdateOptions` that e.g. define if updating the
 *   query parameter should replace the last history entry on web (see
 *   `webReplaceQueryConfig`).
 */
const createParamHooks = <Props extends Record<string, unknown> = Record<string, string>>() => {
  const useParam = <
    Name extends keyof Props,
    ParseFunction extends undefined | ((value?: string | string[]) => Props[Name]) = (
      value?: string | string[]
    ) => NonNullable<Props[Name]>,
    InitialValue = Props[Name] | undefined,
    ParsedType = InitialValue extends undefined
      ? Props[Name] | undefined
      : ParseFunction extends undefined
        ? Props[Name] | undefined
        : NonNullable<Props[Name]>,
  >(
    ...[name, maybeConfig]: Params<Props, Name, ParseFunction, InitialValue, ParsedType>
  ): Returns<Props, Name, ParseFunction, InitialValue, ParsedType> => {
    const { parse = (value?: Param) => value, initial } = maybeConfig || {}
    const nextRouter = useRouter()

    const stableParse = useStableCallback(parse)

    const initialValue = useRef(initial)
    const hasSetState = useRef(false)

    const webParam = nextRouter?.query?.[name as string]

    const state = useMemo<ParsedType>(() => {
      let state: ParsedType
      if (webParam === undefined && !hasSetState.current) {
        state = initialValue.current as any
      } else {
        state = (stableParse(webParam) ?? initialValue.current) as ParsedType
      }
      return state
    }, [stableParse, webParam])

    return state
  }

  const useUUIDParam = (name: keyof Props, { initial }: { initial?: string | undefined } = {}): string | undefined =>
    useParam(name, { parse: coerceToUUIDString, initial })

  const useUpdateParams = (
    options?: UpdateOptions
  ): ((props: Partial<Props>, optionOverrides?: UpdateOptions) => void) => {
    const setWebState = useCallback(
      (value: Partial<Props>, optionOverrides?: UpdateOptions) => {
        const combinedOptions = { ...options, ...optionOverrides }
        const { pathname, query } = Router
        const newQuery = { ...query, ...value }
        for (const key in value) {
          if (value[key] === null || value[key] === undefined || value[key] === '') {
            delete newQuery[key]
          }
        }

        const action = combinedOptions?.web?.replace ? Router.replace : Router.push

        action(
          {
            pathname,
            query: newQuery,
          },
          undefined,
          {
            shallow: true,
          }
        )
      },
      [options]
    )

    return setWebState
  }

  return {
    useParam,
    useUUIDParam,
    useUpdateParams,
  }
}

export default createParamHooks

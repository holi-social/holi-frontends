/* eslint-disable @typescript-eslint/no-explicit-any */
// TODO: fix eslint warning
// Based on solito@0.0.26
// From https://gist.github.com/nandorojo/052887f99bb61b54845474f324aa41cc
import Router, { useRouter } from 'next/router'
import { useCallback, useMemo, useRef } from 'react'

import {
  type Params,
  type Returns,
  type UpdateOptions,
  useStable,
  useStableCallback,
} from '@holi/core/navigation/hooks/useParam/shared'
import { coerceToUUIDString } from '@holi/core/helpers'

/**
 * This creates two hooks for handling query parameters:
 *
 * - `useParam`:
 *   Requires the name of a query parameter as argument and returns a
 *   getter and a setter to handle this query parameter's state similiar
 *   to the `useState` hook. I.e. using the setter will result in
 *   rerenderings.
 *   You can pass a second parameter to control how to parse the query
 *   values, e.g. to specify how and if multiple values should be
 *   allowed (see `singleParamConfig` and `arrayParamConfig`).
 * - `useUpdateParams`:
 *   This function allows updating multiple query parameters at once and
 *   does not trigger rerenderings. It expects an object of query
 *   parameters with values to change as argument.
 *
 * Both hooks allow passing of `UpdateOptions` that e.g. define if
 * updating the query parameter should replace the last history entry on
 * web (see `webReplaceQueryConfig`). By default the last history entry
 * is only replaced by the setter of `useParam` if an already present
 * query parameter is changed.
 */
const createParamHooks = <Props extends Record<string, unknown> = Record<string, string>>() => {
  const useParam = <
    Name extends keyof Props,
    NullableUnparsedParsedType extends Props[Name] | undefined = Props[Name] | undefined,
    ParseFunction extends undefined | ((value?: string | string[]) => NonNullable<NullableUnparsedParsedType>) = (
      value?: string | string[]
    ) => NonNullable<NullableUnparsedParsedType>,
    InitialValue = NullableUnparsedParsedType | undefined,
    ParsedType = InitialValue extends undefined
      ? NullableUnparsedParsedType
      : ParseFunction extends undefined
        ? NullableUnparsedParsedType
        : NonNullable<NullableUnparsedParsedType>,
  >(
    ...[name, maybeConfig]: Params<Props, Name, NullableUnparsedParsedType, ParseFunction, InitialValue, ParsedType>
  ): Returns<Props, Name, NullableUnparsedParsedType, ParseFunction, InitialValue, ParsedType> => {
    const {
      parse = (value?: string | string[]) => value,
      initial,
      stringify = (value: ParsedType) => `${value}`,
      paramsToClearOnSetState,
      options,
    } = maybeConfig || {}
    const nextRouter = useRouter()

    const stableParse = useStableCallback(parse)
    const stableStringify = useStableCallback(stringify)
    const stableParamsToClear = useStable(paramsToClearOnSetState)

    const initialValue = useRef(initial)
    const hasSetState = useRef(false)

    const setState = useCallback(
      (value: ParsedType) => {
        hasSetState.current = true
        const { pathname, query } = Router
        const newQuery = { ...query }
        if (value != null && (value as any) !== '') {
          newQuery[name as string] = stableStringify(value)
        } else {
          delete newQuery[name as string]
        }

        if (stableParamsToClear.current) {
          for (const paramKey of stableParamsToClear.current) {
            delete newQuery[paramKey as string]
          }
        }

        const willChangeExistingParam = query[name as string] && newQuery[name as string]

        const action = options?.web?.replace || willChangeExistingParam ? Router.replace : Router.push

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
      [stableParamsToClear, name, options?.web?.replace, stableStringify]
    )

    const webParam = nextRouter?.query?.[name as string]

    const state = useMemo<ParsedType>(() => {
      let state: ParsedType
      if (webParam === undefined && !hasSetState.current) {
        state = initialValue.current as any
      } else {
        state = stableParse(webParam) as ParsedType
      }
      return state
    }, [stableParse, webParam])

    return [state, setState]
  }

  const useUUIDParam = (
    name: Parameters<typeof useParam>[0],
    maybeConfig?: Omit<Parameters<typeof useParam>[1], 'parse'>
  ) =>
    useParam(name, {
      ...maybeConfig,
      initial: maybeConfig?.initial,
      parse: coerceToUUIDString,
    })

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

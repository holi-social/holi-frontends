/* eslint-disable @typescript-eslint/no-explicit-any */
// TODO: fix eslint warning
// Based on solito@0.0.26 - Adapted for Expo Router
import { useLocalSearchParams, usePathname, useRouter } from 'expo-router'
import { useCallback, useMemo, useRef } from 'react'

import {
  type Params,
  type Returns,
  type UpdateOptions,
  useStable,
  useStableCallback,
} from '@holi/core/navigation/hooks/useParam/shared'
import { coerceToUUIDString } from '@holi/core/helpers'

// Helper function to convert search params to URLSearchParams
const createURLSearchParams = (searchParams: Record<string, string | string[]>) => {
  const params = new URLSearchParams()
  Object.entries(searchParams).forEach(([key, val]) => {
    if (val !== undefined) {
      if (Array.isArray(val)) {
        val.forEach((v) => params.append(key, String(v)))
      } else {
        params.set(key, String(val))
      }
    }
  })
  return params
}

/**
 * This creates two hooks for handling query parameters:
 *
 * - `useParam`:
 *   Requires the name of a query parameter as an argument and returns a
 *   getter and a setter to handle this query parameter's state similar
 *   to the `useState` hook. I.e., using the setter will result in
 *   re-renderings.
 *   You can pass a second parameter to control how to parse the query
 *   values, e.g., to specify how and if multiple values should be
 *   allowed (see `singleParamConfig` and `arrayParamConfig`).
 * - `useUpdateParams`:
 *   This function allows updating multiple query parameters at once and
 *   does not trigger re-renderings. It expects an object of query
 *   parameters with values to change as argument.
 *
 * Both hooks allow passing of `UpdateOptions` that e.g., define if
 * updating the query parameter should replace the last history entry on
 *  the web (see `webReplaceQueryConfig`). By default, the last history entry
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

    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useLocalSearchParams()

    const stableParse = useStableCallback(parse)
    const stableStringify = useStableCallback(stringify)
    const stableParamsToClear = useStable(paramsToClearOnSetState)

    const initialValue = useRef(initial)
    const hasSetState = useRef(false)

    const setState = useCallback(
      (value: ParsedType) => {
        hasSetState.current = true

        // Get current search params as URLSearchParams
        const currentParams = createURLSearchParams(searchParams)

        // Update the target parameter
        if (value != null && (value as any) !== '') {
          currentParams.set(name as string, stableStringify(value))
        } else {
          currentParams.delete(name as string)
        }

        // Clear additional parameters if specified
        if (stableParamsToClear.current) {
          for (const paramKey of stableParamsToClear.current) {
            currentParams.delete(paramKey as string)
          }
        }

        const willChangeExistingParam = searchParams[name as string] && currentParams.has(name as string)
        const shouldReplace = options?.web?.replace || willChangeExistingParam

        // Build the new URL
        const newSearch = currentParams.toString()
        const href = newSearch ? `${pathname}?${newSearch}` : pathname

        if (shouldReplace) {
          router.replace(href)
        } else {
          router.push(href)
        }
      },
      [stableParamsToClear, name, options?.web?.replace, stableStringify, router, pathname, searchParams]
    )

    const webParam = searchParams[name as string]

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
    name: keyof Props,
    maybeConfig: Omit<Parameters<typeof useParam>[1], 'parse' | 'initial'> & {
      parse?: typeof coerceToUUIDString
      initial: string | undefined
    } = {
      parse: coerceToUUIDString,
      initial: undefined,
    }
  ): readonly [string | undefined, (value: string) => void] => useParam(name, maybeConfig)

  const useUpdateParams = (
    options?: UpdateOptions
  ): ((props: Partial<Props>, optionOverrides?: UpdateOptions) => void) => {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useLocalSearchParams()

    return useCallback(
      (value: Partial<Props>, optionOverrides?: UpdateOptions) => {
        const combinedOptions = { ...options, ...optionOverrides }

        // Get current search params as URLSearchParams
        const currentParams = createURLSearchParams(searchParams)

        // Update with new values
        for (const key in value) {
          const val = value[key]
          if (val === null || val === undefined || val === '') {
            currentParams.delete(key)
          } else {
            currentParams.set(key, String(val))
          }
        }

        // Build the new URL
        const newSearch = currentParams.toString()
        const href = newSearch ? `${pathname}?${newSearch}` : pathname

        if (combinedOptions?.web?.replace) {
          router.replace(href)
        } else {
          router.push(href)
        }
      },
      [options, router, pathname, searchParams]
    )
  }

  return {
    useParam,
    useUUIDParam,
    useUpdateParams,
  }
}

export default createParamHooks

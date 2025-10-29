import { useLocalSearchParams, useRouter } from 'expo-router'
import isEqual from 'lodash.isequal'

/* eslint-disable @typescript-eslint/no-explicit-any */
// TODO: fix eslint warning
// Based on solito@0.0.26
// From https://gist.github.com/nandorojo/052887f99bb61b54845474f324aa41cc
import { useCallback, useEffect, useState } from 'react'

import { coerceToUUIDString } from '@holi/core/helpers'
import {
  type Params,
  type Returns,
  type UpdateOptions,
  useStableCallback,
} from '@holi/core/navigation/hooks/useParam/shared'

/**
 * This creates three hooks for handling query parameters:
 *
 * - `useParam`:
 *   Requires the name of a query parameter as an argument and returns a
 *   getter and a setter to handle this query parameter's state similar
 *   to the `useState` hook. I.e., using the setter will result in
 *   rerenderings.
 *   You can pass a second parameter to control how to parse the query
 *   values, e.g., to specify how and if multiple values should be
 *   allowed (see `singleParamConfig` and `arrayParamConfig`).
 * - `useUUIDParam`:
 *   Same as `useParam` but for UUIDs, having a default parse function
 *   that tries to coerce the value to a UUID.
 * - `useUpdateParams`:
 *   This function allows updating multiple query parameters at once and
 *   does not trigger re-renderings. It expects an object of query
 *   parameters with values to change as argument.
 *
 * Both hooks allow passing of `UpdateOptions` that e.g., define if
 * updating the query parameter should replace the last history entry on
 * the web (see `webReplaceQueryConfig`). By default, the last history entry
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
    const { parse = (value?: string | string[]) => value, initial } = maybeConfig || {}
    const searchParams = useLocalSearchParams()
    const router = useRouter()

    const stableParse = useStableCallback(parse)

    const [nativeState, setNativeStateInternal] = useState<ParsedType | InitialValue>(() => {
      const state = searchParams[name as string]
      return (stableParse(state) as ParsedType) ?? (initial as InitialValue)
    })

    useEffect(() => {
      const state = searchParams[name as string]
      const newState = (stableParse(state) as ParsedType) || (initial as InitialValue)
      setNativeStateInternal((prevState) => {
        return isEqual(prevState, newState) ? prevState : newState
      })
    }, [setNativeStateInternal, stableParse, searchParams, name, initial])

    // Create a setter that updates both state and URL params
    const setNativeState = useCallback(
      (value: ParsedType) => {
        setNativeStateInternal(value)

        // Update URL params
        const newParams = { ...searchParams }
        if (value === undefined || value === null || value === '') {
          delete newParams[name as string]
        } else {
          newParams[name as string] = String(value)
        }

        router.setParams(newParams)
      },
      [router, searchParams, name]
    )

    return [nativeState, setNativeState]
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    options?: UpdateOptions
  ): ((props: Partial<Props>, optionOverrides?: UpdateOptions) => void) => {
    const router = useRouter()

    return useCallback(
      (value: Partial<Props>) => {
        // Remove undefined/null values, otherwise the params become the strings "undefined" and "null"
        Object.keys(value).forEach((key) => {
          if (value[key] === undefined || value[key] === null) {
            delete value[key]
          }
        })

        router.setParams(value as any)
      },
      [router]
    )
  }

  return {
    useParam,
    useUUIDParam,
    useUpdateParams,
  }
}

export default createParamHooks

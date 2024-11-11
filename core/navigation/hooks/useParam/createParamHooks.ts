/* eslint-disable @typescript-eslint/no-explicit-any */
// TODO: fix eslint warning
// Based on solito@0.0.26
// From https://gist.github.com/nandorojo/052887f99bb61b54845474f324aa41cc
import { useCallback, useEffect, useState } from 'react'

import { Params, Returns, UpdateOptions, useStableCallback } from '@holi/core/navigation/hooks/useParam/shared'
import useRouting from '@holi/core/navigation/hooks/useRouting'

import { useRoute } from './useRoute'

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
    const { parse = (value?: string | string[]) => value, initial } = maybeConfig || {}
    const nativeRoute = useRoute()

    const stableParse = useStableCallback(parse)

    const [nativeState, setNativeState] = useState<ParsedType | InitialValue>(() => {
      const state = (nativeRoute?.params as any)?.[name]
      return (stableParse(state) as ParsedType) ?? (initial as InitialValue)
    })

    useEffect(() => {
      const state = (nativeRoute?.params as any)?.[name]
      setNativeState((stableParse(state) as ParsedType) || (initial as InitialValue))
    }, [setNativeState, stableParse, nativeRoute?.params, name, initial])

    return [nativeState, setNativeState]
  }

  const useUpdateParams = (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    options?: UpdateOptions
  ): ((props: Partial<Props>, optionOverrides?: UpdateOptions) => void) => {
    const { setParams } = useRouting()

    const setNativeStateFromParams = useCallback(
      (value: Partial<Props>) => {
        setParams(value)
      },
      [setParams]
    )

    return setNativeStateFromParams
  }

  return {
    useParam,
    useUpdateParams,
  }
}

export default createParamHooks

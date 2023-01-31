/* eslint-disable @typescript-eslint/no-explicit-any */
// TODO: fix eslint warning
// Based on solito@0.0.26
// From https://gist.github.com/nandorojo/052887f99bb61b54845474f324aa41cc
import Router, { useRouter } from 'next/router'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Platform } from 'react-native'

import { useUnifiedNavigation } from '@holi/core/navigation/hooks/useUnifiedNavigation'

import { useRoute } from './useRoute'

const useStable = <T>(value: T) => {
  const ref = useRef(value)
  useEffect(() => {
    ref.current = value
  }, [value])

  return ref
}

const useStableCallback = <T extends (...args: any[]) => any>(callback: T | undefined): T => {
  const callbackRef = useRef(callback)

  useEffect(() => {
    callbackRef.current = callback
  })

  // https://github.com/facebook/react/issues/19240
  return useMemo(() => ((...args) => callbackRef.current?.(...args)) as T, [])
}

type Config<
  Props extends Record<string, unknown>,
  Required extends boolean,
  ParsedType,
  InitialValue
> = (Required extends false
  ? {
      parse?: (value?: string | string[]) => ParsedType
    }
  : {
      parse: (value?: string | string[]) => ParsedType
    }) & {
  stringify?: (value: ParsedType) => string
  initial: InitialValue
  paramsToClearOnSetState?: (keyof Props)[]
}

type Params<
  Props extends Record<string, unknown> = Record<string, string>,
  Name extends keyof Props = keyof Props,
  NullableUnparsedParsedType extends Props[Name] | undefined = Props[Name] | undefined,
  ParseFunction extends undefined | ((value?: string | string[]) => NonNullable<NullableUnparsedParsedType>) = (
    value?: string | string[]
  ) => NonNullable<NullableUnparsedParsedType>,
  InitialValue = NullableUnparsedParsedType | undefined,
  ParsedType = InitialValue extends undefined
    ? NullableUnparsedParsedType
    : ParseFunction extends undefined
    ? NullableUnparsedParsedType
    : NonNullable<NullableUnparsedParsedType>
> = NonNullable<ParsedType> extends string
  ? [name: Name, config: Config<Props, false, ParsedType, InitialValue>] | [name: Name]
  : [name: Name, config: Config<Props, true, ParsedType, InitialValue>]

type Returns<
  Props extends Record<string, unknown> = Record<string, string>,
  Name extends keyof Props = keyof Props,
  NullableUnparsedParsedType extends Props[Name] | undefined = Props[Name] | undefined,
  ParseFunction extends undefined | ((value?: string | string[]) => NonNullable<NullableUnparsedParsedType>) = (
    value?: string | string[]
  ) => NonNullable<NullableUnparsedParsedType>,
  InitialValue = NullableUnparsedParsedType | undefined,
  ParsedType = InitialValue extends undefined
    ? NullableUnparsedParsedType
    : ParseFunction extends undefined
    ? NullableUnparsedParsedType
    : NonNullable<NullableUnparsedParsedType>
> = readonly [state: ParsedType | InitialValue, setState: (value: ParsedType) => void]

type UpdateOptions = {
  web?: {
    replace?: boolean
  }
}

const parseString = (value?: string | string[]): string | undefined =>
  Array.isArray(value) ? (value.length ? value[0] : undefined) : value
const parseArray = (value?: string | string[]): string[] => (!value ? [] : Array.isArray(value) ? value : [value])

export const singleParamConfig = { initial: undefined, parse: parseString }
export const arrayParamConfig = { initial: [], parse: parseArray }

const createParam = <Props extends Record<string, unknown> = Record<string, string>>() => {
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
      : NonNullable<NullableUnparsedParsedType>
  >(
    ...[name, maybeConfig]: Params<Props, Name, NullableUnparsedParsedType, ParseFunction, InitialValue, ParsedType>
  ): Returns<Props, Name, NullableUnparsedParsedType, ParseFunction, InitialValue, ParsedType> => {
    const {
      parse = (value?: string | string[]) => value,
      initial,
      stringify = (value: ParsedType) => `${value}`,
      paramsToClearOnSetState,
    } = maybeConfig || {}
    const nextRouter = useRouter()
    const nativeRoute = useRoute()

    const stableParse = useStableCallback(parse)
    const stableStringify = useStableCallback(stringify)
    const stableParamsToClear = useStable(paramsToClearOnSetState)

    const [nativeState, setNativeState] = useState<ParsedType | InitialValue>(() => {
      const state = (nativeRoute?.params as any)?.[name]
      return (stableParse(state) as ParsedType) ?? (initial as InitialValue)
    })

    useEffect(() => {
      const state = (nativeRoute?.params as any)?.[name]
      setNativeState((stableParse(state) as ParsedType) || (initial as InitialValue))
    }, [setNativeState, stableParse, nativeRoute?.params, name, initial])

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

        const action = willChangeExistingParam ? Router.replace : Router.push

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
      [name, stableStringify, stableParamsToClear]
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

    if (Platform.OS !== 'web') {
      return [nativeState, setNativeState]
    }

    return [state, setState]
  }

  const useUpdateParams = (): ((props: Partial<Props>, options?: UpdateOptions) => void) => {
    const { setParams } = useUnifiedNavigation()

    const setNativeStateFromParams = useCallback(
      (value: Partial<Props>) => {
        setParams(value)
      },
      [setParams]
    )

    const setWebState = useCallback((value: Partial<Props>, options?: UpdateOptions) => {
      const { pathname, query } = Router
      const newQuery = { ...query, ...value }
      for (const key in value) {
        if (value[key] == null || value[key] === '') {
          delete newQuery[key]
        }
      }

      const action = options?.web?.replace ? Router.replace : Router.push

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
    }, [])

    return Platform.select({
      web: setWebState,
      default: setNativeStateFromParams,
    })
  }

  return {
    useParam,
    useUpdateParams,
  }
}

export default createParam

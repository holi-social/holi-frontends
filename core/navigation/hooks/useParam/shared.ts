/* eslint-disable @typescript-eslint/no-explicit-any */
import { coerceToUUIDString } from '@holi/core/helpers'
import { useEffect, useMemo, useRef } from 'react'

export type Config<
  Props extends Record<string, unknown>,
  Required extends boolean,
  ParsedType,
  InitialValue,
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
  options?: UpdateOptions
}

export type Params<
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
      : NonNullable<NullableUnparsedParsedType>,
> = NonNullable<ParsedType> extends string
  ? [name: Name, config: Config<Props, false, ParsedType, InitialValue>] | [name: Name]
  : [name: Name, config: Config<Props, true, ParsedType, InitialValue>]

export type Returns<
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
      : NonNullable<NullableUnparsedParsedType>,
> = ParsedType | InitialValue

export type UpdateOptions = {
  web?: {
    replace?: boolean
  }
}

export const useStableCallback = <T extends (...args: any[]) => any>(callback: T | undefined): T => {
  const callbackRef = useRef(callback)

  useEffect(() => {
    callbackRef.current = callback
  })

  // https://github.com/facebook/react/issues/19240
  return useMemo(() => ((...args) => callbackRef.current?.(...args)) as T, [])
}

const parseString = (value?: string | string[]): string | undefined =>
  Array.isArray(value) ? (value.length ? value[0] : undefined) : value
const parseArray = (value?: string | string[]): string[] | undefined =>
  !value ? undefined : Array.isArray(value) ? value : [value]

export const singleParamConfig = { initial: undefined, parse: parseString }
export const arrayParamConfig = { initial: undefined, parse: parseArray }
export const uuidParamConfig = { initial: undefined, parse: coerceToUUIDString }
export const webReplaceQueryConfig = { web: { replace: true } }

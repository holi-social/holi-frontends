/* eslint-disable @typescript-eslint/no-explicit-any */
import { coerceToUUIDString } from '@holi/core/helpers'
import { useEffect, useMemo, useRef } from 'react'

export type Param = string | string[]

export type Config<ParsedType, InitialValue, Required extends boolean> = (Required extends false
  ? { parse?: (value?: Param) => ParsedType }
  : { parse: (value?: Param) => ParsedType }) & { initial: InitialValue }

export type Params<
  Props extends Record<string, unknown> = Record<string, string>,
  Name extends keyof Props = keyof Props,
  ParseFunction extends undefined | ((value?: Param) => Props[Name]) = (value?: Param) => Props[Name],
  InitialValue = Props[Name] | undefined,
  ParsedType = InitialValue extends undefined
    ? Props[Name] | undefined
    : ParseFunction extends undefined
      ? Props[Name] | undefined
      : NonNullable<Props[Name]>,
> = NonNullable<ParsedType> extends string
  ? [name: Name, config: Config<ParsedType, InitialValue, false>] | [name: Name]
  : [name: Name, config: Config<ParsedType, InitialValue, true>]

export type Returns<
  Props extends Record<string, unknown> = Record<string, string>,
  Name extends keyof Props = keyof Props,
  ParseFunction extends undefined | ((value?: Param) => Props[Name]) = (value?: Param) => Props[Name],
  InitialValue = Props[Name] | undefined,
  ParsedType = InitialValue extends undefined
    ? Props[Name] | undefined
    : ParseFunction extends undefined
      ? Props[Name] | undefined
      : NonNullable<Props[Name]>,
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

const parseString = (value?: Param): string | undefined =>
  Array.isArray(value) ? (value.length ? value[0] : undefined) : value
const parseArray = (value?: Param): string[] | undefined =>
  !value ? undefined : Array.isArray(value) ? value : [value]

export const singleParamConfig = { initial: undefined, parse: parseString }
export const arrayParamConfig = { initial: undefined, parse: parseArray }
export const uuidParamConfig = { initial: undefined, parse: coerceToUUIDString }
export const webReplaceQueryConfig = { web: { replace: true } }

import { Spacing, type SpacingSize } from 'holi-bricks/tokens'

export const marginKeys = ['m', 'mt', 'mr', 'mb', 'ml', 'mx', 'my'] as const
export const marginStyles = [
  'margin',
  'marginTop',
  'marginRight',
  'marginBottom',
  'marginLeft',
  'marginHorizontal',
  'marginVertical',
] as const

export const marginMappings = {
  m: 'margin',
  mt: 'marginTop',
  mr: 'marginRight',
  mb: 'marginBottom',
  ml: 'marginLeft',
  mx: 'marginHorizontal',
  my: 'marginVertical',
}

export type MarginKeys = (typeof marginKeys)[number]

export type MarginStyles = (typeof marginStyles)[number]

export type LayoutProps = {
  l?: Partial<Record<MarginKeys, SpacingSize>>
}

export const extractLayout = (props: LayoutProps) => {
  if (props.l == undefined) return undefined

  const layoutProps = props.l

  return (Object.keys(layoutProps) as MarginKeys[])
    .filter((p) => marginKeys.includes(p))
    .reduce(
      (p, c) => {
        return { ...p, ...{ [marginMappings[c]]: Spacing[layoutProps[c]!] } }
      },
      {} as Record<MarginStyles, number>
    )
}

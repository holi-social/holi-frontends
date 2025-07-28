import { createGridStyles, createResponsiveWidth, defaultGridBreakpoints } from '@holi/ui/components/utils/gridStyles'
import { breakpoints } from 'holi-bricks/foundations'

const gridBreakpoints: [number, number][] = [
  [0, 1],
  [breakpoints.sm, 2],
  [breakpoints.md, 3],
  [breakpoints.xxl, 4],
]

it('should create responsive widths', () => {
  expect(createResponsiveWidth(defaultGridBreakpoints)).toStrictEqual({
    width: '100%',
    [`@media (min-width: ${breakpoints.lg}px)`]: {
      width: '50%',
    },
  })

  expect(createResponsiveWidth(gridBreakpoints)).toStrictEqual({
    width: '100%',
    [`@media (min-width: ${breakpoints.xxl}px)`]: {
      width: '25%',
    },
    [`@media (min-width: ${breakpoints.md}px)`]: {
      width: '33.333333333333336%',
    },
    [`@media (min-width: ${breakpoints.sm}px)`]: {
      width: '50%',
    },
  })
})

it('should create responsive styles for the <GridProvider>', () => {
  const gap = 12
  expect(createGridStyles(defaultGridBreakpoints, gap)).toStrictEqual(
    expect.objectContaining({
      fullStyles: {
        gridItem: {
          [`@media (min-width: ${breakpoints.lg}px)`]: {
            width: '50%',
          },
          padding: 6,
          width: '100%',
        },
      },
      styles: {
        gridItem: {
          padding: 6,
          width: '100%',
        },
      },
    })
  )

  expect(createGridStyles(gridBreakpoints, gap)).toStrictEqual(
    expect.objectContaining({
      fullStyles: {
        gridItem: {
          [`@media (min-width: ${breakpoints.xxl}px)`]: {
            width: '25%',
          },
          [`@media (min-width: ${breakpoints.md}px)`]: {
            width: '33.333333333333336%',
          },
          [`@media (min-width: ${breakpoints.sm}px)`]: {
            width: '50%',
          },
          padding: 6,
          width: '100%',
        },
      },
      styles: {
        gridItem: {
          padding: 6,
          width: '50%',
        },
      },
    })
  )
})

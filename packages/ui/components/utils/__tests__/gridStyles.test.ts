import { createGridStyles, createResponsiveWidth, defaultGridBreakpoints } from '@holi/ui/components/utils/gridStyles'
import { dimensions } from '@holi/ui/styles/globalVars'

const gridBreakpoints: [number, number][] = [
  [0, 1],
  [dimensions.breakpointS, 2],
  [dimensions.breakpointM, 3],
  [dimensions.breakpointXxl, 4],
]

it('should create responsive widths', () => {
  expect(createResponsiveWidth(defaultGridBreakpoints)).toStrictEqual({
    width: '100%',
    [`@media (min-width: ${dimensions.breakpointL}px)`]: {
      width: '50%',
    },
  })

  expect(createResponsiveWidth(gridBreakpoints)).toStrictEqual({
    width: '100%',
    [`@media (min-width: ${dimensions.breakpointXxl}px)`]: {
      width: '25%',
    },
    [`@media (min-width: ${dimensions.breakpointM}px)`]: {
      width: '33.333333333333336%',
    },
    [`@media (min-width: ${dimensions.breakpointS}px)`]: {
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
          [`@media (min-width: ${dimensions.breakpointL}px)`]: {
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
          [`@media (min-width: ${dimensions.breakpointXxl}px)`]: {
            width: '25%',
          },
          [`@media (min-width: ${dimensions.breakpointM}px)`]: {
            width: '33.333333333333336%',
          },
          [`@media (min-width: ${dimensions.breakpointS}px)`]: {
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

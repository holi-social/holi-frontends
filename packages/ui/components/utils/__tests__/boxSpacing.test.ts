import { expect, it } from '@jest/globals'

import { BoundingBoxSpace, BoxSpace, TupleBoxSpace, createBoxPadding } from '@holi/ui/components/utils/boxSpacing'

it('should return null if the input is not a BoxSpace', () => {
  expect(createBoxPadding('4' as unknown as BoxSpace)).toBeNull()
})

it('should return a shorthand padding of 4', () => {
  expect(createBoxPadding(4)).toMatchInlineSnapshot(`
    {
      "boxPadding": {
        "padding": 4,
      },
    }
  `)
})

type CaseTupleBox = [
  TupleBoxSpace,
  {
    boxPadding: {
      paddingVertical?: number
      paddingHorizontal?: number
    }
  },
][]

// In the case tuple the first element is the input the second one is the expected result
const caseTupleBoxSpace = [
  [
    [1, 2],
    {
      boxPadding: {
        paddingVertical: 1,
        paddingHorizontal: 2,
      },
    },
  ],
  [
    [0, 2],
    {
      boxPadding: {
        paddingHorizontal: 2,
      },
    },
  ],
  [
    [1, 0],
    {
      boxPadding: {
        paddingVertical: 1,
      },
    },
  ],
  [
    [0, 0],
    {
      boxPadding: {},
    },
  ],
] as CaseTupleBox

it.each(caseTupleBoxSpace)(
  'should return a tuple box padding based in the input %p TupleBoxSpace',
  (tupleBoxSpace, expected) => {
    const result = createBoxPadding(tupleBoxSpace as TupleBoxSpace)
    expect(result).toEqual(expected)
  }
)

type CaseBoundingBox = [
  BoundingBoxSpace,
  {
    boxPadding: {
      paddingTop?: number
      paddingRight?: number
      paddingBottom?: number
      paddingLeft?: number
    }
  },
][]

// In the case tuple the first element is the input the second one is the expected result
const caseBoundingBoxSpace = [
  [
    [1, 2, 3, 4],
    {
      boxPadding: {
        paddingTop: 1,
        paddingRight: 2,
        paddingBottom: 3,
        paddingLeft: 4,
      },
    },
  ],
  [
    [0, 2, 3, 4],
    {
      boxPadding: {
        paddingRight: 2,
        paddingBottom: 3,
        paddingLeft: 4,
      },
    },
  ],
  [
    [0, 2, 0, 4],
    {
      boxPadding: {
        paddingRight: 2,
        paddingLeft: 4,
      },
    },
  ],
  [
    [0, 0, 0, 4],
    {
      boxPadding: {
        paddingLeft: 4,
      },
    },
  ],
  [[0, 0, 0, 0], { boxPadding: {} }],
] as CaseBoundingBox

it.each(caseBoundingBoxSpace)(
  'should return a bounding box padding based in the input %p BoundingBoxSpace',
  (boundingBoxSpace, expected) => {
    const result = createBoxPadding(boundingBoxSpace)
    expect(result).toEqual(expected)
  }
)

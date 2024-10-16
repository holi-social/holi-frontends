import { PixelRatio, Platform } from 'react-native'

import { setScalingParams, transformSourcesURL } from '@holi/ui/components/atoms/HoliImage/resizing'
import { ImageSource } from '@holi/ui/components/atoms/HoliImage/types'

function numberFrom(trParam: string | null): number | null {
  if (trParam) {
    const onlyDigits = trParam.match(/\d/g)
    if (onlyDigits && onlyDigits?.length > 0) {
      return parseInt(onlyDigits.join(''), 10)
    }
  }
  return null
}

function isPositiveInteger(n: number | null): boolean | null {
  if (n != null) {
    return Number.isInteger(n) && n >= 0
  }
  return null
}

it('should set a width based on s 2 pixel density as query param', () => {
  const pxr = PixelRatio.get()
  const width = 50
  const result = `w-${width * pxr}`
  const source: ImageSource = {
    uri: 'https://ik.imagekit.io/demo/medium_cafe_B1iTdD0C.jpg',
    width,
  }

  const { uri } = setScalingParams(source)
  const url = new URL(uri ?? '')
  const trParam = url.searchParams.get('tr')
  expect(trParam).toBe(result)
  expect(isPositiveInteger(numberFrom(trParam))).toBe(true)
})

it('should set the height based on s 2 pixel density as a query param', () => {
  const pxr = PixelRatio.get()
  const height = 1000
  const result = `h-${height * pxr}`

  const source: ImageSource = {
    uri: 'https://ik.imagekit.io/demo/medium_cafe_B1iTdD0C.jpg',
    height,
  }

  const { uri } = setScalingParams(source)
  const url = new URL(uri ?? '')
  const trParam = url.searchParams.get('tr')
  expect(trParam).toBe(result)
  expect(isPositiveInteger(numberFrom(trParam))).toBe(true)
})

it('should set width and height based on s 2 pixel density as a query param', () => {
  const pxr = PixelRatio.get()
  const width = 100
  const height = 150
  const result = `w-${width * pxr},h-${height * pxr}`

  const source: ImageSource = {
    uri: 'https://ik.imagekit.io/demo/medium_cafe_B1iTdD0C.jpg',
    width,
    height,
  }
  const { uri } = setScalingParams(source)
  const url = new URL(uri ?? '')
  const trParam = url.searchParams.get('tr')
  expect(trParam).toBe(result)
  trParam?.split(',').forEach((param) => {
    expect(isPositiveInteger(numberFrom(param))).toBe(true)
  })
})

it('should transform an array of sources  based on s 2 pixel density', () => {
  const sources = [
    {
      uri: 'https://ik.imagekit.io/demo/one.jpg',
      width: 50,
      height: 1000,
    },
    {
      uri: 'https://ik.imagekit.io/demo/two.jpg',
      width: 5000,
    },
    {
      uri: 'https://ik.imagekit.io/demo/three.jpg',
      height: 200,
    },
  ] as ImageSource[]

  expect(transformSourcesURL(sources)).toMatchInlineSnapshot(`
    [
      {
        "height": 1000,
        "uri": "https://ik.imagekit.io/demo/one.jpg?tr=w-100%2Ch-2000",
        "width": 50,
      },
      {
        "uri": "https://ik.imagekit.io/demo/two.jpg?tr=w-10000",
        "width": 5000,
      },
      {
        "height": 200,
        "uri": "https://ik.imagekit.io/demo/three.jpg?tr=h-400",
      },
    ]
  `)
})

it('should set whole numbers for width and height in resulting url for strange device pixel ratio', () => {
  const pxr = PixelRatio.get()
  const height = 73
  const resultMobile = `h-${height * pxr}`
  const resultWeb = `h-${height * 3}`
  const platformsToTest: ('ios' | 'android' | 'windows' | 'macos' | 'web')[] = ['ios', 'android', 'web']
  const defaultPlatform = Platform.OS
  const source: ImageSource = {
    uri: 'https://ik.imagekit.io/demo/medium_cafe_B1iTdD0C.jpg',
    height,
  }
  window.devicePixelRatio = 2.7
  platformsToTest.forEach((platform) => {
    Platform.OS = platform
    const { uri } = setScalingParams(source)
    const url = new URL(uri ?? '')
    const trParam = url.searchParams.get('tr')
    expect(trParam).toBe(platform === 'web' ? resultWeb : resultMobile)
    expect(isPositiveInteger(numberFrom(trParam))).toBe(true)
  })
  Platform.OS = defaultPlatform
})

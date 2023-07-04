import { ImageURISource, PixelRatio } from 'react-native'

import { setImageKitParams, transformSourcesURL } from '@holi/ui/components/atoms/HoliImage/image'
import { ImageSource } from '@holi/ui/components/atoms/HoliImage/types'

it('should set a width based on s 2 pixel density as query param', () => {
  const pxr = PixelRatio.get()
  const width = 50
  const result = `w-${width * pxr}`
  const source: ImageURISource = {
    uri: 'https://ik.imagekit.io/demo/medium_cafe_B1iTdD0C.jpg',
    width,
  }

  const { uri } = setImageKitParams(source)
  const url = new URL(uri ?? '')
  expect(url.searchParams.get('tr')).toBe(result)
})

it('should set the height based on s 2 pixel density as a query param', () => {
  const pxr = PixelRatio.get()
  const height = 1000
  const result = `h-${height * pxr}`

  const source: ImageURISource = {
    uri: 'https://ik.imagekit.io/demo/medium_cafe_B1iTdD0C.jpg',
    height,
  }

  const { uri } = setImageKitParams(source)
  const url = new URL(uri ?? '')
  expect(url.searchParams.get('tr')).toBe(result)
})

it('should set width and height based on s 2 pixel density as a query param', () => {
  const pxr = PixelRatio.get()
  const width = 100
  const height = 150
  const result = `w-${width * pxr},h-${height * pxr}`

  const source: ImageURISource = {
    uri: 'https://ik.imagekit.io/demo/medium_cafe_B1iTdD0C.jpg',
    width,
    height,
  }
  const { uri } = setImageKitParams(source)
  const url = new URL(uri ?? '')
  expect(url.searchParams.get('tr')).toBe(result)
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

import { ImageURISource } from 'react-native'

import { ImageSource, setImageKitParams, transformSourcesURL } from '@holi/ui/components/utils/image'

it('should set width as query param', () => {
  const width = 50
  const result = `w-${width}`
  const source: ImageURISource = {
    uri: 'https://ik.imagekit.io/demo/medium_cafe_B1iTdD0C.jpg',
    width,
  }

  const { uri } = setImageKitParams(source)
  const url = new URL(uri ?? '')
  expect(url.searchParams.get('tr')).toBe(result)
})

it('should set the height as a query param', () => {
  const height = 1000
  const result = `h-${height}`

  const source: ImageURISource = {
    uri: 'https://ik.imagekit.io/demo/medium_cafe_B1iTdD0C.jpg',
    height,
  }

  const { uri } = setImageKitParams(source)
  const url = new URL(uri ?? '')
  expect(url.searchParams.get('tr')).toBe(result)
})

it('should set width and height as a query param', () => {
  const width = 100
  const height = 150
  const result = `w-${width},h-${height}`

  const source: ImageURISource = {
    uri: 'https://ik.imagekit.io/demo/medium_cafe_B1iTdD0C.jpg',
    width,
    height,
  }
  const { uri } = setImageKitParams(source)
  const url = new URL(uri ?? '')
  expect(url.searchParams.get('tr')).toBe(result)
})

it('should transform an array of sources', () => {
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
        "uri": "https://ik.imagekit.io/demo/one.jpg?tr=w-50%2Ch-1000",
        "width": 50,
      },
      {
        "uri": "https://ik.imagekit.io/demo/two.jpg?tr=w-5000",
        "width": 5000,
      },
      {
        "height": 200,
        "uri": "https://ik.imagekit.io/demo/three.jpg?tr=h-200",
      },
    ]
  `)
})

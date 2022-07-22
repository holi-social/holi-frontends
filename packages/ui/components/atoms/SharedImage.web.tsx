import Image from 'next/image'
import React from 'react'
import { StyleSheet } from 'react-native'

// Usage:

// import PngLogo from '@holi/ui/assets/img/logo/logo.svg'
// <SharedImage imageFile={PngLogo.src} style={{ width: 50, height: 50 }} altText="some alt text" />
// or
// <SharedImage imageFile={require('@holi/ui/assets/img/logo/logo.svg')} style={{ width: 50, height: 50 }} altText="some alt text" />

// TODO: intermediate fix until
// https://github.com/vercel/next.js/issues/29788
type StaticImageData = {
  src?: string
  height?: number
  width?: number
  blurDataURL?: string
  default?: { src: string }
}

type SharedImageProps = {
  imageFile: StaticImageData
  isSvg?: boolean
  altText: string
  style?: { width: number; height: number }
}

const SharedImage: React.VoidFunctionComponent<SharedImageProps> = ({
  imageFile,
  style,
  altText,
}: SharedImageProps) => {
  const pathFromRequire = imageFile.src
  const pathFromImport = imageFile.default?.src
  const path = pathFromRequire || pathFromImport
  const { width = 50, height = 50 } = StyleSheet.flatten(style)

  // https://github.com/vercel/next.js/discussions/18312
  return <Image src={path as string} alt={altText} width={width} height={height} />
}

export default SharedImage

import Image from 'next/image'
import React from 'react'
import { StyleSheet } from 'react-native'

// Usage:

// import PngLogo from '@holi/ui/assets/img/logo/logo.svg'
// <SharedImage imageFile={PngLogo.src} style={{ width: 50, height: 50 }} />
// or
// <SharedImage imageFile={require('@holi/ui/assets/img/logo/logo.svg')} style={{ width: 50, height: 50 }} />

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
  altText?: string
  style?: { width: number; height: number }
}

const SharedImage: React.VoidFunctionComponent<SharedImageProps> = (props: SharedImageProps) => {
  const pathFromRequire = props.imageFile && props.imageFile.src
  const pathFromImport = props.imageFile && props.imageFile.default && props.imageFile.default.src
  const path = pathFromRequire || pathFromImport

  const styles = StyleSheet.flatten(props.style)

  const width = styles && styles.width ? styles.width : 50
  const height = styles && styles.height ? styles.height : 50

  // https://github.com/vercel/next.js/discussions/18312
  return <Image className={'uschi'} src={path as string} alt={props.altText} width={width} height={height} />
}

export default SharedImage

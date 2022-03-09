import React from 'react'
import Image from 'next/image'

// Usage:

// import PngLogo from 'shared/assets/img/logo/logo.svg'
// <SharedImage imageFile={PngLogo.src} style={{ width: 50, height: 50 }} />
// or
// <SharedImage imageFile={require('shared/assets/img/logo/logo.svg')} style={{ width: 50, height: 50 }} />

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
  style?: object
}

const SharedImage: React.VoidFunctionComponent<SharedImageProps> = (
  props: SharedImageProps
) => {
  const pathFromRequire = props.imageFile && props.imageFile.src
  const pathFromImport =
    props.imageFile && props.imageFile.default && props.imageFile.default.src
  const path = pathFromRequire || pathFromImport

  return <Image className={'uschi'} src={path as string} alt={props.altText} width="50" height="50"  />
}

export default SharedImage

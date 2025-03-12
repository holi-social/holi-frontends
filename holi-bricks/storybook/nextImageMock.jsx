import React from 'react'

const NextImage = (props) => {
  const { src, alt, width, height, ...rest } = props
  return <img src={src} alt={alt} width={width} height={height} {...rest} />
}

export default NextImage

import Error from 'next/error'
import React from 'react'

const NotFound: React.VFC = () => {
  return <Error statusCode={404} />
}

export default NotFound

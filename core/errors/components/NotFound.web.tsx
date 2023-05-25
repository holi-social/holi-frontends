import Error from 'next/error'
import React from 'react'

const NotFound = () => {
  return <Error statusCode={404} />
}

export default NotFound

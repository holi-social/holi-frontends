import * as React from 'react'
import Svg, { Path } from 'react-native-svg'
const SvgStarFill = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" {...props}>
    <Path
      fill="currentColor"
      d="m11.999 18.26-7.053 3.948L6.52 14.28.586 8.792l8.027-.952L11.999.5l3.386 7.34 8.027.952-5.935 5.488 1.575 7.928z"
    />
  </Svg>
)
export default SvgStarFill

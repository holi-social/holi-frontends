import * as React from 'react'
import Svg, { Path } from 'react-native-svg'
const SvgCheck = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" {...props}>
    <Path fill="currentColor" d="m10 15.172 9.193-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z" />
  </Svg>
)
export default SvgCheck

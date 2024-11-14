import * as React from 'react'
import Svg, { Path } from 'react-native-svg'
const SvgAdd = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" {...props}>
    <Path fill="currentColor" d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2z" />
  </Svg>
)
export default SvgAdd

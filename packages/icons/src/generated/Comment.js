import * as React from 'react'
import Svg, { Path } from 'react-native-svg'
const SvgComment = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" viewBox="0 0 24 25" {...props}>
    <Path
      fill="#8A8989"
      d="M14.45 19.96 12 23.46l-2.45-3.5H3a1 1 0 0 1-1-1v-14a1 1 0 0 1 1-1h18a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1zm-1.041-2H20v-12H4v12h6.591L12 19.974z"
    />
  </Svg>
)
export default SvgComment

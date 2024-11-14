import * as React from 'react'
import Svg, { G, Path, Defs, ClipPath } from 'react-native-svg'
const SvgPages = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" {...props}>
    <G clipPath="url(#pages_svg__a)">
      <Path
        fill="currentColor"
        d="M5 8v12h14V8zm0-2h14V4H5zm15 16H4a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1M7 10h4v4H7zm0 6h10v2H7zm6-5h4v2h-4z"
      />
    </G>
    <Defs>
      <ClipPath id="pages_svg__a">
        <Path fill="#fff" d="M0 0h24v24H0z" />
      </ClipPath>
    </Defs>
  </Svg>
)
export default SvgPages

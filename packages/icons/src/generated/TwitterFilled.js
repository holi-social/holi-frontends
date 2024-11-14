import * as React from 'react'
import Svg, { G, Path, Defs, ClipPath } from 'react-native-svg'
const SvgTwitterFilled = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" {...props}>
    <G clipPath="url(#twitter-filled_svg__a)">
      <Path
        fill="currentColor"
        d="M22.16 5.656a8.4 8.4 0 0 1-2.402.658A4.2 4.2 0 0 0 21.598 4c-.82.488-1.719.83-2.656 1.015a4.182 4.182 0 0 0-7.126 3.814 11.87 11.87 0 0 1-8.62-4.37 4.17 4.17 0 0 0-.566 2.103c0 1.45.738 2.73 1.86 3.48a4.2 4.2 0 0 1-1.894-.522v.052a4.185 4.185 0 0 0 3.355 4.1 4.2 4.2 0 0 1-1.89.073 4.185 4.185 0 0 0 3.907 2.905 8.4 8.4 0 0 1-6.19 1.732 11.83 11.83 0 0 0 6.41 1.88c7.692 0 11.9-6.373 11.9-11.9q-.001-.272-.014-.54a8.5 8.5 0 0 0 2.087-2.165z"
      />
    </G>
    <Defs>
      <ClipPath id="twitter-filled_svg__a">
        <Path fill="#fff" d="M0 0h24v24H0z" />
      </ClipPath>
    </Defs>
  </Svg>
)
export default SvgTwitterFilled

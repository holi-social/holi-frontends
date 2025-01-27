import * as React from 'react'
import Svg, { G, Path, Defs, ClipPath } from 'react-native-svg'
const SvgAppsFilled = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}>
    <G clipPath="url(#apps-filled_svg__a)">
      <Path
        fill="currentColor"
        d="M7 11.5a4.5 4.5 0 1 1 0-9.002A4.5 4.5 0 0 1 7 11.5m0 10a4.5 4.5 0 1 1 0-9 4.5 4.5 0 0 1 0 9m10-10a4.501 4.501 0 0 1-1.722-8.657A4.5 4.5 0 1 1 17 11.5m0 10a4.5 4.5 0 1 1 0-9 4.5 4.5 0 0 1 0 9"
      />
    </G>
    <Defs>
      <ClipPath id="apps-filled_svg__a">
        <Path fill="#fff" d="M0 0h24v24H0z" />
      </ClipPath>
    </Defs>
  </Svg>
)
export default SvgAppsFilled

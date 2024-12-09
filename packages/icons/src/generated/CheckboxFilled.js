import * as React from 'react'
import Svg, { G, Path, Defs, ClipPath } from 'react-native-svg'
const SvgCheckboxFilled = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}>
    <G clipPath="url(#checkbox-filled_svg__a)">
      <Path
        fill="currentColor"
        d="M4 3h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1m7.003 13 7.07-7.071-1.414-1.414-5.656 5.657-2.829-2.829-1.414 1.414z"
      />
    </G>
    <Defs>
      <ClipPath id="checkbox-filled_svg__a">
        <Path fill="#fff" d="M0 0h24v24H0z" />
      </ClipPath>
    </Defs>
  </Svg>
)
export default SvgCheckboxFilled

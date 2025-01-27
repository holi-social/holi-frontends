import * as React from 'react'
import Svg, { G, Path, Defs, ClipPath } from 'react-native-svg'
const SvgToolsFilled = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}>
    <G clipPath="url(#tools-filled_svg__a)">
      <Path
        fill="currentColor"
        d="M5.33 3.27a3.5 3.5 0 0 1 4.472 4.475L20.647 18.59l-2.122 2.12L7.68 9.868a3.5 3.5 0 0 1-4.472-4.474L5.444 7.63a1.5 1.5 0 1 0 2.12-2.121L5.33 3.269zm10.367 1.885 3.182-1.768L20.293 4.8l-1.768 3.182-1.768.354-2.12 2.12-1.415-1.413 2.12-2.121zm-7.071 7.778 2.12 2.122-4.95 4.95A1.5 1.5 0 0 1 3.58 17.99l.097-.107z"
      />
    </G>
    <Defs>
      <ClipPath id="tools-filled_svg__a">
        <Path fill="#fff" d="M0 0h24v24H0z" />
      </ClipPath>
    </Defs>
  </Svg>
)
export default SvgToolsFilled

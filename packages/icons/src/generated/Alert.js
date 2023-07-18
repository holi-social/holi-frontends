import * as React from 'react'
import Svg, { ClipPath, Defs, G, Path } from 'react-native-svg'

const SvgAlert = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}>
    <G clipPath="url(#alert_svg__a)">
      <Path
        fill="currentColor"
        d="m12.865 3 9.526 16.5a1 1 0 0 1-.866 1.5H2.473a1 1 0 0 1-.866-1.5L11.133 3a1 1 0 0 1 1.732 0Zm-8.66 16h15.588L11.999 5.5 4.205 19Zm6.794-3h2v2h-2v-2Zm0-7h2v5h-2V9Z"
      />
    </G>
    <Defs>
      <ClipPath id="alert_svg__a">
        <Path fill="#fff" d="M0 0h24v24H0z" />
      </ClipPath>
    </Defs>
  </Svg>
)
export default SvgAlert

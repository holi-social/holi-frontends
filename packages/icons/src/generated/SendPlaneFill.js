import * as React from 'react'
import Svg, { G, Path, Defs, ClipPath } from 'react-native-svg'
const SvgSendPlaneFill = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" {...props}>
    <G clipPath="url(#send-plane-fill_svg__a)">
      <Path
        fill="currentColor"
        d="M.947 10.315C.425 10.14.42 9.86.957 9.68l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.68.045L11.002 15l6-8-8 6z"
      />
    </G>
    <Defs>
      <ClipPath id="send-plane-fill_svg__a">
        <Path fill="#fff" d="M0 0h24v24H0z" />
      </ClipPath>
    </Defs>
  </Svg>
)
export default SvgSendPlaneFill

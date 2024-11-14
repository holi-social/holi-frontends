import * as React from 'react'
import Svg, { G, Path, Defs, ClipPath } from 'react-native-svg'
const SvgSendPlane = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" {...props}>
    <G clipPath="url(#send-plane_svg__a)">
      <Path
        fill="currentColor"
        d="M.77 8.642c-.426-.17-.42-.425.027-.574l15.906-5.302c.44-.147.693.1.57.532l-4.546 15.905c-.125.44-.395.46-.597.058l-3.797-7.594zm4.074-.167 4.697 1.88 2.533 5.068L15.03 5.08z"
      />
    </G>
    <Defs>
      <ClipPath id="send-plane_svg__a">
        <Path fill="#fff" d="M0 0h20v20H0z" />
      </ClipPath>
    </Defs>
  </Svg>
)
export default SvgSendPlane

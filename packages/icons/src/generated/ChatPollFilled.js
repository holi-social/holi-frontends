import * as React from 'react'
import Svg, { G, Path, Defs, ClipPath } from 'react-native-svg'
const SvgChatPollFilled = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" {...props}>
    <G clipPath="url(#chat-poll-filled_svg__a)">
      <Path
        fill="currentColor"
        d="M21 3a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H6.455L2 22.5V4a1 1 0 0 1 1-1zm-8 4h-2v8h2zm4 2h-2v6h2zm-8 2H7v4h2z"
      />
    </G>
    <Defs>
      <ClipPath id="chat-poll-filled_svg__a">
        <Path fill="#fff" d="M0 0h24v24H0z" />
      </ClipPath>
    </Defs>
  </Svg>
)
export default SvgChatPollFilled

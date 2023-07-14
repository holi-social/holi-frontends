import * as React from 'react'
import Svg, { ClipPath, Defs, G, Path } from 'react-native-svg'

const SvgChatPollFilled = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}>
    <G clipPath="url(#chat-poll-filled_svg__a)">
      <Path
        fill="currentColor"
        d="M21 3a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H6.455L2 22.5V4a1 1 0 0 1 1-1h18Zm-8 4h-2v8h2V7Zm4 2h-2v6h2V9Zm-8 2H7v4h2v-4Z"
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

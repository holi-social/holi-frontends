import * as React from 'react'
const SvgChatHeart = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}>
    <g clipPath="url(#chat-heart_svg__a)">
      <path
        fill="currentColor"
        d="M6.455 19 2 22.5V4a1 1 0 0 1 1-1h18a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1zM4 18.385 5.763 17H20V5H4zm8.018-3.685-3.359-3.36a2.25 2.25 0 0 1 3.182-3.182l.177.177.177-.177a2.25 2.25 0 1 1 3.182 3.182l-3.36 3.359z"
      />
    </g>
    <defs>
      <clipPath id="chat-heart_svg__a">
        <path fill="#fff" d="M0 0h24v24H0z" />
      </clipPath>
    </defs>
  </svg>
)
export default SvgChatHeart

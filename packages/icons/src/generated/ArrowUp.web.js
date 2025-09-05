import * as React from 'react'
const SvgArrowUp = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}>
    <g clipPath="url(#arrow-up_svg__a)">
      <path fill="currentColor" d="M13 7.828V20h-2V7.828l-5.363 5.364-1.414-1.414L12 4l7.778 7.778-1.414 1.414z" />
    </g>
    <defs>
      <clipPath id="arrow-up_svg__a">
        <path fill="#fff" d="M0 0h24v24H0z" />
      </clipPath>
    </defs>
  </svg>
)
export default SvgArrowUp

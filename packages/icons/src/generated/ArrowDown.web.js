import * as React from 'react'
const SvgArrowDown = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}>
    <g clipPath="url(#arrow-down_svg__a)">
      <path fill="currentColor" d="m13 16.172 5.365-5.364 1.414 1.414L12 20l-7.778-7.778 1.414-1.414L11 16.172V4h2z" />
    </g>
    <defs>
      <clipPath id="arrow-down_svg__a">
        <path fill="#fff" d="M0 0h24v24H0z" />
      </clipPath>
    </defs>
  </svg>
)
export default SvgArrowDown

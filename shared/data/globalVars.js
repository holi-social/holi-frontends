// use scss variables in JS for mobile styling

// https://riptutorial.com/webpack/topic/6534/loaders
// import sassVariables from '!!sass-vars-to-js-loader!./_variables.scss';
// const sassVariables = require('sass-vars-to-js-loader!./_variables.scss')
const dummySassVars = {
  primaryColor: {
    rgba: '#ff2d55',
  },
  fontColor: {
    rgba: '#1c1c1e'
  },
  borderColor: {
    rgba: '#e7e6e6'
  },
  buttonBorderColor: {
    rgba: '#fdb0c1'
  },
}


const jsVars = {
  CSS_BUTTON_CLASS: 'holi-button',
}

const styleVars = {
  ...dummySassVars,
}

export {
  styleVars,
  jsVars,
}

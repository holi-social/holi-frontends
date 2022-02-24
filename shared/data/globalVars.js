// use scss variables in JS for mobile styling

// https://riptutorial.com/webpack/topic/6534/loaders
// import sassVariables from '!!sass-vars-to-js-loader!./_variables.scss';
// const sassVariables = require('sass-vars-to-js-loader!./_variables.scss')
// import sassLoader from 'sass-vars-to-js-loader';
const sassVariables = {
  buttonBorderColor: {
    rgb: 'red'
  }
}



const jsVars = {
  CSS_BUTTON_CLASS: 'holi-button',
}

const styleVars = {
  ...sassVariables,
}

export {
  styleVars,
  jsVars,
}

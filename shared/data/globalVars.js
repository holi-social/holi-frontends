// use scss variables in JS for mobile styling
import sassVariables from '!!sass-vars-to-js-loader!./_variables.scss';


const jsVars = {
  CSS_BUTTON_CLASS: 'holi-button',
}

const styleVars = {
  ...sassVariables,
}

export {
  styleVars,
  jsVars,
};

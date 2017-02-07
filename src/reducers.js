import { combineReducers } from 'redux'
import { loadDefault } from './config/conf'

const assign = Object.assign //|| require('object.assign');

const APP_INITIAL = loadDefault();

const app = (state = APP_INITIAL, action) => {
  switch (action.type) {
    
    case "APP_DATA":
      return assign({}, state, {
        [action.key]: action.data
      });

    default:
      return state;
  }
}

const rootReducer = combineReducers({
  app
})

export default rootReducer
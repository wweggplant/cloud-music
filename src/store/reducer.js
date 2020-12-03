import { combineReducers } from 'redux-immutable'
import { reducer as recommendReducer } from '../application/Recommend/store'
import { reducer as singersReducer } from '../application/Singers/store';
import { reducer as rankReducer } from '../application/Rank/store';
export default combineReducers({
  recommend: recommendReducer,
  singers: singersReducer,
  rank: rankReducer
})
// const reducers = require.context('../application', true, /reducer\.js$/);
// const filterReducers = {};
// reducers
//   .keys()
//   .forEach(item => {
//     console.log(item)
//     const key = item.replace(/\.\/(\w+)\.js/g, '$1');
//     filterReducers[key] = require(`./application/**/store/reducers`).default;
//   });
// // 聚合reducer
// export default combineReducers({
//   ...filterReducers
// });
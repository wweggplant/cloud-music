import { combineReducers } from 'redux-immutable'
import { reducer as recommendReducer } from '../application/Recommend/store'
import { reducer as singersReducer } from '../application/Singers/store';
import { reducer as rankReducer } from '../application/Rank/store';
import { reducer as albumReducer } from '../application/Album/store';
import { reducer as playerReducer } from '../application/Player/store';
import { reducer as singerInfoReducer } from "../application/Singer/store/index";
import { reducer as searchReducer } from "../application/Search/store/index";

export default combineReducers({
  recommend: recommendReducer,
  singerInfo: singerInfoReducer,
  singers: singersReducer,
  rank: rankReducer,
  album: albumReducer,
  search: searchReducer,
  player: playerReducer
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
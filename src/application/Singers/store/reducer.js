import * as actionTypes from './constants';
import { fromJS } from 'immutable';

const defaultState = fromJS({
  singerList: [],
  enterLoading: true,     //控制进场Loading
  pullUpLoading: false,   //控制上拉加载动画
  pullDownLoading: false, //控制下拉加载动画
  pageCount: 0,            //这里是当前页数，我们即将实现分页功能
  type: actionTypes.INIT_TYPE, //初始的type值
  area: actionTypes.INIT_AREA  //初始的area值
});

export default (state = defaultState, action) => {
  switch(action.type) {
    case actionTypes.CHANGE_SINGER_LIST:
      return state.set('singerList', action.data);
    case actionTypes.CHANGE_PAGE_COUNT:
      return state.set('pageCount', action.data);
    case actionTypes.CHANGE_ENTER_LOADING:
      return state.set('enterLoading', action.data);
    case actionTypes.CHANGE_PULLUP_LOADING:
      return state.set('pullUpLoading', action.data);
    case actionTypes.CHANGE_PULLDOWN_LOADING:
      return state.set('pullDownLoading', action.data);
    case actionTypes.CHANGE_QUEST_PARAMS:
      return state.set('type', action.data.type).set('area', action.data.area)
    default:
      return state;
  }
}
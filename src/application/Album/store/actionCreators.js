import {
  getAlbumDetailRequest
} from "../../../api/request";
import {
  CHANGE_CURRENT_ALBUM,
  CHANGE_ENTER_LOADING
} from './constants';
import {
  fromJS
} from 'immutable';


//进场loading
export const changeEnterLoading = (data) => ({
  type: CHANGE_ENTER_LOADING,
  data
});


const changeCurrentAlbum = (data) => ({
  type: CHANGE_CURRENT_ALBUM,
  data: fromJS (data)
});

export const getAlbumList = (id) => {
  return dispatch => {
    dispatch(changeEnterLoading(true))
    getAlbumDetailRequest(id).then(data => {
      let playlist = data.playlist
      dispatch(changeEnterLoading(false))
      dispatch(changeCurrentAlbum(playlist))
    })
  }
}
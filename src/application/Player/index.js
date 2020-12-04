import React, { useRef } from 'react'
import { connect } from "react-redux";
import {changeCurrentSong,
  changeFullScreen,
  changePlayingState,
  changePlayList,
  changePlayMode,
  changeCurrentIndex,
  changeShowPlayList
} from "./store/actionCreators";
import MiniPlayer from './miniPlayer';
import NormalPlayer from './normalPlayer';


function Player(props) {
  const currentSong = {
    al: { picUrl: "https://p1.music.126.net/JL_id1CFwNJpzgrXwemh4Q==/109951164172892390.jpg" },
    name: "木偶人",
    ar: [{name: "薛之谦"}]
  }
  const { fullScreen } = props
  const { toggleFullScreenDispatch } = props

  return (
    <>
      <MiniPlayer
        song={currentSong}
        fullScreen={fullScreen}
        toggleFullScreen={toggleFullScreenDispatch}
      ></MiniPlayer>
      <NormalPlayer
        song={currentSong}
        fullScreen={fullScreen}
        toggleFullScreen={toggleFullScreenDispatch}
      >
      </NormalPlayer>
    </>
  )
}
const mapStateToProps = (state) => ({
  rankList: state.getIn(['player', 'rankList']),
  fullScreen: state.getIn(['player', 'fullScreen']),
  playing: state.getIn(['player', 'playing']),
  sequencePlayList: state.getIn(['player', 'sequencePlayList']),
  playList: state.getIn(['player', 'playList']),
  mode: state.getIn(['player', 'mode']),
  currentIndex: state.getIn(['player', 'currentIndex']),
  showPlayList: state.getIn(['player', 'showPlayList']),
  currentSong: state.getIn(['player', 'currentSong']),
})
const mapDispatchToProps = dispatch => ({
  togglePlayingDispatch (data) {
    dispatch (changePlayingState (data));
  },
  toggleFullScreenDispatch (data) {
    dispatch (changeFullScreen (data));
  },
  togglePlayListDispatch (data) {
    dispatch (changeShowPlayList (data));
  },
  changeCurrentIndexDispatch (index) {
    dispatch (changeCurrentIndex (index));
  },
  changeCurrentDispatch (data) {
    dispatch (changeCurrentSong (data));
  },
  changeModeDispatch (data) {
    dispatch (changePlayMode (data));
  },
  changePlayListDispatch (data) {
    dispatch (changePlayList (data));
  }
})


export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Player))
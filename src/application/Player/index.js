import React, { useState, useRef, useEffect } from 'react'
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
import PlayList from './play-list';
import {getSongUrl, playMode,} from "../../api/config";
import {isEmptyObject, findIndex, shuffle} from "../../api/utils";
import Lyric from '../../api/lyric-parser'
import { getLyricRequest } from "./../../api/request";

function Player(props) {
  const { fullScreen, playing, currentIndex, mode, playList: immutablePlayList, sequencePlayList:immutableSequencePlayList, currentSong: immutableCurrentSong } = props
  const {
    toggleFullScreenDispatch,
    togglePlayingDispatch,
    changePlayListDispatch,//改变playList
    changeModeDispatch,//改变mode,
    changeCurrentIndexDispatch,
    togglePlayListDispatch,
    changeCurrentDispatch
  } = props
  const [currentTime, setCurrentTime] = useState(0);
  //歌曲总时长
  const [duration, setDuration] = useState(0);
  //歌曲播放进度
  let percent = isNaN(currentTime / duration) ? 0 : currentTime / duration;
  let currentSong = immutableCurrentSong.toJS();
  const playList = immutablePlayList.toJS();
  const sequencePlayList = immutableSequencePlayList.toJS();
  //记录当前的歌曲，以便于下次重渲染时比对是否是一首歌
  const [preSong, setPreSong] = useState({});
  const songReady = useRef (true);
  const audioRef = useRef()
  // 歌词处理
  const currentLyric = useRef(null)
  const currentLineNum = useRef(0);
  const [currentPlayingLyric, setPlayingLyric] = useState('')
  const getLyric = id => {
    let lyric = "";
    if (currentLyric.current) {
      currentLyric.current.stop()
    }
    getLyricRequest(id).then(data => {
      lyric = data.lrc.lyric;
      if (!lyric) {
        currentLyric.current = null;
        return
      }
      currentLyric.current = new Lyric(lyric, handleLyric)
      currentLyric.current.play()
      currentLineNum.current = 0
      currentLyric.current.seek (0);
    }).catch(() => {
      songReady.current = true;
      audioRef.current.play ();
    })
  }
  const handleLyric = ({lineNum, txt}) => {
    if (!currentLyric.current) return;
    currentLineNum.current = lineNum;
    setPlayingLyric(txt);
  }

  useEffect(() => {
    if (
        !playList.length ||
        currentIndex === -1 ||
        !playList[currentIndex] ||
        playList[currentIndex].id === preSong.id
    )
      return;
    const current = playList[currentIndex]
    changeCurrentDispatch(current)
    songReady.current = false
    setPreSong(current);
    audioRef.current.src = getSongUrl(current.id)
    setTimeout(() => {
      audioRef.current.play().then (() => {
        songReady.current = true;
      });
    });
    togglePlayingDispatch(true);//播放状态
    getLyric(current.id);// 获取歌词
    setCurrentTime(0);//从头开始播放
    setDuration((current.dt / 1000) | 0);//时长
  }, [currentIndex, playList])
  useEffect(() => {
    playing ? audioRef.current.play() : audioRef.current.pause()
  },[playing])
  const handleError = () => {
    songReady.current = true;
    alert ("播放出错");
  };
  const changeMode = () => {
    let newMode = (mode + 1) % 3;
    if (newMode === 0) {
      // 顺序播放
      changePlayListDispatch(sequencePlayList)
      let index = findIndex(currentSong, sequencePlayList);
      changeCurrentIndexDispatch(index);
    } else if(newMode === 1) {
      changePlayListDispatch(sequencePlayList);
    } else {
      let newList = shuffle(sequencePlayList);
      let index = findIndex(currentSong, newList);
      changePlayListDispatch(newList);
      changeCurrentIndexDispatch(index);
    }
    changeModeDispatch(newMode);
  }
  const clickPlaying = (e, state) => {
    e.stopPropagation();
    togglePlayingDispatch(state);
    if(currentLyric.current) {
      currentLyric.current.togglePlay(currentTime*1000)
    }
  };
  const percentChange = (curPercent) => {
    const newTime = curPercent * duration;
    setCurrentTime(newTime);
    audioRef.current.currentTime = newTime;
    if (!playing) {
      togglePlayingDispatch(true);
    }
    if(currentLyric.current) {
      currentLyric.current.seek(newTime*1000)
    }
  }
  const timeUpdate = (e) => {
    setCurrentTime(e.target.currentTime);
  }
  const handleLoop = () => {
    audioRef.current.currentTime = 0;
    changePlayingState(true)
    audioRef.current.play();
  }
  const handlePrev = () => {
    if (playList.length === 1) {
      handleLoop()
      return
    }
    let index = currentIndex - 1;
    if (index < 0) index = playList.length - 1;
    if (!playing) togglePlayingDispatch(true);
    changeCurrentIndexDispatch(index);
  }
  const handleNext = () => {
    if (playList.length === 1) {
      handleLoop()
      return
    }
    let index = currentIndex + 1;
    if (index === playList.length) index = 0;
    if (!playing) togglePlayingDispatch(true);
    changeCurrentIndexDispatch(index);
  }
  const handleEnd = () => {
    if (mode === playMode.loop) {
      handleLoop()
    } else {
      handleNext();
    }
  }
  return (
    <>
      { isEmptyObject(currentSong) ? null :
        <MiniPlayer
          percent={percent}
          song={currentSong}
          fullScreen={fullScreen}
          playing={playing}
          toggleFullScreen={toggleFullScreenDispatch}
          clickPlaying={clickPlaying}
          togglePlayList={togglePlayListDispatch}
        />
      }
      { isEmptyObject(currentSong) ? null :
        <NormalPlayer
          currentLineNum={currentLineNum.current}
          currentLyric={currentLyric.current}
          currentPlayingLyric={currentPlayingLyric}
          mode={mode}
          changeMode={changeMode}
          handlePrev={handlePrev}
          handleNext={handleNext}
          currentTime={currentTime}
          duration={duration}
          onProgressChange={percentChange}
          percent={percent}
          song={currentSong}
          fullScreen={fullScreen}
          playing={playing}
          toggleFullScreen={toggleFullScreenDispatch}
          clickPlaying={clickPlaying}
          togglePlayList={togglePlayListDispatch}
        />
      }
      <PlayList clearPreSong={setPreSong.bind(null, {})}></PlayList>
      <audio ref={audioRef} onTimeUpdate={timeUpdate} onEnded={handleEnd} onError={handleError}></audio>
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
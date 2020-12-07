import {connect} from "react-redux";
import {PlayListWrapper, ScrollWrapper, ListHeader, ListContent} from './style';
import {CSSTransition} from 'react-transition-group';
import React, {useRef, useState, useCallback} from 'react';
import {prefixStyle, getName} from './../../../api/utils';
import {changeShowPlayList, changeCurrentIndex, changePlayMode, changePlayList, deleteSong, changeSequecePlayList, changeCurrentSong
  ,changePlayingState} from "../store/actionCreators";
import {playMode} from "../../../api/config";
import Scroll from '../../../baseUI/scroll';
import Confirm from '../../../baseUI/confirm';
import {findIndex, shuffle} from "../../../api/utils";

const transform = prefixStyle("transform");

// 组件内代码
function PlayList(props) {
  const {
    currentIndex,
    currentSong: immutableCurrentSong,
    showPlayList,
    playList: immutablePlayList,
    mode,
    sequencePlayList: immutableSequencePlayList
  } = props;
  const {
    clearDispatch,
    togglePlayListDispatch,
    changeCurrentIndexDispatch,
    changePlayListDispatch,
    changeModeDispatch,
    deleteSongDispatch
  } = props;
  const currentSong = immutableCurrentSong.toJS();
  const playList = immutablePlayList.toJS();
  const sequencePlayList = immutableSequencePlayList.toJS();
  const [isShow, setIsShow] = useState(false);
  const [canTouch,setCanTouch] = useState (true);
  //touchStart 后记录 y 值
  const [startY, setStartY] = useState (0);
  //touchStart 事件是否已经被触发
  const [initialed, setInitialed] = useState (0);
  // 用户下滑的距离
  const [distance, setDistance] = useState (0);
  const playListRef = useRef();
  const listWrapperRef = useRef();
  const confirmRef = useRef();
  const listContentRef = useRef ();
  const onEnterCB = useCallback(() => {
    // 让列表显示
    setIsShow(true);
    // 最开始是隐藏在下面
    listWrapperRef.current.style[transform] = `translate3d(0, 100%, 0)`;
  }, []);

  const onEnteringCB = useCallback(() => {
    // 让列表展现
    listWrapperRef.current.style["transition"] = "all 0.3s";
    listWrapperRef.current.style[transform] = `translate3d(0, 0, 0)`;
  }, []);

  const onExitingCB = useCallback(() => {
    listWrapperRef.current.style["transition"] = "all 0.3s";
    listWrapperRef.current.style[transform] = `translate3d(0px, 100%, 0px)`;
  }, []);

  const onExitedCB = useCallback(() => {
    setIsShow(false);
    listWrapperRef.current.style[transform] = `translate3d(0px, 100%, 0px)`;
  }, []);
  const getCurrentIcon = (item) => {
    // 是不是当前正在播放的歌曲
    const current = currentSong.id === item.id;
    const className = current ? 'icon-play' : '';
    const content = current ? '&#xe6e3;': '';
    return (
        <i className={`current iconfont ${className}`} dangerouslySetInnerHTML={{__html:content}}></i>
    )
  };
  const handleConfirmClear = () => {
    clearDispatch ();
  }
  const handleShowClear = () => {
    confirmRef.current.show ();
  }
  const handleDeleteSong = (e, song) => {
    e.stopPropagation ();
    deleteSongDispatch (song);
  };
  const changeMode = () => {
    let newMode = (mode + 1)%3;
    if(newMode === 0){
      changePlayListDispatch(sequencePlayList);
      let index = findIndex(currentSong, sequencePlayList);
      changeCurrentIndexDispatch(index);
    }else if(newMode === 1){
      changePlayListDispatch(sequencePlayList);
    } else if(newMode === 2) {
      let newList = shuffle(sequencePlayList);
      let index = findIndex(currentSong, newList);
      changePlayListDispatch(newList);
      changeCurrentIndexDispatch(index);
    }
    changeModeDispatch(newMode);
  };
  const getPlayMode = (e) => {
    let content, text;
    let newMode = (mode + 1) % 3;
    if(mode === playMode.sequence) {
      content = "&#xe625;";
      text = "顺序播放";
    } else if(mode === playMode.loop) {
      content = "&#xe653;";
      text = "单曲循环";
    } else {
      content = "&#xe61b;";
      text = "随机播放";
    }
    return (
        <div>
          <i className="iconfont" onClick={(e) => changeMode(e)}  dangerouslySetInnerHTML={{__html: content}}></i>
          <span className="text" onClick={(e) => changeMode(e)}>{text}</span>
        </div>
    )
  };
  const handleScroll = (pos) => {
    let state = pos.y === 0;
    setCanTouch (state);
  }
  const handleChangeCurrentIndex = (index) =>{
    if (currentIndex === index) return;
    changeCurrentIndexDispatch (index);
    togglePlayListDispatch(false)
  }
  const handleTouchStart = (e) => {
    if (!canTouch || initialed) return;
    listWrapperRef.current.style["transition"] = "";
    setStartY (e.nativeEvent.touches[0].pageY);// 记录 y 值
    setInitialed (true);
  };
  const handleTouchMove = (e) => {
    if (!canTouch || !initialed) return;
    let distance = e.nativeEvent.touches[0].pageY - startY;
    if (distance < 0) return;
    setDistance (distance);// 记录下滑距离
    listWrapperRef.current.style.transform = `translate3d (0, ${distance} px, 0)`;
  };
  const handleTouchEnd = (e) => {
    setInitialed (false);
    // 这里设置阈值为 150px
    if (distance >= 150) {
      // 大于 150px 则关闭 PlayList
      togglePlayListDispatch (false);
    } else {
      // 否则反弹回去
      listWrapperRef.current.style["transition"] = "all 0.3s";
      listWrapperRef.current.style[transform] = `translate3d (0px, 0px, 0px)`;
    }
  };
  return (
      <CSSTransition
          in={showPlayList}
          timeout={300}
          classNames="list-fade"
          onEnter={onEnterCB}
          onEntering={onEnteringCB}
          onExiting={onExitingCB}
          onExited={onExitedCB}
      >
        <PlayListWrapper
            ref={playListRef}
            style={isShow === true ? {display: "block"} : {display: "none"}}
            onClick={() => togglePlayListDispatch(false)}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
          <div className="list_wrapper" ref={listWrapperRef} onClick={e => e.stopPropagation ()}>
            <ListHeader>
              <h1 className="title">
                { getPlayMode() }
                <span className="iconfont clear" onClick={handleShowClear}>&#xe63d;</span>
              </h1>
            </ListHeader>
            <ScrollWrapper>
              <Scroll ref={listContentRef} onScroll={pos => handleScroll(pos) }>
                <ListContent>
                  {
                    playList.map((item, index) => {
                      return (
                        <li className="item" key={item.id} onClick={() => handleChangeCurrentIndex (index)}>
                          {getCurrentIcon(item)}
                          <span className="text">{item.name} - {getName(item.ar)}</span>
                          <span className="like">
                            <i className="iconfont">&#xe601;</i>
                          </span>
                          <span className="delete" onClick={(e) => handleDeleteSong (e, item)}>
                            <i className="iconfont">&#xe63d;</i>
                          </span>
                        </li>
                      )
                    })
                  }
                </ListContent>
              </Scroll>
            </ScrollWrapper>
          </div>
          <Confirm
              ref={confirmRef}
              text={"是否删除全部？"}
              cancelBtnText={"取消"}
              confirmBtnText={"确定"}
              handleConfirm={handleConfirmClear}
          />
        </PlayListWrapper>
      </CSSTransition>
  )
}

const mapStateToProps = (state) => ({
  currentIndex: state.getIn(['player', 'currentIndex']),
  currentSong: state.getIn(['player', 'currentSong']),
  playList: state.getIn(['player', 'playList']),// 播放列表
  sequencePlayList: state.getIn(['player', 'sequencePlayList']),// 顺序排列时的播放列表
  mode: state.getIn(['player', 'mode']),
  showPlayList: state.getIn(['player', 'showPlayList']),
});
// 映射 dispatch 到 props 上
const mapDispatchToProps = (dispatch) => {
  return {
    clearDispatch(data) {
      // 1. 清空两个列表
      dispatch (changePlayList ([]));
      dispatch (changeSequecePlayList ([]));
      // 2. 初始 currentIndex
      dispatch (changeCurrentIndex (-1));
      // 3. 关闭 PlayList 的显示
      dispatch (changeShowPlayList (false));
      // 4. 将当前歌曲置空
      dispatch (changeCurrentSong ({}));
      // 5. 重置播放状态
      dispatch (changePlayingState (false));
    },
    deleteSongDispatch(data) {
      dispatch (deleteSong (data));
    },
    togglePlayListDispatch(data) {
      dispatch(changeShowPlayList(data));
    },
    // 修改当前歌曲在列表中的 index，也就是切歌
    changeCurrentIndexDispatch(data) {
      dispatch(changeCurrentIndex(data));
    },
    // 修改当前的播放模式
    changeModeDispatch(data) {
      dispatch(changePlayMode(data));
    },
    // 修改当前的歌曲列表
    changePlayListDispatch(data) {
      dispatch(changePlayList(data));
    },
  }
};
// 将 ui 组件包装成容器组件
export default connect(mapStateToProps, mapDispatchToProps)(React.memo(PlayList));
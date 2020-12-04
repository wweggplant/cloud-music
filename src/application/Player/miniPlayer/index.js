import React, { useRef } from 'react'
import { MiniPlayerContainer } from './style'
import { getName } from "../../../api/utils";
import { CSSTransition } from "react-transition-group";
function MiniPlayer(props) {
  const { song, fullScreen } = props
  const { toggleFullScreen } = props
  const miniPlayerRef = useRef()
  return (
    <CSSTransition
      classNames="normal"
      in={!fullScreen}
      timeout={400}
      mountOnEnter
      onEnter={() => {
        miniPlayerRef.current.style.display = "flex";
      }}
      //onEntered={afterEnter}
      //onExit={leave}
      onExited={() => {
        miniPlayerRef.current.style.display = "none";
      }}
    >
      <MiniPlayerContainer ref={miniPlayerRef} onClick={() => toggleFullScreen(true)}>
        <div className="icon">
          <div className="imgWrapper">
            <img className="play" src={song.al.picUrl} width="40" height="40" alt="img"/>
          </div>
        </div>
        <div className="text">
          <h2 className="name">{song.name}</h2>
          <p className="desc">{getName (song.ar)}</p>
        </div>
        <div className="control">
          <i className="iconfont">&#xe650;</i>
        </div>
        <div className="control">
          <i className="iconfont">&#xe640;</i>
        </div>
      </MiniPlayerContainer>
    </CSSTransition>
  )
}

export default React.memo(MiniPlayer)
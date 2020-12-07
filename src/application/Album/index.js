import React, { useState, useEffect, useCallback, useRef  } from 'react'
import { Container } from './style'
import { CSSTransition } from 'react-transition-group';
import  Header  from './../../baseUI/header/index';
import Scroll from '../../baseUI/scroll'
import MusicNote from "../../baseUI/music-note/index";
import { isEmptyObject} from '../../api/utils'
import { getAlbumList } from './store/actionCreators'
import { connect } from "react-redux";
import Loading from '../../baseUI/loading'
import {changePlayList} from "../Player/store/actionCreators";
import AlbumDetail from "../../components/album-detail";
import { HEADER_HEIGHT } from '../../api/config'
import style from '../../assets/global-style'

const mapStateToProps = (state) => ({
  currentAlbum: state.getIn(['album', 'currentAlbum']),
  enterLoading: state.getIn(['album', 'enterLoading']),
  songsCount: state.getIn (['player', 'playList']).size,
})
const mapDispatchToProps = dispatch => ({
  getAlbumDataDispatch (id) {
    dispatch(getAlbumList(id))
  },
  changePlayListDispatch(currentAlbum) {
    dispatch(changePlayList(currentAlbum.tracks))
  }
})


export default connect(mapStateToProps, mapDispatchToProps)(React.memo(function (props) {
  const [showStatus, setShowStatus] = useState (true);
  const id = props.match.params.id;
  const { currentAlbum: currentAlbumImmutable, enterLoading, pullUpLoading, songsCount } = props
  const { getAlbumDataDispatch, changePlayListDispatch } = props
  let currentAlbum = currentAlbumImmutable.toJS ();
  const [title, setTitle] = useState("歌单");
  const [isMarquee, setIsMarquee] = useState(false);
  const musicNoteRef = useRef()
  const headerEl = useRef();
  const handleBack = useCallback(() => {
    setShowStatus (false);
  }, []);
  const handleScroll = useCallback((pos) => {
    let minScrollY = -HEADER_HEIGHT;
    let percent = Math.abs(pos.y/minScrollY);
    let headerDom = headerEl.current;
    if(pos.y < minScrollY) {
      headerDom.style.backgroundColor = style["theme-color"];
      headerDom.style.opacity = Math.min(1, (percent-1)/2);
      setTitle(currentAlbum&&currentAlbum.name);
      setIsMarquee(true);
    } else{
      headerDom.style.backgroundColor = "";
      headerDom.style.opacity = 1;
      setTitle("歌单");
      setIsMarquee(false);
    }
  }, [currentAlbum]);
  useEffect (() => {
    getAlbumDataDispatch (id);
  }, [getAlbumDataDispatch, id]);
  const musicAnimation = (x, y) => {
    musicNoteRef.current.startAnimation ({ x, y });
  };

  return (
    <CSSTransition
      in={showStatus}
      timeout={300}
      classNames="fly"
      appear={true}
      unmountOnExit
      onExited={props.history.goBack}
    >
      <Container play={songsCount}>
        <Header ref={headerEl} title={title} handleClick={handleBack} isMarquee={isMarquee}></Header>
        {!isEmptyObject(currentAlbum) ?
        <Scroll
          bounceTop={false}
          onScroll={handleScroll}
        >
          <AlbumDetail currentAlbum={currentAlbum} pullUpLoading={pullUpLoading} musicAnimation={musicAnimation} />
        </Scroll>
        : null}
        <Loading show={enterLoading}></Loading>
        <MusicNote ref={musicNoteRef}></MusicNote>
      </Container>
    </CSSTransition>
  )
}))
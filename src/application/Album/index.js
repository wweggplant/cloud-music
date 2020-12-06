import React, { useState, useEffect, useCallback, useRef  } from 'react'
import { Container, TopDesc, Menu } from './style'
import { CSSTransition } from 'react-transition-group';
import  Header  from './../../baseUI/header/index';
import Scroll from '../../baseUI/scroll'
import MusicNote from "../../baseUI/music-note/index";
import SongsList from "../SongsList";
import { isEmptyObject} from '../../api/utils'
import { getAlbumList } from './store/actionCreators'
import { connect } from "react-redux";
import Loading from '../../baseUI/loading'
import {changePlayList} from "../Player/store/actionCreators";
import AlbumDetail from "../../components/album-detail";
const mapStateToProps = (state) => ({
  currentAlbum: state.getIn(['album', 'currentAlbum']),
  enterLoading: state.getIn(['album', 'enterLoading']),
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
  const { currentAlbum: currentAlbumImmutable, enterLoading, pullUpLoading } = props
  const { getAlbumDataDispatch, changePlayListDispatch } = props
  let currentAlbum = currentAlbumImmutable.toJS ();
  const handleBack = useCallback(() => {
    setShowStatus (false);
  }, []);
  const handleScroll = useCallback(() => {
  const musicNoteRef = useRef()
  }, [])
  useEffect (() => {
    getAlbumDataDispatch (id);
  }, [getAlbumDataDispatch, id]);
  const musicAnimation = (x, y) => {
    musicNoteRef.current.startAnimation ({ x, y });
  };
  const musicNoteRef = useRef()
  return (
    <CSSTransition
      in={showStatus}
      timeout={300}
      classNames="fly"
      appear={true}
      unmountOnExit
      onExited={props.history.goBack}
    >
      <Container>
        <Header title={"返回"} handleClick={handleBack}></Header>
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
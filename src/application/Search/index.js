import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Container, ShortcutWrapper, HotKey, List, ListItem, SongItem } from './style';
import { CSSTransition } from 'react-transition-group'
import SearchBox from '../../baseUI/search-box'
import Scroll from '../../baseUI/scroll';
import Loading from './../../baseUI/loading/index';
import MusicalNote from '../../baseUI/music-note';
import  LazyLoad, { forceCheck } from 'react-lazyload';
import { getName } from '../../api/utils'
import { connect } from 'react-redux'
import { getHotKeyWords, changeEnterLoading, getSuggestList} from './store/actionCreators'
import { getSongDetail } from '../Player/store/actionCreators'
function Search(props) {
  const {
    hotList,
    enterLoading,
    suggestList: immutableSuggestList,
    songsCount,
    songsList: immutableSongsList
  } = props
  const {
    getHotKeyWordsDispatch,
    changeEnterLoadingDispatch,
    getSuggestListDispatch,
    getSongDetailDispatch
  } = props
  const suggestList = immutableSuggestList.toJS();
  const songsList = immutableSongsList.toJS();
  const [show, setShow] = useState (false);
  const [query, setQuery] = useState ('');
  const musicNoteRef = useRef()
  useEffect (() => {
    setShow (true);
    if (!hotList.size)
      getHotKeyWordsDispatch ();
  }, []);
  const selectItem = (e, id) => {
    getSongDetailDispatch(id)
    musicNoteRef.current.startAnimation ({x:e.nativeEvent.clientX, y:e.nativeEvent.clientY});
  }
  // 热门搜索
  const renderHotKey = () => {
    let list = hotList ? hotList.toJS (): [];
    return (
      <ul>
        {
          list.map (item => {
            return (
              <li className="item" key={item.first} onClick={() => setQuery (item.first)}>
                <span>{item.first}</span>
              </li>
            )
          })
        }
      </ul>
    )
  };

  const renderAlbum = () => {
    let albums = suggestList.playlists;
    if (!albums || !albums.length) return;
    return (
      <List>
        <h1 className="title"> 相关歌单 </h1>
        {
          albums.map ((item, index) => {
            return (
              <ListItem key={item.accountId+""+index} onClick={() => props.history.push (`/album/${item.id}`)}>
                <div className="img_wrapper">
                  <LazyLoad placeholder={<img width="100%" height="100%" src={require ('./music.png')} alt="music"/>}>
                    <img src={item.coverImgUrl} width="100%" height="100%" alt="music"/>
                  </LazyLoad>
                </div>
                <span className="name"> 歌单: {item.name}</span>
              </ListItem>
            )
          })
        }
      </List>
    )
  };
  const renderSingers = () => {
    let singers = suggestList.artists;
    if (!singers || !singers.length) return;
    return (
      <List>
        <h1 className="title"> 相关歌手 </h1>
        {
          singers.map ((item, index) => {
            return (
              <ListItem key={item.accountId+""+index} onClick={() => props.history.push (`/singers/${item.id}`)}>
                <div className="img_wrapper">
                  <LazyLoad placeholder={<img width="100%" height="100%" src={require ('./singer.png')} alt="singer"/>}>
                    <img src={item.img1v1Url} width="100%" height="100%" alt="music"/>
                  </LazyLoad>
                </div>
                <span className="name"> 歌手: {item.name}</span>
              </ListItem>
            )
          })
        }
      </List>
    )
  };
  const renderSongs = () => {
    return (
      <SongItem style={{paddingLeft: "20px"}}> 
        {
          songsList.map (item => {
            return (
              <li key={item.id} onClick={(e) => selectItem (e, item.id)}>
                <div className="info">
                  <span>{item.name}</span>
                  <span>
                    { getName (item.artists) } - { item.album.name }
                  </span>
                </div>
              </li>
            )
          })
        }
      </SongItem>
  )}
  const handleQuery = (q) => {
    setQuery (q);
    if (!q) return;
    changeEnterLoadingDispatch (true);
    getSuggestListDispatch (q);
  }
  const searchBack = useCallback (() => {
    setShow (false);
  }, []);
  useEffect (() => {
    setShow (true);
  }, []);
  return (
    <CSSTransition
      in={show}
      timeout={300}
      appear={true}
      classNames="fly"
      unmountOnExit
      onExited={() => props.history.goBack ()}
    >
      <Container play={songsCount}>
        <div className="search_box_wrapper">
          <SearchBox back={searchBack} newQuery={query} handleQuery={handleQuery}></SearchBox>
        </div>
          <ShortcutWrapper show={!query}>
            <Scroll onScroll={forceCheck}>
              <div>
                <HotKey>
                  <h1 className="title"> 热门搜索 </h1>
                  {renderHotKey ()}
                </HotKey>
              </div>
            </Scroll>
          </ShortcutWrapper>
          <ShortcutWrapper show={query}>
            <Scroll onScorll={forceCheck}>
              <div>
                { renderSingers() }
                { renderAlbum() }
                { renderSongs() }
              </div>
            </Scroll>
          </ShortcutWrapper>
          { enterLoading? <Loading></Loading> : null }
          <MusicalNote ref={musicNoteRef}></MusicalNote>
      </Container>
    </CSSTransition>
  )
}
const mapStateToProps = (state) => ({
  hotList: state.getIn (['search', 'hotList']),
  enterLoading: state.getIn (['search', 'enterLoading']),
  suggestList: state.getIn (['search', 'suggestList']),
  songsCount: state.getIn (['player', 'playList']).size,
  songsList: state.getIn (['search', 'songsList'])
});

const mapDispatchToProps = (dispatch) => {
  return {
    getSongDetailDispatch (id) {
      dispatch (getSongDetail (id));
    },
    getHotKeyWordsDispatch () {
      dispatch (getHotKeyWords ());
    },
    changeEnterLoadingDispatch (data) {
      dispatch (changeEnterLoading (data))
    },
    getSuggestListDispatch (data) {
      dispatch (getSuggestList (data));
    },
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Search))
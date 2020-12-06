import React, { useState, useRef, useEffect  } from 'react'
import { CSSTransition } from "react-transition-group";
import { Container, ImgWrapper, CollectButton, BgLayer, SongListWrapper } from './style'
import Header from '../../baseUI/header'
import SongsList from "../SongsList";
import Scroll from "../../baseUI/scroll";
import MusicNote from "../../baseUI/music-note/index";
const artist = {
  picUrl: "https://p2.music.126.net/W__FCWFiyq0JdPtuLJoZVQ==/109951163765026271.jpg",
  name: "薛之谦",
  hotSongs: [
    {
      id: 1,
      name: "我好像在哪见过你",
      ar: [{name: "薛之谦"}],
      al: {
        name: "薛之谦专辑"
      }
    },
    {
      id: 2,
      name: "我好像在哪见过你",
      ar: [{name: "薛之谦"}],
      al: {
        name: "薛之谦专辑"
      }
    },
    // 省略 20 条
  ]
}

function Singer(props) {
  const [showStatus, setShowStatus] = useState (true);
  const collectButton = useRef ();
  const imageWrapper = useRef ();
  const songScrollWrapper = useRef ();
  const songScroll = useRef ();
  const header = useRef ();
  const layer = useRef ();
  // 图片初始高度
  const initialHeight = useRef (0);
  const musicNoteRef = useRef ();
  const musicAnimation = (x, y) => {
    musicNoteRef.current.startAnimation ({ x, y });
  };
  // 往上偏移的尺寸，露出圆角
  const OFFSET = 5;
  useEffect(function () {
    let h = imageWrapper.current.offsetHeight;
    songScrollWrapper.current.style.top = `${h - OFFSET} px`;
    initialHeight.current = h;
    layer.current.style.top = `${h - OFFSET} px`;
    songScroll.current.refresh ();
  }, [])
  return (
    <CSSTransition
      in={showStatus}
      timeout={300}
      classNames="fly"
      appear={true}
      unmountOnExit
      onExited={() => props.history.goBack ()}
    >
      <Container>
        <Header ref={header} title={"头部"}></Header>
        <ImgWrapper ref={imageWrapper} bgUrl={artist.picUrl}>
          <div className="filter"></div>
        </ImgWrapper>
        <CollectButton ref={collectButton}>
          <i className="iconfont">&#xe62d;</i>
          <span className="text"> 收藏 </span>
        </CollectButton>
        <BgLayer ref={layer}></BgLayer>
        <SongListWrapper ref={songScrollWrapper}>
          <Scroll ref={songScroll}>
            <SongsList
              songs={artist.hotSongs}
              showCollect={false}
              musicAnimation={musicAnimation}
            >
            </SongsList>
          </Scroll>
        </SongListWrapper>
        <MusicNote ref={musicNoteRef}></MusicNote>
      </Container>
    </CSSTransition>)
}

export default React.memo(Singer)
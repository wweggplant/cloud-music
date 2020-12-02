// src/appliction/Home/index.js
import React, { useState, useCallback, useEffect } from 'react'
import { connect } from "react-redux";
import Horizen from '../../baseUI/horizen-item'
import { categoryTypes, areaTypes } from '../../api/config'
import { NavContainer, ListContainer, List, ListItem } from './style'
import Scroll from '../../baseUI/scroll'
import {
  getSingerList,
  getHotSingerList,
  changeEnterLoading,
  changePageCount,
  refreshMoreSingerList,
  changePullUpLoading,
  changePullDownLoading,
  refreshMoreHotSingerList
} from './store/actionCreators';

function useClickHorizenItem(init = '', updateDispatch) {
  const [state, setState] = useState(init)
  const handleState = useCallback((val) => {
    setState(val)
    updateDispatch && updateDispatch(val)
  }, [state])
  return [state, handleState]
}

const renderSingerList = (singerList) => {
  return (
    <List>
      {
        singerList.map ((item, index) => {
          return (
            <ListItem key={item.accountId+""+index}>
              <div className="img_wrapper">
                <img src={`${item.picUrl}?param=300x300`} width="100%" height="100%" alt="music"/>
              </div>
              <span className="name">{item.name}</span>
            </ListItem>
          )
        })
      }
    </List>
  )
}
function Singers(props) {
  const [type, handleType] = useClickHorizenItem('-1', function (type) {
    updateDispatch(type, area);
  })
  const [area, handleUpdateArea] = useClickHorizenItem('-1', function (area) {
    updateDispatch(type, area);
  })
  const { singerList }  = props
  const singerListJS = singerList ? singerList.toJS() : []
  console.log(singerList)
  const { getHotSingerDispatch, updateDispatch } = props;
  useEffect(() => {
    getHotSingerDispatch()
  }, [])
  return (
    <div>
      <NavContainer>
        <Horizen list={categoryTypes} title={"分类:"} handleClick={handleType} oldVal={type}></Horizen>
        <Horizen list={areaTypes} title={"地区:"} handleClick={handleUpdateArea} oldVal={area}></Horizen>
      </NavContainer>
      <ListContainer>
        <Scroll>
          { renderSingerList (singerListJS) }
        </Scroll>
      </ListContainer>
    </div>
  )
}

const mapStateToProps = (state) => ({
  // 不要在这里将数据 toJS
  // 不然每次 diff 比对 props 的时候都是不一样的引用，还是导致不必要的重渲染，属于滥用 immutable
  singerList: state.getIn(['singers', 'singerList']),
  enterLoading: state.getIn(['singers', 'enterLoading']),
  pullUpLoading: state.getIn(['singers', 'pullUpLoading']),
  pullDownLoading: state.getIn(['singers', 'pullDownLoading']),
  pageCount: state.getIn(['singers', 'pageCount'])
})
const mapDispatchToProps = dispatch => ({
  getHotSingerDispatch() {
    dispatch(getHotSingerList());
  },
  updateDispatch(type, area) {
    dispatch(changePageCount(0));//由于改变了分类，所以pageCount清零
    dispatch(changeEnterLoading(true));//loading，现在实现控制逻辑，效果实现放到下一节，后面的loading同理
    dispatch(getSingerList(type, area));
  },
  pullUpRefreshDispatch(type, area, hot, count) {
    dispatch(changePullUpLoading(true));
    dispatch(changePageCount(count+1));
    if (hot) {
      dispatch(refreshMoreHotSingerList());
    } else {
      dispatch(refreshMoreSingerList(type, area));
    }
  },
  pullDownRefreshDispatch(type, area) {
    dispatch(changePullDownLoading(true));
    dispatch(changePageCount(0));//属于重新获取数据
    if(type === '' && area === ''){
      dispatch(getHotSingerList());
    } else {
      dispatch(getSingerList(type, area));
    }
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Singers))

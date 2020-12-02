// src/appliction/Home/index.js
import React, { useEffect } from 'react'
import Slider from '../../components/slider'
import RecommendList from '../../components/list'
import Scroll from '../../components/scroll'
import styled from'styled-components';
import { connect } from "react-redux";
import * as actionTypes from './store/actionCreators';
import { forceCheck } from 'react-lazyload';
import Loading  from "../../baseUI/loading";
export const Content = styled.div`
  position: fixed;
  top: 90px;
  bottom: 0;
  width: 100%;
`
function Recommend(props) {
  const { bannerList, recommendList, enterLoading} = props
  const { getBannerDataDispatch, getRecommendListDataDispatch } = props;
  useEffect(() => {
    if (!bannerList.size) {
      getBannerDataDispatch()
    }
    if (!recommendList.size) {
      getRecommendListDataDispatch()
    }
  }, [])
  const bannerListJS = bannerList ? bannerList.toJS() : []
  const recommendListJS = recommendList ? recommendList.toJS() : []
  return (
    <Content>
      { enterLoading ? <Loading></Loading>: null }
      <Scroll className="list" onScroll={forceCheck}>
        <div>
          <Slider bannerList={bannerListJS}></Slider>
          <RecommendList recommendList={recommendListJS}></RecommendList>
        </div>
      </Scroll>
    </Content>
  )
}

const mapStateToProps = (state) => ({
  // 不要在这里将数据 toJS
  // 不然每次 diff 比对 props 的时候都是不一样的引用，还是导致不必要的重渲染，属于滥用 immutable
  bannerList: state.getIn(['recommend', 'bannerList']),
  recommendList: state.getIn(['recommend', 'recommendList']),
  enterLoading: state.getIn (['recommend', 'enterLoading'])
})
const mapDispatchToProps = dispatch => ({
  getBannerDataDispatch() {
    dispatch(actionTypes.getBannerlist())
  },
  getRecommendListDataDispatch() {
    dispatch(actionTypes.getRecommendList())
  }
})
export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Recommend))

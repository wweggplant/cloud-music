// src/appliction/Home/index.js
import React, { useEffect } from 'react'
import Slider from '../../components/slider'
import RecommendList from '../../components/list'
import Scroll from '../../baseUI/scroll'
import { connect } from "react-redux";
import * as actionTypes from './store/actionCreators';
import { forceCheck } from 'react-lazyload';
import Loading  from "../../baseUI/loading";
import { renderRoutes } from 'react-router-config'
import { withRouter } from 'react-router-dom';
import { Content } from '../../assets/global-style'

function Recommend(props) {
  const { bannerList, recommendList, enterLoading, songsCount} = props
  const { getBannerDataDispatch, getRecommendListDataDispatch } = props;
  useEffect(() => {
    if (!bannerList.size) {
      getBannerDataDispatch()
    }
    if (!recommendList.size) {
      getRecommendListDataDispatch()
    }
  }, [bannerList.size, getBannerDataDispatch, getRecommendListDataDispatch, recommendList.size])
  const bannerListJS = bannerList ? bannerList.toJS() : []
  const recommendListJS = recommendList ? recommendList.toJS() : []
  return (
    <Content play={songsCount}>
      { enterLoading ? <Loading></Loading>: null }
      <Scroll className="list" onScroll={forceCheck}>
        <div>
          <Slider bannerList={bannerListJS}></Slider>
          <RecommendList recommendList={recommendListJS}></RecommendList>
        </div>
      </Scroll>
      { renderRoutes (props.route.routes) }
    </Content>
  )
}

const mapStateToProps = (state) => ({
  songsCount: state.getIn (['player', 'playList']).size,
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
export default connect(mapStateToProps, mapDispatchToProps)(React.memo(withRouter(Recommend)))

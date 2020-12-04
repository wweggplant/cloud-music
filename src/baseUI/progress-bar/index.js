import React, { useEffect, useRef, useState } from 'react';
import styled from'styled-components';
import style from '../../assets/global-style';

const ProgressBarWrapper = styled.div`
  height: 30px;
  .bar-inner {
    position: relative;
    top: 13px;
    height: 4px;
    background: rgba(0, 0, 0, .3);
    .progress {
      position: absolute;
      height: 100%;
      background: ${style["theme-color"]};
    }
    .progress-btn-wrapper {
      position: absolute;
      left: -8px;
      top: -13px;
      width: 30px;
      height: 30px;
      .progress-btn {
        position: relative;
        top: 7px;
        left: 7px;
        box-sizing: border-box;
        width: 16px;
        height: 16px;
        border: 3px solid ${style["border-color"]};
        border-radius: 50%;
        background: ${style["theme-color"]};
      }
    }
  }
`
const progressBtnWidth = 16

function ProgressBar (props) {
  const { percent, percentChange } = props
  const progressBar = useRef ();
  const progress = useRef ();
  const progressBtn = useRef ();
  const [touch, setTouch] = useState ({
    left: 0,
    initiated: false
  });
  const progressTouchStart = (e) => {
    const startTouch = {};
    startTouch.initiated = true;//initial 为 true 表示滑动动作开始了
    startTouch.startX = e.touches [0].pageX;// 滑动开始时横向坐标
    startTouch.left = progress.current.clientWidth;// 当前 progress 长度
    setTouch (startTouch);
  }
  const progressTouchMove = (e) => {
    if (!touch.initiated) return;
    // 滑动距离
    const deltaX = e.touches [0].pageX - touch.startX;
    const barWidth = getBarWidth()
    const offsetWidth = Math.min (Math.max (0, touch.left + deltaX), barWidth);
    _offset (offsetWidth);
  }
  const progressTouchEnd = (e) => {
    const endTouch = JSON.parse (JSON.stringify (touch));
    endTouch.initiated = false
    setTouch(endTouch);
  }
  const _offset = (offsetWidth) => {
    progress.current.style.width = `${offsetWidth}px`;
    progressBtn.current.style.transform = `translate3d(${offsetWidth}px, 0, 0)`;
  }
  const clickProgress = (e) => {
    const rect = progressBar.current.getBoundingClientRect ()
    const offsetWidth =  e.pageX - rect.left
    const endTouch = JSON.parse (JSON.stringify (touch));
    endTouch.left = e.pageX
    _offset (offsetWidth);
    setTouch(endTouch);
    _changePercent ();
  }
  function getBarWidth() {
    return progressBar.current.clientWidth - progressBtnWidth
  }
  const _changePercent = () => {
    const barWidth = getBarWidth()
    const curPercent = progress.current.clientWidth/barWidth
    percentChange (curPercent)
  }
  useEffect(() => {
    if(percent >= 0 && percent <= 1 && !touch.initiated) {
      const barWidth = getBarWidth()
      _offset (barWidth * percent);
    }
    // _changePercent ()
  }, [percent])
  return (
    <ProgressBarWrapper onClick={clickProgress}>
      <div className="bar-inner" ref={progressBar}>
        <div className="progress" ref={progress}></div>
        <div className="progress-btn-wrapper" ref={progressBtn}
           onTouchStart={progressTouchStart}
           onTouchMove={progressTouchMove}
           onTouchEnd={progressTouchEnd}
        >
          <div className="progress-btn"></div>
        </div>
      </div>
    </ProgressBarWrapper>
  )
}
export default React.memo(ProgressBar)
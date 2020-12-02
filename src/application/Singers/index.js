// src/appliction/Home/index.js
import React, { useState, useCallback } from 'react'
import Horizen from '../../baseUI/horizen-item'
import { categoryTypes, alphaTypes } from '../../api/config'
import { NavContainer } from './style'

function useClickHorizenItem(init = '') {
  const [state, setState] = useState(init)
  const handleState = useCallback((val) => {
    setState(val)
  }, [state])
  return [state, handleState]
}

function Singers(props) {
  const [category, handleCategory] = useClickHorizenItem('1001')
  const [alpha, handleUpdateAlpha] = useClickHorizenItem('A')
  return (
    <NavContainer>
      <Horizen list={categoryTypes} title={"分类 (默认热门):"} handleClick={handleCategory} oldVal={category}></Horizen>
      <Horizen list={alphaTypes} title={"首字母:"} handleClick={handleUpdateAlpha} oldVal={alpha}></Horizen>
    </NavContainer>
  )
}

export default React.memo(Singers)

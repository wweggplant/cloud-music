import React, { useEffect, useRef }  from 'react'
import { PropTypes } from 'prop-types';
import Scroll from '../scroll'
import styled from 'styled-components'
import style from '../../assets/global-style'

function Horizen(props) {
  const { title, list, oldVal, handleClick} = props
  const Category = useRef (null);
  useEffect(() => {
    const catDom = Category.current
    const $spanList = catDom.querySelectorAll('span')
    let totalWidth = 0
    Array.from($spanList).forEach(span => {
      totalWidth += span.offsetWidth
    })
    catDom.style.width = `${totalWidth + 20}px`;
  }, [])
  return  (
    <Scroll direction={"horizental"}>
      <div ref={Category}>
        <List>
          <span>{title}</span>
          {list.map(item => {
            return (
              <ListItem
                key={item.key}
                className={`${oldVal === item.key ?  'selected' : ''}`}
                onClick={() => handleClick (item.key)}
              >
                {item.name}
              </ListItem>
            )
          })}
        </List>
      </div>
    </Scroll>
  )
}
const List = styled.div`
  display: flex;
  align-items: center;
  height: 30px;
  overflow: hidden;
  >span:first-of-type {
    display: block;
    flex: 0 0 auto;
    padding: 5px 0;
    margin-right: 5px;
    color: grey;
    font-size: ${style["font-size-m"]};
    vertical-align: middle;
  }
`
const ListItem = styled.span`
  flex: 0 0 auto;
  font-size: ${style["font-size-m"]};
  padding: 5px 8px;
  border-radius: 10px;
  border: 1px solid transparent;
  &.selected {
    color: ${style["theme-color"]};
    border: 1px solid ${style["theme-color"]};
    opacity: 0.8;
  }
`
Horizen.defaultProps = {
  list: [],
  oldVal: '',
  title: '',
  handleClick: null
};

Horizen.propTypes = {
  list: PropTypes.array,
  oldVal: PropTypes.string,
  title: PropTypes.string,
  handleClick: PropTypes.func
};

export default React.memo(Horizen)

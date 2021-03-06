import React, { useRef, useState, useEffect, useMemo } from 'react'
import { SearchBoxWrapper } from './style'
import { debounce } from '../../api/utils'
function SearchBox(props) {
  const { newQuery } = props;
  const { handleQuery } = props;
  const queryRef = useRef();
  const [query, setQuery] = useState('')
  const displayStyle = query ? {display: 'block'}: {display: 'none'};
  // 进场出现光标
  let handleQueryDebounce = useMemo (() => {
    return debounce (handleQuery, 500);
  }, [handleQuery]);
  useEffect (() => {
    let curQuery = query;
    if(newQuery !== query){
      curQuery = newQuery;
      queryRef.current.value = newQuery;
    }
    setQuery(curQuery);
    // eslint-disable-next-line
  }, []);
  useEffect (() => {
    if (newQuery !== query){
      setQuery (newQuery);
    }
    // eslint-disable-next-line
  }, [newQuery]);
  useEffect (() => {
    // 注意防抖
    handleQueryDebounce (query);
    // eslint-disable-next-line 
  }, [query]);
  const clearQuery = () => {
    setQuery ('');
    queryRef.current.focus ();
  }
  const handleChange = (e) => {
    setQuery (e.currentTarget.value);
  }
  return (
    <SearchBoxWrapper>
      <i className="iconfont icon-back" onClick={() => props.back ()}>&#xe655;</i>
      <input ref={queryRef} className="box" placeholder="搜索歌曲、歌手、专辑" value={query} onChange={handleChange}/>
      <i className="iconfont icon-delete" onClick={clearQuery} style={displayStyle}>&#xe600;</i>
    </SearchBoxWrapper>
  )
}

export default React.memo(SearchBox)
import React, { useState, useEffect, useCallback } from 'react'
import { Container } from './style'
import { CSSTransition } from 'react-transition-group'
import SearchBox from '../../baseUI/search-box'

function Search(props) {
  const [show, setShow] = useState (false);
  const [query, setQuery] = useState ('');
  const handleQuery = (q) => {
    setQuery (q);
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
      <Container>
        <div className="search_box_wrapper">
          <SearchBox back={searchBack} newQuery={query} handleQuery={handleQuery}></SearchBox>
        </div>
      </Container>
    </CSSTransition>
  )
}

export default React.memo(Search)
import React, { useState, useReducer, useEffect } from 'react'
import { useResource } from 'react-request-hook'

import PostList from './post/PostList'
import CreatePost from './post/CreatePost'
import UserBar from './user/UserBar'
import Header from './Header'

import { ThemeContext, StateContext } from './contexts'
import ChangeTheme from './ChangeTheme'
import appReducer from './reducers'

const App = () => {
  const [ theme, setTheme ] = useState({
    primaryColor: 'deepskyblue',
    secondaryColor: 'coral'
  })
  const [ state, dispatch ] = useReducer(appReducer, { user: '', posts: [] })
  const { user, error } = state;

  // useEffect(() => {
  //   fetch('http://localhost:3001/posts')
  //     .then(result => result.json())
  //     .then(posts => dispatch({ type: 'FETCH_POSTS', posts }))
  // }, []);

  const [ posts, getPosts ] = useResource(() => ({
    url: '/posts',
    method: 'get'
  }))
  useEffect(getPosts, [])
  useEffect(() => {
    if (posts && posts.data) {
      dispatch({ type: 'FETCH_POSTS', posts: posts.data })
    }
  }, [posts])

  useEffect(() => {
    if (user) {
      document.title = `${user} - React Hooks`;
    } else {
      document.title = 'React Hooks Blog'
    }
  }, [user]);

  return (
    <StateContext.Provider value={{ state, dispatch }}>
      <ThemeContext.Provider value={theme}>
        <div style={{padding: 8}}>
          <Header text="React Hooks" />
          <ChangeTheme theme={theme} setTheme={setTheme} />
          <br />
          <UserBar />
          <br />
          {user && <CreatePost /> }
          <br />
          <hr />
          <PostList />
        </div>
      </ThemeContext.Provider>
    </StateContext.Provider>
  )
}

export default App;


// npx json-server --watch server/db.json

// json-server --watch db.json --port 3001 --routes routes.json
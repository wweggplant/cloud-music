import React from 'react'
import { Redirect } from 'react-router-dom'
import Home from '../application/Home'
import Recommend from '../application/Recommend'
import Singers from '../application/Singers'
import Singer from '../application/Singer'
import Rank from '../application/Rank'
import Album from '../application/Album';
import Search from '../application/Search';

export default [
  {
    path: '/',
    component: Home,
    routes: [
      {
        path: '/',
        exact: true,
        // eslint-disable-next-line react/display-name
        render: () => (
          <Redirect to={'/recommend'}/>
        )
      },
      {
        path: "/search",
        exact: true,
        key: "search",
        component: Search
      } ,
      {
        path: "/album/:id",
        exact: true,
        key: "album",
        component: Album
      },
      {
        path: '/recommend',
        component: Recommend,
        key: '/recommend',
        routes: [
          {
            path: "/recommend/:id",
            component: Album
          }
        ]
      },
      {
        path: '/singers',
        component: Singers,
        key: "singers",
        routes: [
          {
            path: "/singers/:id",
            component: Singer
          }
        ]
      },
      {
        path: '/rank',
        component: Rank,
        key: "rank",
        routes: [
          {
            path: '/rank/:id',
            component: Album
          }
        ]
      }
    ]
  }
]

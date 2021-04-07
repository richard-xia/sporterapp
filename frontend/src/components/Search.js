import React, { useEffect, useState } from 'react'
import { Form } from 'react-bootstrap'
import { ListGroup } from 'react-bootstrap'
import { MDBContainer } from 'mdbreact'
import './scrollbar.css'

import Group from './groups/Group'
import Game from './games/Game'
import User from './users/User'
import classes from './Search.module.css'

/***********************************************************************************
 * Search Component
 * Component in Header that contains search results of every group, game and user
 **********************************************************************************/

const Search = ({
  groups,
  games,
  otherGroupInfo,
  otherGameInfo,
  groupUsers,
  otherGroupUsers,
}) => {
  const scrollContainerStyle = { width: '470px', maxHeight: '200px' }
  const [searchTerm, setSearchTerm] = useState('') //State of the current search input
  const [showSearch, setShowSearch] = useState(false) //State of whether or not to show search bar

  useEffect(() => {
    if (showSearch) {
      window.addEventListener('click', function (e) {
        if (document.getElementById('clickbox')) {
          if (!document.getElementById('clickbox').contains(e.target)) {
            setShowSearch(false)
          }
        }
      })
    }
  }, [showSearch])

  return (
    <div id='clickbox'>
      <Form>
        <Form.Control
          type='text'
          placeholder='search...'
          className={classes.searchbar}
          onChange={(event) => {
            setSearchTerm(event.target.value)
          }}
          onClick={() => setShowSearch(true)}
        />
        {showSearch ? (
          <MDBContainer className={classes.mdbsearch}>
            <ListGroup
              className='scrollbar scrollbar-primary mx-auto'
              style={scrollContainerStyle}
            >
              {/* Filter and map search results for current user's groups */}
              {groups
                .filter((group) => {
                  if (searchTerm === '') {
                    return null
                  } else if (
                    group.name.toLowerCase().includes(searchTerm.toLowerCase())
                  ) {
                    return group
                  }
                  return null
                })
                .map((group) => {
                  if (showSearch) {
                    return (
                      <ListGroup.Item
                        className={classes.listgroup}
                        key={group._id}
                        onClick={() => setShowSearch(false)}
                      >
                        <Group group={group} />
                      </ListGroup.Item>
                    )
                  } else {
                    return null
                  }
                })}
              {/* Filter and map search results for current user's games */}
              {games
                .filter((game) => {
                  if (searchTerm === '') {
                    return null
                  } else if (
                    game.title.toLowerCase().includes(searchTerm.toLowerCase())
                  ) {
                    return game
                  }
                  return null
                })
                .map((game) => {
                  if (showSearch) {
                    return (
                      <ListGroup.Item
                        className={classes.listgroup}
                        key={game._id}
                        onClick={() => setShowSearch(false)}
                      >
                        <Game game={game} />
                      </ListGroup.Item>
                    )
                  } else {
                    return null
                  }
                })}
              {/* Filter and map search results for user's in current user's groups */}
              {groupUsers
                .filter((user) => {
                  if (searchTerm === '') {
                    return null
                  } else if (
                    user.name.toLowerCase().includes(searchTerm.toLowerCase())
                  ) {
                    return user
                  }
                  return null
                })
                .map((user) => {
                  if (showSearch) {
                    return (
                      <ListGroup.Item
                        className={classes.listgroup}
                        key={user._id}
                        onClick={() => setShowSearch(false)}
                      >
                        <User user={user} role={''} model={'search'} />
                      </ListGroup.Item>
                    )
                  } else {
                    return null
                  }
                })}
              {/* Filter and map search results for groups the current user does not belong to */}
              {otherGroupInfo
                .filter((group) => {
                  if (searchTerm === '') {
                    return null
                  } else if (
                    group.name.toLowerCase().includes(searchTerm.toLowerCase())
                  ) {
                    return group
                  }
                  return null
                })
                .map((group) => {
                  if (showSearch) {
                    return (
                      <ListGroup.Item
                        className={classes.listgroup}
                        key={group._id}
                        onClick={() => setShowSearch(false)}
                      >
                        <Group group={group} />
                      </ListGroup.Item>
                    )
                  } else {
                    return null
                  }
                })}
              {/* Filter and map search results for games the current user does not belong to */}
              {otherGameInfo
                .filter((game) => {
                  if (searchTerm === '') {
                    return null
                  } else if (
                    game.title.toLowerCase().includes(searchTerm.toLowerCase())
                  ) {
                    return game
                  }
                  return null
                })
                .map((game) => {
                  if (showSearch) {
                    return (
                      <ListGroup.Item
                        className={classes.listgroup}
                        key={game._id}
                        onClick={() => setShowSearch(false)}
                      >
                        <Game game={game} />
                      </ListGroup.Item>
                    )
                  } else {
                    return null
                  }
                })}

              {/* Filter and map search results for users that do not belong in a same group as the current user */}
              {otherGroupUsers
                .filter((user) => {
                  if (searchTerm === '') {
                    return null
                  } else if (
                    user.name.toLowerCase().includes(searchTerm.toLowerCase())
                  ) {
                    return user
                  }
                  return null
                })
                .map((user) => {
                  if (showSearch) {
                    return (
                      <ListGroup.Item
                        className={classes.listgroup}
                        key={user._id}
                        onClick={() => setShowSearch(false)}
                      >
                        <User user={user} role={''} model={'search'} />
                      </ListGroup.Item>
                    )
                  } else {
                    return null
                  }
                })}
            </ListGroup>
          </MDBContainer>
        ) : null}
      </Form>
    </div>
  )
}

export default Search

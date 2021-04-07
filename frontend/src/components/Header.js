import React, { useState, useEffect } from 'react'
import axios from '../axios'

import Logout from './auth/Logout'
import Search from '../components/Search'
import { Link } from 'react-router-dom'
import { Nav, Dropdown, Image } from 'react-bootstrap'
import { baseURL } from '../axios'
import classes from './Header.module.css'

/**********************************************************************************************
 * Header Component
 * Overhead component that redirects to Dashboard, Profile, Logout and contains the Search bar
 **********************************************************************************************/

const Header = () => {
  //Current user's information
  const [user, setUser] = useState({})
  const [groups, setGroups] = useState([])
  const [games, setGames] = useState([])

  //Information of findGroups and findGames
  const [otherGroupInfo, setOtherGroupInfo] = useState([])
  const [otherGameInfo, setOtherGameInfo] = useState([])

  //Contains list of all users inside the current user's groups
  const [groupUsers, setGroupUsers] = useState([])
  //Contains list of all users not inside the current user's groups
  const [otherGroupUsers, setOtherGroupUsers] = useState([])

  useEffect(() => {
    axios
      .get('/api/v1/users/getSearch')
      .then((res) => {
        const searchData = res.data.data
        setUser(searchData.user)
        setGroups(searchData.user.groups)
        setGames(searchData.user.games)
        setOtherGroupInfo(searchData.findGroups)
        setOtherGameInfo(searchData.findGames)
        setGroupUsers(searchData.groupUsers)
        setOtherGroupUsers(searchData.otherUsers)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [])

  return (
    <div className={classes.container}>
      <Nav.Link
        id={'dashboard'}
        as={Link}
        to={'/dashboard'}
        className={classes.itema}
      >
        <Image className={classes.logo} src={`${baseURL}/uploads/logo.PNG`} />
      </Nav.Link>
      <Search
        className={classes.itemb}
        groups={groups}
        games={games}
        otherGroupInfo={otherGroupInfo}
        otherGameInfo={otherGameInfo}
        groupUsers={groupUsers}
        otherGroupUsers={otherGroupUsers}
      />
      <Dropdown className={classes.itemc}>
        <Dropdown.Toggle className={classes.dropdowntoggle} variant={'info'}>
          Account
        </Dropdown.Toggle>
        <Dropdown.Menu className={classes.dropdownmenu}>
          <Dropdown.Item>
            <Nav.Link
              id={'profile'}
              as={Link}
              style={{ marginLeft: '15px' }}
              to={`/api/v1/users/${user._id}`}
            >
              Profile
            </Nav.Link>
          </Dropdown.Item>
          <Dropdown.Item>
            <Logout />
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  )
}

export default Header

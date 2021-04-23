import React, { useState, useEffect } from 'react'
import axios from '../axios'
import { Button, Card, Image, Tabs, Tab } from 'react-bootstrap'
import classes from './Dashboard.module.css'

import GroupList from './groups/GroupList'
import GameList from './games/GameList'
import FindMap from '../components/maps/FindMap'
import CreateGroupForm from '../components/groups/CreateGroupForm'
import CreateGameForm from '../components/games/CreateGameForm'
import Header from './Header'
import { baseURL } from '../axios'

/**********************************************************************
 * Dashboard Component
 * Primary component for displaying the current user's groups and games
 **********************************************************************/

const Dashboard = (props) => {
  //List of groups and games of the current user
  const [groups, setGroups] = useState([])
  const [games, setGames] = useState([])
  const [myGroups, setMyGroups] = useState([])

  //List of groups and games to find for the current user
  const [otherGroupInfo, setOtherGroupInfo] = useState([])
  const [otherGameInfo, setOtherGameInfo] = useState([])
  //List of current games of the current user
  const [currentGames, setCurrentGames] = useState([])
  const [finishedGames, setFinishedGames] = useState([])

  //State for showing modal of FindGroupMap and FindGameMap
  const [showGroups, setShowGroups] = useState(false)
  const [showGames, setShowGames] = useState(false)
  //State for showing modal of CreateGroupForm and CreateGameForm
  const [showGroupModal, setShowGroupModal] = useState(false)
  const [showGameModal, setShowGameModal] = useState(false)

  //Location for showing the FindGroupMap and FindGameMap
  const [location, setLocation] = useState({
    lat: 45.3875812,
    lng: 75.69602019999999,
  })
  const [loading, setLoading] = useState(true)

  //Handles closing the CreateGroupForm and CreateGameForm
  const handleClose = () => {
    setShowGroupModal(false)
    setShowGameModal(false)
  }

  //Get the information of the current user
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
      },
      function (error) {
        console.log('error')
        setLocation({ lat: 45.3875812, lng: 75.69602019999999 })
      }
    )
    axios
      .get(`/api/v1/users/getDashboard`)
      .then((res) => {
        const dashboardInfo = res.data.data
        setGroups(dashboardInfo.user.groups)
        setGames(dashboardInfo.user.games)
        setMyGroups(dashboardInfo.myGroups)
        setCurrentGames(dashboardInfo.currentGames)
        setFinishedGames(dashboardInfo.finishedGames)
        setOtherGroupInfo(dashboardInfo.findGroups)
        setOtherGameInfo(dashboardInfo.findGames)
        setLoading(false)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <Header />
      </div>
      {/* Modal for creating group or creating game */}
      <CreateGroupForm
        showGroupModal={showGroupModal}
        handleClose={handleClose}
      />
      <CreateGameForm showGameModal={showGameModal} handleClose={handleClose} />
      {/* Display list of the user's groups */}
      <Card className={classes.groups}>
        <div style={{ display: 'inline' }}>
          <p className={classes.dashboardText}>Groups</p>
          <Button
            variant='secondary'
            className={classes.newbutton}
            onClick={() => setShowGroupModal(true)}
          >
            {' '}
            + Create New Group
          </Button>
        </div>
        <Tabs className={classes.tabs} defaultActiveKey='allGroups'>
          <Tab eventKey='allGroups' title='All Groups'>
            <GroupList groups={groups} />
          </Tab>
          <Tab eventKey='myGroups' title='My Groups'>
            <GroupList groups={myGroups} />
          </Tab>
        </Tabs>
      </Card>
      {/* Display list of the user's games */}
      <Card className={classes.games}>
        <div style={{ display: 'inline' }}>
          <p className={classes.dashboardText}>Games</p>
          <Button
            variant='secondary'
            className={classes.newbutton}
            onClick={() => setShowGameModal(true)}
          >
            {' '}
            + Start a new Game
          </Button>
        </div>
        <Tabs className={classes.tabs} defaultActiveKey='currentGames'>
          <Tab eventKey='currentGames' title='Current games'>
            <GameList games={currentGames} />
          </Tab>
          <Tab eventKey='finishedGames' title='Finished games'>
            <GameList games={finishedGames} />
          </Tab>
          <Tab eventKey='games' title='All Games'>
            <GameList games={games} />
          </Tab>
        </Tabs>
      </Card>
      {/* Button and map for 'Show Groups Near Me */}
      <div className={classes.groupMapButton}>
        <Button
          variant='dark'
          onClick={() => {
            setShowGroups(true)
            setShowGames(false)
          }}
          className={classes.findButton}
        >
          <div style={{ display: 'flex' }}>
            <Image
              src={`${baseURL}/uploads/search-location-solid.svg`}
              className={classes.searchIcon}
            />
            Show groups near me
          </div>
        </Button>
      </div>
      {showGroups ? (
        <div className={classes.itemf}>
          <FindMap
            google={props.google}
            center={{
              lat: location.lat,
              lng: location.lng,
            }}
            type='groups'
            height='300px'
            zoom={15}
            findInfo={otherGroupInfo}
          />
        </div>
      ) : null}
      {/* Button and map for 'Show Games Near Me */}
      <div>
        <Button
          variant='dark'
          onClick={() => {
            setShowGroups(false)
            setShowGames(true)
          }}
          className={classes.findButton}
        >
          <div style={{ display: 'flex' }}>
            <Image
              src={`${baseURL}/uploads/search-location-solid.svg`}
              className={classes.searchIcon}
            />
            Show games near me
          </div>
        </Button>
      </div>
      {showGames ? (
        <div className={classes.itemf}>
          <FindMap
            google={props.google}
            center={{
              lat: location.lat,
              lng: location.lng,
            }}
            type='games'
            height='300px'
            zoom={15}
            findInfo={otherGameInfo}
          />
        </div>
      ) : null}
    </div>
  )
}

export default Dashboard

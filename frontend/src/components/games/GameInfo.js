import React, { useState, useEffect } from 'react'
import axios, { baseURL } from '../../axios'
import { Button, Card, Image, Tabs, Tab } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUsersCog } from '@fortawesome/free-solid-svg-icons'

import Header from '../Header'
import RequestList from '../requests/RequestList'
import UserList from '../users/UserList'
import TeamList from '../games/teams/TeamList'
import Map from '../maps/Map'
import classes from './GameInfo.module.css'
import InviteUserList from '../invites/InviteUserList'
import GameSettings from './GameSettings'
import RequestModal from '../requests/RequestModal'
import SettingsModal from './AdditionalSettingsModal'

/*******************************************************************************
 * GameInfo Component
 * Primary component for displaying all game information and settings
 *******************************************************************************/

const GameInfo = (props) => {
  const [game, setGame] = useState({}) //Contains all the information of the current game
  const [gameTitle, setGameTitle] = useState('') //Contains the title of the current game
  const [gameDescription, setGameDescription] = useState('') //Contains the description of the current game
  const [photo, setPhoto] = useState('') //Contains the photo of the current game
  const [location, setLocation] = useState({
    lat: 45.3875812,
    lng: 75.69602019999999,
  }) //Contains the location of the current game
  const [time, setTime] = useState('') //Contains the time of the game set by the creator
  const [winner, setWinner] = useState(null)

  const [users, setUsers] = useState([]) //Contains all users inside the current game
  const [inviteUsers, setInviteUsers] = useState([]) //Contains all users that can be invited to the current game
  const [requests, setRequests] = useState([]) //Contains all requests to join the current game
  const [role, setRole] = useState([]) //Contains the role of the current user
  const [team1, setTeam1] = useState([]) //Contains all team1 information including name, photo and users
  const [team2, setTeam2] = useState([]) //Contains all team2 information including name, photo and users
  const [otherUsers, setOtherUsers] = useState([]) //Contains all users who are not part of any team

  const [isUserInGroup, setIsUserInGroup] = useState(false) //Checks whether the current user is part of the game's group
  const [isUserInGame, setIsUserInGame] = useState(false) //Checks whether the current user is part of the game
  const [canUserMakeRequest, setCanUserMakeRequest] = useState(true) //Checks whether the current user can make a request to join the game

  const [loading, setLoading] = useState(true) //Checks whether the game information is still loading

  const [showGameSettings, setShowGameSettings] = useState(false) //Checks whether to show the game settings modal
  const [showRequestModal, setShowRequestModal] = useState(false) //Checks whether to show the request to join game modal
  const [showLeaveGameModal, setShowLeaveGameModal] = useState(false)

  //Set all game information that can be changed based on state
  useEffect(() => {
    axios
      .get(`/api/v1/games/getGameInfo/${props.match.params.id}`)
      .then((res) => {
        const gameData = res.data.data
        const gameInfo = gameData.game
        setGame(gameInfo)
        setGameTitle(gameInfo.title)
        setGameDescription(gameInfo.description)
        let moment = require('moment')
        const newTime = moment(gameInfo.time).format('dddd, MMMM Do, h:mm:ss a')
        setTime(newTime)
        setUsers(gameInfo.users)
        setTeam1(gameInfo.team1)
        setTeam2(gameInfo.team2)
        setPhoto(gameInfo.photo)
        setWinner(gameInfo.winner)
        setRequests(gameInfo.requests)
        setLocation({
          lat: gameInfo.location.coordinates[0],
          lng: gameInfo.location.coordinates[1],
        })
        setRole(gameData.role) //Set the role of the current logged in user
        setOtherUsers(gameData.otherUsers) //Set the users who are not part of any team in the game
        setInviteUsers(gameData.inviteUsers)
        const user = gameData.user

        //Check if user has already made a request to join the game
        if (gameInfo.requests.some((request) => request.user === user._id)) {
          setCanUserMakeRequest(false)
        }

        //Check if user is part of the group of the current game unless the game is open
        if (!gameInfo.open) {
          if (
            user.groups.some(
              (userGroups) => userGroups._id === gameInfo.group._id
            )
          ) {
            setIsUserInGroup(true)
          }
        } else {
          setIsUserInGroup(true)
        }

        //Check if user is already part of the current game
        if (user.games.some((userGames) => userGames._id === gameInfo._id)) {
          setCanUserMakeRequest(false)
          setIsUserInGame(true)
        }
        setLoading(false)
      })
      .catch((err) => {
        console.log(`err : ${err}`)
      })
  }, [game._id])

  function addUser(newUserList) {
    //Add user to the current user list (when request is accepted)
    setUsers(newUserList)
  }

  function deleteRequest(id) {
    //Remove the request from the request list
    const newRequestList = requests.filter((request) => request._id !== id)
    setRequests(newRequestList)
  }

  function removeUser(id) {
    //Delete the user from the current user list
    const newUserList = users.filter((user) => user._id !== id)
    setUsers(newUserList)
    window.location.reload(true)
  }

  function setTeam1Users(teamUsers) {
    //Set the list of users for team1
    setTeam1(teamUsers)
  }

  function setTeam2Users(teamUsers) {
    //Set the list of users for team2
    setTeam2(teamUsers)
  }

  function setNoTeamUsers(teamUsers) {
    //Set the list of users who do not belong to any team
    setOtherUsers(teamUsers)
  }

  function setGameWinner(winner) {
    setWinner(winner)
  }

  const handleClose = () => {
    //Close the GameSettings modal
    setShowGameSettings(false)
  }

  function onGameUpdate(title, description, photo, time) {
    //Update the game information from the GameSettings modal
    setGameTitle(title)
    setGameDescription(description)
    setPhoto(photo)
    let moment = require('moment')
    const newTime = moment(time).format('dddd, MMMM Do, h:mm:ss a')
    setTime(newTime)
  }

  function onLocationChange(lat, lng) {
    //Change the location of the current game
    setLocation({ lat: lat, lng: lng })
    const locationInfo = { location: { coordinates: [lat, lng] } }
    axios.put(`/api/v1/games/${game._id}`, locationInfo)
  }

  function removeInviteUser(id) {
    //Remove a user from the InviteUserList
    const newInviteUsers = inviteUsers.filter((user) => user._id !== id)
    setInviteUsers(newInviteUsers)
  }

  function onTeamUpdate(teamName, teamPhoto, team) {
    //Update the information of a team from the TeamModal
    if (team === 'team1') {
      setTeam1({ ...team1, name: teamName, photo: teamPhoto })
    }
    if (team === 'team2') {
      setTeam2({ ...team2, name: teamName, photo: teamPhoto })
    }
  }

  function closeRequestModal() {
    //Close the RequestModal
    setShowRequestModal(false)
  }

  function makeRequest() {
    //Check if the request to join game has been sent
    setCanUserMakeRequest(false)
  }

  function closeLeaveGameModal() {
    setShowLeaveGameModal(false)
  }

  function joinGame() {
    axios.put(`/api/v1/games/joinOpenGame/${game._id}`).then((res) => {
      let newUsers = users
      newUsers.push(res.data.data)
      setUsers(newUsers)
      setIsUserInGame(true)
    })
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <Header />
      </div>
      {/* Map showing the game location*/}
      <div className={classes.map}>
        <Map
          google={props.google}
          center={{ lat: location.lat, lng: location.lng }}
          height='300px'
          zoom={15}
          onLocationChange={onLocationChange}
          role={role}
          winner={winner}
        />
        {winner ? (
          <div
            style={{
              backgroundColor: 'white',
              width: '200px',
              height: '50px',
              marginLeft: '200px',
              position: 'absolute',
            }}
          ></div>
        ) : null}
      </div>
      {/* Div containing game information and list of users */}
      <div className={classes.users}>
        <div className={classes.info}>
          {/* Div with game photo, title and group */}
          <div className={classes.gameinfo}>
            <Image
              src={`${baseURL}/uploads/${photo}`}
              className={classes.icon}
            />
            <p className={classes.title}>{gameTitle}</p>
            {game.open ? null : (
              <LinkContainer to={`/api/v1/groups/${game.group._id}`}>
                <p className={classes.group}>Group: {game.group.name}</p>
              </LinkContainer>
            )}
            <p className={classes.time}>{time}</p>
            {/* Div with settings and request button */}
            {!winner ? (
              <div className={classes.settings}>
                {!isUserInGroup ? (
                  <Button
                    variant='danger'
                    style={{ borderRadius: '5px' }}
                    disabled={true}
                  >
                    You are not part of this group
                  </Button>
                ) : null}
                {canUserMakeRequest && isUserInGroup && !game.open ? (
                  <div>
                    <Button
                      style={{ borderRadius: '5px' }}
                      variant='dark'
                      onClick={() => setShowRequestModal(true)}
                    >
                      Request to join game
                    </Button>
                    <RequestModal
                      modalType={'games'}
                      modalId={game.id}
                      showRequestModal={showRequestModal}
                      closeRequestModal={closeRequestModal}
                      makeRequest={makeRequest}
                    />
                  </div>
                ) : null}
                {!isUserInGame && game.open ? (
                  <Button
                    style={{ borderRadius: '5px' }}
                    variant='success'
                    onClick={joinGame}
                  >
                    Join Game
                  </Button>
                ) : null}
                {!canUserMakeRequest && !isUserInGame && isUserInGroup ? (
                  <div>
                    <Button style={{ borderRadius: '5px' }} variant='success'>
                      ✓ Request sent
                    </Button>
                  </div>
                ) : null}
                {role.includes('creator') ? (
                  <div>
                    <Button
                      onClick={() => setShowGameSettings(true)}
                      style={{ borderRadius: '5px' }}
                      variant='dark'
                    >
                      <FontAwesomeIcon icon={faUsersCog} />
                      &nbsp; Settings
                    </Button>
                    <GameSettings
                      showGameSettings={showGameSettings}
                      title={gameTitle}
                      description={gameDescription}
                      handleClose={handleClose}
                      game={game}
                      onGameUpdate={onGameUpdate}
                      team1={team1}
                      team2={team2}
                      setGameWinner={setGameWinner}
                    />
                  </div>
                ) : null}
                {!role.includes('creator') && isUserInGame ? (
                  <div>
                    <Button
                      style={{ borderRadius: '5px' }}
                      variant='danger'
                      onClick={() => setShowLeaveGameModal(true)}
                    >
                      Leave Game
                    </Button>
                    <SettingsModal
                      game={game}
                      type={'leave'}
                      showSettingsModal={showLeaveGameModal}
                      closeSettingsModal={closeLeaveGameModal}
                    />
                  </div>
                ) : null}
              </div>
            ) : (
              <Button className={classes.finished}>Game Finished!</Button>
            )}
          </div>
        </div>
        <p>{gameDescription}</p>
        {/* Tabs with users, requests and invites */}
        <Tabs defaultActiveKey='users'>
          <Tab eventKey='users' title='Users'>
            <UserList
              users={users}
              model={'games'}
              modelId={props.match.params.id}
              removeUser={removeUser}
              role={role}
              winner={winner}
            />
          </Tab>
          {role.includes('manageUsers') && !winner && !game.open ? (
            <Tab eventKey='requests' title='Requests'>
              <RequestList
                requests={requests}
                requestType={'games'}
                typeId={props.match.params.id}
                deleteRequest={deleteRequest}
                addUser={addUser}
              />
            </Tab>
          ) : null}
          {role.includes('inviteUsers') && !winner ? (
            <Tab eventKey='invite' title='Invite Users'>
              <InviteUserList
                users={inviteUsers}
                modelType='games'
                modelId={props.match.params.id}
                removeInviteUser={removeInviteUser}
              />
            </Tab>
          ) : null}
        </Tabs>
      </div>
      {/* List of teams with edit settings */}
      {game.competitive ? (
        <div className={classes.teams}>
          <Card>
            <TeamList
              otherUsers={otherUsers}
              team1={team1}
              team2={team2}
              winner={winner}
              game={props.match.params.id}
              setTeam1Users={setTeam1Users}
              setTeam2Users={setTeam2Users}
              setNoTeamUsers={setNoTeamUsers}
              role={role}
              onTeamUpdate={onTeamUpdate}
            />
          </Card>
        </div>
      ) : null}
    </div>
  )
}

export default GameInfo

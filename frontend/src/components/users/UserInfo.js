import React, { useState, useEffect } from 'react'
import axios, { baseURL } from '../../axios'
import { Button, Image, Tabs, Tab } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserCog } from '@fortawesome/free-solid-svg-icons'

import GroupList from '../groups/GroupList'
import GameList from '../games/GameList'
import InviteList from '../invites/InviteList'
import UserSettings from './UserSettings'
import classes from './UserInfo.module.css'
import InviteGroupModal from '../invites/InviteGroupModal'
import InviteGameModal from '../invites/InviteGameModal'
import Header from '../Header'

/*****************************************************************************************************
 * UserInfo Component
 * Primary Component for displaying user information and changing the settings of the user
 *****************************************************************************************************/

const UserInfo = (props) => {
  //State of user information
  const [user, setUser] = useState([])
  const [userDescription, setUserDescription] = useState('')
  const [photo, setPhoto] = useState('')
  const [groups, setGroups] = useState([])
  const [games, setGames] = useState([])

  //State of user invites
  const [groupInvites, setGroupInvites] = useState([])
  const [gameInvites, setGameInvites] = useState([])

  //State for showing modals for user settings and invites to groups/games
  const [showUserSettings, setShowUserSettings] = useState(false)
  const [showInviteGroupModal, setShowInviteGroupModal] = useState(false)
  const [showInviteGameModal, setShowInviteGameModal] = useState(false)

  //Check if the profile being displayed is the current user
  const [isCurrentUser, setIsCurrentUser] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios
      .get(`/api/v1/users/${props.match.params.id}`)
      .then((res) => {
        //Set the user's information
        const userInfo = res.data.data
        setPhoto(userInfo.photo)
        setUser(userInfo)
        setUserDescription(userInfo.description)
        setGroupInvites(userInfo.groupInvites)
        setGameInvites(userInfo.gameInvites)
        setGroups(userInfo.groups)
        setGames(userInfo.games)
        if (userInfo.isCurrentUser) {
          setIsCurrentUser(true)
        } else {
          setIsCurrentUser(false)
        }
        setLoading(false)
      })
      .catch((err) => {
        console.log(`err : ${err}`)
      })
  }, [props.match.params.id])

  //Handle closing the UserSettings, InviteGroupModal and InviteGameModal
  const handleClose = () => {
    setShowUserSettings(false)
  }
  const closeInviteGroupModal = () => {
    setShowInviteGroupModal(false)
  }
  const closeInviteGameModal = () => {
    setShowInviteGameModal(false)
  }

  //Handle updates to the user information in UserSettings
  function onUserUpdate(description, photo) {
    setUserDescription(description)
    setPhoto(photo)
  }

  //Add the group/game invite to the invite list
  function addGroupInviteToUser(groupInviteList) {
    setGroupInvites(groupInviteList)
    closeInviteGroupModal()
  }
  function addGameInviteToUser(gameInviteList) {
    setGameInvites(gameInviteList)
    closeInviteGameModal()
  }

  function removeInvite(id, model) {
    //Remove the request from the request list
    if (model === 'groups') {
      const newInviteList = groupInvites.filter((invite) => invite._id !== id)
      setGroupInvites(newInviteList)
    }
    if (model === 'games') {
      const newInviteList = gameInvites.filter((invite) => invite._id !== id)
      setGameInvites(newInviteList)
    }
  }

  //Add the group or game depending on the type of request
  function addModel(data, model) {
    if (model === 'groups') {
      setGroups(data)
    }
    if (model === 'games') {
      setGames(data)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <Header />
      </div>
      <div className={classes.userinfo}>
        {/* Div containing the user's name and description */}
        <div className={classes.info}>
          <div className={classes.userName}>
            <p className={classes.userText}>{user.name}</p>
          </div>
          <div className={classes.bio}>
            <p>{userDescription}</p>
          </div>
          {/* User's profile photo */}
          <div className={classes.photo}>
            <Image
              src={`${baseURL}/uploads/${photo}`}
              className={classes.userPhoto}
              roundedCircle
            />
          </div>
        </div>
      </div>
      {/* Show settings if profile is current user */}
      {isCurrentUser ? (
        <div>
          <Button
            className={classes.editProfile}
            onClick={() => setShowUserSettings(true)}
            variant='dark'
          >
            Edit my profile &nbsp; <FontAwesomeIcon icon={faUserCog} />
          </Button>
          <UserSettings
            showUserSettings={showUserSettings}
            handleClose={handleClose}
            user={user}
            onUserUpdate={onUserUpdate}
          />
        </div>
      ) : (
        // Show Invite to Group/Game buttons if profile is not current user
        <div>
          <Button
            onClick={() => setShowInviteGroupModal(true)}
            className={classes.inviteGroupButton}
            variant='success'
          >
            Invite to group
          </Button>
          <InviteGroupModal
            showInviteGroupModal={showInviteGroupModal}
            closeInviteGroupModal={closeInviteGroupModal}
            otherUser={user}
            userGroupInvites={groupInvites}
            addGroupInviteToUser={addGroupInviteToUser}
          />
          <Button
            onClick={() => setShowInviteGameModal(true)}
            className={classes.inviteGameButton}
            variant='success'
          >
            Invite to game
          </Button>
          <InviteGameModal
            showInviteGameModal={showInviteGameModal}
            closeInviteGameModal={closeInviteGameModal}
            otherUser={user}
            userGameInvites={gameInvites}
            addGameInviteToUser={addGameInviteToUser}
          />
        </div>
      )}
      {/* Show a list of the user's groups and games and invites if they are the current user */}
      <div className={classes.groups}>
        <Tabs defaultActiveKey='groups'>
          <Tab eventKey='groups' title='Groups'>
            {user.private && !isCurrentUser ? (
              <p>Sorry this user is private</p>
            ) : (
              <GroupList groups={groups} />
            )}
          </Tab>
          {isCurrentUser ? (
            <Tab eventKey='invites' title='Group Invites'>
              <InviteList
                removeInvite={removeInvite}
                addModel={addModel}
                invites={groupInvites}
                model={'groups'}
              />
            </Tab>
          ) : null}
        </Tabs>
      </div>
      <div className={classes.games}>
        <Tabs defaultActiveKey='games'>
          <Tab eventKey='games' title='Games'>
            {user.private && !isCurrentUser ? (
              <p>Sorry this user is private</p>
            ) : (
              <GameList games={games} />
            )}
          </Tab>
          {isCurrentUser ? (
            <Tab eventKey='invites' title='Game Invites'>
              <InviteList
                removeInvite={removeInvite}
                addModel={addModel}
                invites={gameInvites}
                model={'games'}
              />
            </Tab>
          ) : null}
        </Tabs>
      </div>
    </div>
  )
}

export default UserInfo

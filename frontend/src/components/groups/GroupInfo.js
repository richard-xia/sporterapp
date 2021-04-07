import React, { useState, useEffect } from 'react'
import axios, { baseURL } from '../../axios'
import { Button, Card, Image, Tabs, Tab } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUsersCog } from '@fortawesome/free-solid-svg-icons'

import Header from '../Header'
import RequestList from '../requests/RequestList'
import UserList from '../users/UserList'
import GameList from '../games/GameList'
import Map from '../maps/Map'
import classes from './GroupInfo.module.css'
import InviteUserList from '../invites/InviteUserList'
import GroupSettings from './GroupSettings'
import CreateGameForm from '../games/CreateGameForm'
import RequestModal from '../requests/RequestModal'
import AdditionalSettingsModal from './AdditionalSettingsModal'
/*******************************************************************************
 * GroupInfo Component
 * Primary component for displaying the group information and` settings`
 *******************************************************************************/

const GroupInfo = (props) => {
  //State of current group information
  const [group, setGroup] = useState([])
  const [groupName, setGroupName] = useState('')
  const [groupDescription, setGroupDescription] = useState('')
  const [photo, setPhoto] = useState([])
  // Set the default location to Carleton University
  const [location, setLocation] = useState({
    lat: 45.3875812,
    lng: 75.69602019999999,
  })

  //State for lists of group information
  const [currentGames, setCurrentGames] = useState([])
  const [finishedGames, setFinishedGames] = useState([])
  const [users, setUsers] = useState([])
  const [inviteUsers, setInviteUsers] = useState([])
  const [requests, setRequests] = useState([])

  const [role, setRole] = useState([]) //Role of the current user in the group
  const [canUserMakeRequest, setCanUserMakeRequest] = useState(true)
  const [isUserInGroup, setIsUserInGroup] = useState(false)
  const [loading, setLoading] = useState(true)

  const [showGroupSettings, setShowGroupSettings] = useState(false) //Show modal for group settings
  const [showGameModal, setShowGameModal] = useState(false) //Show modal for creating a new group game
  const [showRequestModal, setShowRequestModal] = useState(false) //Show modal for sending a request to join group
  const [
    showAdditionalSettingsModal,
    setShowAdditionalSettingsModal,
  ] = useState(false)

  useEffect(() => {
    axios
      .get(`/api/v1/groups/getGroupInfo/${props.match.params.id}`)
      .then((res) => {
        const groupData = res.data.data
        const groupInfo = res.data.data.group
        setGroup(groupInfo)
        setGroupName(groupInfo.name)
        setGroupDescription(groupInfo.description)
        setUsers(groupInfo.users)
        setRequests(groupInfo.requests)
        setPhoto(groupInfo.photo)
        setLocation({
          lat: groupInfo.location.coordinates[0],
          lng: groupInfo.location.coordinates[1],
        })
        setCurrentGames(groupData.currentGames)
        setFinishedGames(groupData.finishedGames)
        setRole(groupData.role)
        setInviteUsers(groupData.inviteUsers)

        const user = groupData.user
        //Check if current user has already made a request to join the group
        if (groupInfo.requests.some((request) => request.user === user._id)) {
          setCanUserMakeRequest(false)
        }
        //Check if current user is already part of the group
        if (user.groups.some((userGroups) => userGroups._id === groupInfo.id)) {
          setCanUserMakeRequest(false)
          setIsUserInGroup(true)
        }
        setLoading(false)
      })
      .catch((err) => {
        console.log(`err : ${err}`)
      })
  }, [group._id])

  //Add user to the list of users in the group (when a request is accepted)
  function addUser(newUserList, requestUserId) {
    setUsers(newUserList)
    removeInviteUser(requestUserId)
  }

  //Remove the request from the list of requests
  function deleteRequest(id) {
    const newRequestList = requests.filter((request) => request._id !== id)
    setRequests(newRequestList)
  }

  //Remove the user from the group
  function removeUser(id) {
    const newUserList = users.filter((user) => user._id !== id)
    setUsers(newUserList)
  }

  //Change the location of the group
  function onLocationChange(lat, lng) {
    setLocation({ lat: lat, lng: lng })
    const locationInfo = { location: { coordinates: [lat, lng] } }
    axios.put(`/api/v1/groups/${group._id}`, locationInfo)
  }

  //Remove a user from the list of invite users
  function removeInviteUser(id) {
    const newInviteUsers = inviteUsers.filter((user) => user._id !== id)
    setInviteUsers(newInviteUsers)
  }

  //Handles closing the settings, create game and request modals
  const handleGroupSettingsClose = () => {
    setShowGroupSettings(false)
  }
  const handleStartGameClose = () => {
    setShowGameModal(false)
  }
  function closeRequestModal() {
    setShowRequestModal(false)
  }

  //Update the group information inside the GroupSettings
  function onGroupUpdate(name, description, photo) {
    setGroupName(name)
    setGroupDescription(description)
    setPhoto(photo)
  }

  //Disables the request button if user makes a request
  function makeRequest() {
    setCanUserMakeRequest(false)
  }

  function closeAdditionalSettingsModal() {
    setShowAdditionalSettingsModal(false)
  }

  if (loading) {
    return <div>Loading...</div>
  }
  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <Header />
      </div>
      {/* Map with the location of the group */}
      <div className={classes.map}>
        <Map
          google={props.google}
          center={{ lat: location.lat, lng: location.lng }}
          height='300px'
          zoom={15}
          type={'groups'}
          onLocationChange={onLocationChange}
          role={role}
        />
      </div>
      {/* Contains the photo, name, description, settings and users of the group*/}
      <div className={classes.users}>
        <div className={classes.menu}>
          {/* Contains the photo and name of the group */}
          <div className={classes.groupinfo}>
            <Image
              className={classes.icon}
              style={{ maxHeight: '100px', maxWidth: '100px' }}
              src={`${baseURL}/uploads/${photo}`}
            />
            <p className={classes.name}>{groupName}</p>
            {/* Contains the settings or request button */}
            <div className={classes.settings}>
              {canUserMakeRequest ? (
                <div>
                  <Button
                    style={{ borderRadius: '5px' }}
                    variant='dark'
                    onClick={() => setShowRequestModal(true)}
                  >
                    Request to join group
                  </Button>
                  <RequestModal
                    modalType={'groups'}
                    modalId={group.id}
                    showRequestModal={showRequestModal}
                    closeRequestModal={closeRequestModal}
                    makeRequest={makeRequest}
                  />
                </div>
              ) : null}
              {/* Check if request has already been sent by user  */}
              {!canUserMakeRequest && !isUserInGroup ? (
                <div>
                  <Button style={{ borderRadius: '5px' }} variant='success'>
                    ✓ Request sent
                  </Button>
                </div>
              ) : null}
              {/* Only show group settings button for creator */}
              {role.includes('creator') ? (
                <div>
                  <Button
                    style={{ borderRadius: '5px' }}
                    onClick={() => setShowGroupSettings(true)}
                    variant='dark'
                  >
                    <FontAwesomeIcon icon={faUsersCog} />
                    &nbsp; Settings
                  </Button>
                  <GroupSettings
                    showGroupSettings={showGroupSettings}
                    handleClose={handleGroupSettingsClose}
                    group={group}
                    name={groupName}
                    description={groupDescription}
                    onGroupUpdate={onGroupUpdate}
                  />
                </div>
              ) : null}
              {!role.includes('creator') && isUserInGroup ? (
                <div>
                  <Button
                    style={{ borderRadius: '5px' }}
                    variant='danger'
                    onClick={() => setShowAdditionalSettingsModal(true)}
                  >
                    Leave Group
                  </Button>
                  <AdditionalSettingsModal
                    group={group}
                    type={'leave'}
                    showAdditionalSettingsModal={showAdditionalSettingsModal}
                    closeAdditionalSettingsModal={closeAdditionalSettingsModal}
                  />
                </div>
              ) : null}
            </div>
          </div>
        </div>
        <p>{groupDescription}</p>
        {/* Tabs containing the list of users, requests and invite users */}
        <Tabs defaultActiveKey='users'>
          <Tab eventKey='users' title='Users'>
            <UserList
              users={users}
              model={'groups'}
              modelId={group.id}
              removeUser={removeUser}
              role={role}
              competitive={group.competitive}
            />
          </Tab>
          {role.includes('manageUsers') && !group.private ? (
            <Tab eventKey='requests' title='Requests'>
              <div>
                <RequestList
                  requests={requests}
                  requestType={'groups'}
                  typeId={group.id}
                  deleteRequest={deleteRequest}
                  addUser={addUser}
                />
              </div>
            </Tab>
          ) : null}
          {role.includes('inviteUsers') ? (
            <Tab eventKey='invite' title='Invite'>
              <InviteUserList
                users={inviteUsers}
                modelType={'groups'}
                modelId={group.id}
                removeInviteUser={removeInviteUser}
              />
            </Tab>
          ) : null}
        </Tabs>
      </div>
      {/* Bottom component for displaying the list of games in the group */}
      <div className={classes.games}>
        <Card>
          {role.includes('createGames') ? (
            <div style={{ display: 'inline' }}>
              <p
                style={{
                  marginRight: '200px',
                  marginBottom: '-30px',
                  marginTop: '10px',
                }}
              >
                Current Games
              </p>
              <div>
                <Button
                  variant='secondary'
                  className={classes.newbutton}
                  onClick={() => setShowGameModal(true)}
                >
                  {' '}
                  + Start a new Game
                </Button>
                <CreateGameForm
                  showGameModal={showGameModal}
                  handleClose={handleStartGameClose}
                  group={group}
                />
              </div>
            </div>
          ) : (
            <p>Current Games</p>
          )}

          <GameList games={currentGames} />
        </Card>
      </div>
      <div className={classes.previousGames}>
        <Card>
          <p>Previous Games</p>
          <GameList games={finishedGames} />
        </Card>
      </div>
    </div>
  )
}

export default GroupInfo

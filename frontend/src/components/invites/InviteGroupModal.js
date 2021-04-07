import React, { useState, useEffect } from 'react'
import axios from '../../axios'
import {
  Button,
  FormControl,
  Image,
  InputGroup,
  ListGroup,
  Modal,
} from 'react-bootstrap'
import Group from '../groups/Group'
import { baseURL } from '../../axios'

/*******************************************************************************
 * InviteGroupModal Component
 * Modal component for inviting a user to a group inside their UserInfo
 *******************************************************************************/

function InviteGroupModal({
  showInviteGroupModal,
  closeInviteGroupModal,
  otherUser,
}) {
  const [inviteGroups, setInviteGroups] = useState([]) //List of all groups which the user can be invited to
  const [invitedGroups, setInvitedGroups] = useState([]) //List of all groups which the user can be invited to
  const [selectedGroup, setSelectedGroup] = useState({}) //The currently selected group in the inviteGroups list
  const [message, setMessage] = useState() //Message to send the user with the invite

  useEffect(() => {
    axios.get(`/api/v1/users/${otherUser._id}/groupInvites`).then((res) => {
      const inviteInfo = res.data.data
      setInviteGroups(inviteInfo.groups)
      setInvitedGroups(inviteInfo.alreadyInvitedGroups)
    })
  }, [otherUser._id])

  //Send the invite to the user
  function inviteUser() {
    const reqBody = { message: message }
    axios
      .post(
        `/api/v1/groups/${selectedGroup._id}/invite/${otherUser._id}`,
        reqBody
      )
      .then((res) => {
        let newInviteGroups = inviteGroups
        newInviteGroups.splice(inviteGroups.indexOf(selectedGroup), 1)
        setInviteGroups(newInviteGroups)
        let newInvitedGroups = invitedGroups
        newInvitedGroups.push(selectedGroup)
        setInvitedGroups(newInvitedGroups)
        closeInviteGroupModal()
      })
      .catch((err) => {
        console.log(`err : ${err}`)
      })
  }

  //Handles changes to the message state
  const handleMessageChange = (e) => {
    setMessage(e.target.value)
  }

  return (
    <Modal show={showInviteGroupModal} onHide={closeInviteGroupModal}>
      <Modal.Header closeButton>
        <Modal.Title>Invite to Group</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Modal body contains the list of groups where the user can be invited (inviteGroups) */}
        <ListGroup>
          {inviteGroups.length < 1 && invitedGroups.length < 1 ? (
            <ListGroup.Item style={{ height: '70px' }}>
              <p style={{ marginLeft: '125px', marginTop: '10px' }}>
                No groups to display
              </p>
            </ListGroup.Item>
          ) : null}
          {inviteGroups.map((group) =>
            selectedGroup._id === group._id ? (
              //Set the selected group
              <ListGroup.Item
                style={{ backgroundColor: 'lightblue' }}
                onClick={() => setSelectedGroup(group)}
              >
                <Group group={group} disableHover={true} />
              </ListGroup.Item>
            ) : (
              // List of all groups that are not selected
              <ListGroup.Item
                style={{ backgroundColor: 'white' }}
                onClick={() => setSelectedGroup(group)}
              >
                <Group group={group} disableHover={true} />
              </ListGroup.Item>
            )
          )}
          {invitedGroups.map((group) => (
            <ListGroup.Item>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Image
                  style={{ maxWidth: '50px', maxHeight: '50px' }}
                  src={`${baseURL}/uploads/${group.photo}`}
                />
                <p>{group.name}</p>
                {group.sports.map((sport) => (
                  <Image
                    src={`${baseURL}/uploads/${sport}.png`}
                    style={{ maxWidth: '30px', maxHeight: '30px' }}
                  />
                ))}
                <p style={{ color: 'green' }}>✓ Already Invited</p>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Modal.Body>
      <Modal.Footer>
        {/* Modal footer contains message to send user and 'Invite User' button */}
        <InputGroup className='mb-3' key='description'>
          <InputGroup.Prepend>
            <InputGroup.Text>Message</InputGroup.Text>
          </InputGroup.Prepend>
          <FormControl
            as='textarea'
            onChange={handleMessageChange}
          ></FormControl>
        </InputGroup>
        <Button variant='success' onClick={inviteUser}>
          Invite User
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default InviteGroupModal

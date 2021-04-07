import React, { useState, useEffect } from 'react'
import axios from '../../axios'
import {
  Button,
  Image,
  Modal,
  InputGroup,
  FormControl,
  ListGroup,
} from 'react-bootstrap'
import Game from '../games/Game'
import { baseURL } from '../../axios'

/*******************************************************************************
 * InviteGameModal Component
 * Modal component for inviting a user to a game inside their UserInfo
 *******************************************************************************/

function InviteGameModal({
  showInviteGameModal,
  closeInviteGameModal,
  otherUser,
}) {
  const [inviteGames, setInviteGames] = useState([]) //List of all games which the user can be invited to
  const [invitedGames, setInvitedGames] = useState([])
  const [selectedGame, setSelectedGame] = useState({}) //The currently selected game in the inviteGames list
  const [message, setMessage] = useState() //Message to send the user with the invite

  //Find the games which the user can be invited to
  useEffect(() => {
    axios.get(`/api/v1/users/${otherUser._id}/gameInvites`).then((res) => {
      const inviteInfo = res.data.data
      setInviteGames(inviteInfo.games)
      setInvitedGames(inviteInfo.alreadyInvitedGames)
    })
  }, [otherUser._id])

  //Send the invite to the user
  function inviteUser() {
    const reqBody = { message: message }
    axios
      .post(
        `/api/v1/games/${selectedGame._id}/invite/${otherUser._id}`,
        reqBody
      )
      .then((res) => {
        let newInviteGames = inviteGames
        newInviteGames.splice(inviteGames.indexOf(selectedGame), 1)
        setInviteGames(newInviteGames)
        let newInvitedGames = invitedGames
        newInvitedGames.push(selectedGame)
        setInvitedGames(newInvitedGames)
        closeInviteGameModal()
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
    <Modal show={showInviteGameModal} onHide={closeInviteGameModal}>
      <Modal.Header closeButton>
        <Modal.Title>Invite to Game</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Modal body contains the list of games where the user can be invited (inviteGames) */}
        <ListGroup>
          {inviteGames.length < 1 && invitedGames.length < 1 ? (
            <ListGroup.Item style={{ height: '70px' }}>
              <p style={{ marginLeft: '125px', marginTop: '10px' }}>
                No games to display
              </p>
            </ListGroup.Item>
          ) : null}
          {inviteGames.map((game) =>
            // Set the selected game
            selectedGame._id === game._id ? (
              <ListGroup.Item
                style={{ backgroundColor: 'lightblue' }}
                onClick={() => setSelectedGame(game)}
              >
                <Game game={game} disableHover={true} />
              </ListGroup.Item>
            ) : (
              // List of all games that are not selected
              <ListGroup.Item
                style={{ backgroundColor: 'white' }}
                onClick={() => setSelectedGame(game)}
              >
                <Game game={game} disableHover={true} />
              </ListGroup.Item>
            )
          )}
          {invitedGames.map((game) => (
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
                  src={`${baseURL}/uploads/${game.photo}`}
                />
                <p>{game.title}</p>
                <Image
                  src={`${baseURL}/uploads/${game.sport}.png`}
                  style={{
                    maxWidth: '30px',
                    maxHeight: '30px',
                  }}
                />
                <p style={{ color: 'green' }}>✓ Already Invited</p>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Modal.Body>
      {/* Modal footer contains message to send user and 'Invite User' button */}
      <Modal.Footer>
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

export default InviteGameModal

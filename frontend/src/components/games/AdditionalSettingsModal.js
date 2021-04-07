import React, { useState } from 'react'
import axios from '../../axios'
import { Alert, Button, Modal } from 'react-bootstrap'
import { Redirect } from 'react-router-dom'

/****************************************************************************************
 * GameSettings Component
 * Additional settings modal component for selecting winner and confirming to delete game
 ****************************************************************************************/

function GameSettings({
  game,
  showSettingsModal,
  handleClose,
  closeSettingsModal,
  type,
  team1,
  team2,
  setGameWinner,
}) {
  const [redirect, setRedirect] = useState(false) //Redirect user to dashboard if game is deleted
  const [error, setError] = useState('')
  //Set the game winner when user clicks on 'Finish Game' button
  function finishGame(winner) {
    const reqBody = { winner: winner }
    axios
      .put(`/api/v1/games/${game._id}/finish`, reqBody)
      .then((res) => {
        setGameWinner(res.data.data.game.winner)
        handleClose()
      })
      .catch((err) => {
        setError(err.response.data.error)
      })
  }

  //Delete the game when user clicks on 'Delete Game' button and confirms
  function deleteGame() {
    axios.delete(`/api/v1/games/${game._id}`).then((res) => {
      setRedirect(true)
    })
  }

  function leaveGame() {
    axios.put(`/api/v1/users/leaveGame/${game._id}`).then((res) => {
      setRedirect(true)
    })
  }

  return (
    <Modal show={showSettingsModal} onHide={closeSettingsModal}>
      <Modal.Header closeButton>
        <Modal.Title>Settings</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error === '' ? null : <Alert variant='danger'>{error}</Alert>}
        {/* Modal body if user selects 'Delete Game' option */}
        {type === 'deleteGame' ? (
          <div>
            <Modal.Title>
              Are you sure you want to delete this game?
            </Modal.Title>
            <br />
            <Button
              style={{ marginLeft: '120px' }}
              variant='danger'
              onClick={deleteGame}
            >
              Yes
            </Button>
            <Button
              style={{ marginLeft: '50px' }}
              variant='info'
              onClick={closeSettingsModal}
            >
              No
            </Button>
          </div>
        ) : null}
        {/* Modal body if user selects 'Finish Game' option */}
        {type === 'finishGame' ? (
          <div>
            <Modal.Title>Who won the game?</Modal.Title>
            <br />
            <Button
              style={{ marginLeft: '120px' }}
              variant='primary'
              onClick={() => finishGame('team1')}
            >
              {team1.name}
            </Button>
            <Button
              style={{ marginLeft: '50px' }}
              variant='primary'
              onClick={() => finishGame('team2')}
            >
              {team2.name}
            </Button>
          </div>
        ) : null}
        {type === 'leave' ? (
          <div>
            <Modal.Title>Are you sure you want to leave the game?</Modal.Title>
            <label>
              You will lose all your information including wins and losses
            </label>
            <br />
            <Button
              style={{ marginLeft: '120px' }}
              variant='primary'
              onClick={leaveGame}
            >
              Yes
            </Button>
            <Button
              style={{ marginLeft: '50px' }}
              variant='primary'
              onClick={closeSettingsModal}
            >
              No
            </Button>
          </div>
        ) : null}
      </Modal.Body>
      {redirect ? <Redirect to='/dashboard' /> : null}
    </Modal>
  )
}

export default GameSettings
